import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { TerminalMessage, MessageType, AuthState } from '@/types';
import { generateId } from '@/utils';
import { useAuth } from './AuthContext';
import { useFileTree } from './FileTreeContext';
import { claudeService } from '@/services/claude';

interface TerminalContextType {
  history: TerminalMessage[];
  isProcessing: boolean;
  addMessage: (type: MessageType, content: string | null, meta?: Record<string, unknown>) => void;
  clearHistory: () => void;
  handleInput: (input: string) => Promise<void>;
  initializeTerminal: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

interface TerminalProviderProps {
  children: ReactNode;
}

export function TerminalProvider({ children }: TerminalProviderProps) {
  const [history, setHistory] = useState<TerminalMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { authState, authMethod, user, login, authenticateWithApiKey, logout } = useAuth();
  const { selectedFile, pendingChanges, connectedRepo, addPendingChange, getFileByPath } = useFileTree();

  const addMessage = useCallback((type: MessageType, content: string | null, meta?: Record<string, unknown>) => {
    const message: TerminalMessage = {
      id: generateId(),
      type,
      content,
      meta,
      timestamp: Date.now(),
    };
    setHistory(prev => [...prev, message]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([{ id: generateId(), type: MessageType.SYSTEM, content: 'Terminal cleared\n', timestamp: Date.now() }]);
  }, []);

  const initializeTerminal = useCallback(() => {
    const isAuthenticated = authState === AuthState.AUTHENTICATED;

    if (isAuthenticated) {
      setHistory([
        { id: generateId(), type: MessageType.SYSTEM, content: '╭──────────────────────────────────────╮', timestamp: Date.now() },
        { id: generateId(), type: MessageType.SYSTEM, content: '│     SimiCode IDE v1.0.0 — Mobile     │', timestamp: Date.now() },
        { id: generateId(), type: MessageType.SYSTEM, content: '╰──────────────────────────────────────╯', timestamp: Date.now() },
        { id: generateId(), type: MessageType.SUCCESS, content: '✓ Authenticated', timestamp: Date.now() },
        { id: generateId(), type: MessageType.SYSTEM, content: 'Type a message to start coding, or /help for commands\n', timestamp: Date.now() },
      ]);
    } else {
      setHistory([
        { id: generateId(), type: MessageType.SYSTEM, content: '╭──────────────────────────────────────╮', timestamp: Date.now() },
        { id: generateId(), type: MessageType.SYSTEM, content: '│     SimiCode IDE v1.0.0 — Mobile     │', timestamp: Date.now() },
        { id: generateId(), type: MessageType.SYSTEM, content: '╰──────────────────────────────────────╯', timestamp: Date.now() },
        { id: generateId(), type: MessageType.SYSTEM, content: '', timestamp: Date.now() },
        { id: generateId(), type: MessageType.AUTH, content: 'Authentication required to continue.', timestamp: Date.now() },
        { id: generateId(), type: MessageType.SYSTEM, content: '', timestamp: Date.now() },
        { id: generateId(), type: MessageType.SYSTEM, content: 'Choose an authentication method:', timestamp: Date.now() },
        { id: generateId(), type: MessageType.SYSTEM, content: '  /login          Sign in with Anthropic (OAuth)', timestamp: Date.now() },
        { id: generateId(), type: MessageType.SYSTEM, content: '  /auth <key>     Use an API key directly', timestamp: Date.now() },
        { id: generateId(), type: MessageType.SYSTEM, content: '', timestamp: Date.now() },
        { id: generateId(), type: MessageType.SYSTEM, content: 'Get your API key at: console.anthropic.com/settings/keys', timestamp: Date.now() },
      ]);
    }
  }, [authState]);

  const handleCommand = useCallback(async (command: string, args: string[]) => {
    switch (command) {
      case 'help':
        if (authState !== AuthState.AUTHENTICATED) {
          addMessage(MessageType.SYSTEM, `Authentication Commands:

  /login            Sign in with Anthropic OAuth
  /auth <key>       Authenticate with API key

Get your API key at: console.anthropic.com/settings/keys`);
        } else {
          addMessage(MessageType.SYSTEM, `Available Commands:

Authentication:
  /whoami           Show current user info
  /logout           Sign out and clear credentials
  /apikey           Show/manage API key

Files & Git:
  /files            Toggle file browser
  /open <path>      Open a file
  /status           Show git status
  /diff             Show pending changes
  /commit <msg>     Commit staged changes
  /pr <title>       Create a pull request

Other:
  /clear            Clear terminal
  /help             Show this help`);
        }
        break;

      case 'login':
        if (authState === AuthState.AUTHENTICATED) {
          addMessage(MessageType.SYSTEM, `Already authenticated as ${user?.email || 'API Key User'}`);
          addMessage(MessageType.SYSTEM, 'Use /logout to sign out first.');
        } else {
          addMessage(MessageType.AUTH, 'Starting OAuth flow...');
          try {
            await login();
            addMessage(MessageType.SUCCESS, '✓ Authentication successful!');
          } catch {
            addMessage(MessageType.ERROR, 'OAuth flow was cancelled or failed.');
          }
        }
        break;

      case 'auth':
        const key = args.join('');
        if (!key) {
          addMessage(MessageType.SYSTEM, 'Usage: /auth <your-api-key>');
          addMessage(MessageType.SYSTEM, '');
          addMessage(MessageType.LINK, null, {
            url: 'https://console.anthropic.com/settings/keys',
            label: 'console.anthropic.com/settings/keys',
          });
        } else {
          addMessage(MessageType.SYSTEM, 'Validating API key...');
          const success = await authenticateWithApiKey(key);
          if (success) {
            addMessage(MessageType.SUCCESS, '✓ API key validated!');
            addMessage(MessageType.SYSTEM, 'You can now start coding. Type /help for commands.');
          } else {
            addMessage(MessageType.ERROR, 'Invalid API key format or key is not valid.');
          }
        }
        break;

      case 'whoami':
        if (authState !== AuthState.AUTHENTICATED) {
          addMessage(MessageType.SYSTEM, 'Not authenticated');
        } else {
          addMessage(MessageType.SYSTEM, '┌─ Account Info ─────────────────────┐');
          if (authMethod === 'oauth') {
            addMessage(MessageType.SYSTEM, `│ Email: ${user?.email}`);
            addMessage(MessageType.SYSTEM, `│ Name:  ${user?.name}`);
            addMessage(MessageType.SYSTEM, `│ Org:   ${user?.org}`);
            addMessage(MessageType.SYSTEM, '│ Auth:  OAuth');
          } else {
            addMessage(MessageType.SYSTEM, '│ Auth:  API Key');
            addMessage(MessageType.SYSTEM, `│ Key:   ${user?.keyPreview}`);
          }
          addMessage(MessageType.SYSTEM, '└────────────────────────────────────┘');
        }
        break;

      case 'logout':
        if (authState !== AuthState.AUTHENTICATED) {
          addMessage(MessageType.SYSTEM, 'Not currently authenticated');
        } else {
          addMessage(MessageType.SYSTEM, 'Signing out...');
          logout();
          addMessage(MessageType.SUCCESS, 'Signed out successfully.');
        }
        break;

      case 'status':
        if (authState !== AuthState.AUTHENTICATED) {
          addMessage(MessageType.ERROR, 'Please authenticate first');
          return;
        }
        if (pendingChanges.length === 0) {
          addMessage(MessageType.GIT, `On branch ${connectedRepo?.branch || 'main'}\nNothing to commit, working tree clean`);
        } else {
          addMessage(MessageType.GIT, `On branch ${connectedRepo?.branch || 'main'}\nChanges staged for commit:\n${pendingChanges.map(c => `  modified: ${c.file}`).join('\n')}`);
        }
        break;

      case 'diff':
        if (pendingChanges.length === 0) {
          addMessage(MessageType.SYSTEM, 'No pending changes');
        } else {
          pendingChanges.forEach(change => {
            addMessage(MessageType.DIFF, null, { filename: change.file, diff: change.diff });
          });
        }
        break;

      case 'commit':
        if (authState !== AuthState.AUTHENTICATED) {
          addMessage(MessageType.ERROR, 'Please authenticate first');
          return;
        }
        if (pendingChanges.length === 0) {
          addMessage(MessageType.ERROR, 'Nothing to commit');
        } else {
          const msg = args.join(' ') || 'Update files via SimiCode IDE';
          addMessage(MessageType.GIT, `[${connectedRepo?.branch}] ${msg}\n ${pendingChanges.length} file(s) changed`);
          addMessage(MessageType.SUCCESS, '✓ Changes committed locally');
        }
        break;

      case 'clear':
        clearHistory();
        break;

      default:
        addMessage(MessageType.ERROR, `Unknown command: ${command}. Type /help for available commands.`);
    }
  }, [authState, authMethod, user, login, authenticateWithApiKey, logout, pendingChanges, connectedRepo, addMessage, clearHistory]);

  const handleClaudeRequest = useCallback(async (input: string) => {
    try {
      addMessage(MessageType.LOADING, 'Thinking...');

      const context = selectedFile ? {
        currentFile: selectedFile.path,
        fileContent: selectedFile.content,
        pendingChanges: pendingChanges.map(c => c.file),
      } : undefined;

      const response = await claudeService.chat(input, context);

      // Remove loading message
      setHistory(prev => prev.filter(m => m.type !== MessageType.LOADING));

      // Add Claude's response
      addMessage(MessageType.CLAUDE, response.text);

      // Handle file edits
      for (const edit of response.fileEdits) {
        const file = getFileByPath(edit.path);
        if (file) {
          addMessage(MessageType.FILE_EDIT, null, {
            filename: edit.path,
            action: 'modify',
            diff: [
              { type: 'context', content: '// Changes:' },
              { type: 'add', content: edit.description },
            ],
          });

          addPendingChange({
            file: edit.path.split('/').pop() || edit.path,
            path: edit.path,
            original: file.content || '',
            modified: edit.newContent,
          });
        }
      }

      if (response.fileEdits.length > 0) {
        addMessage(MessageType.SUCCESS, '✓ Changes staged. Use /diff to review or /commit to save.');
      }
    } catch (error) {
      setHistory(prev => prev.filter(m => m.type !== MessageType.LOADING));
      addMessage(MessageType.ERROR, error instanceof Error ? error.message : 'Failed to get response from Claude');
    }
  }, [selectedFile, pendingChanges, getFileByPath, addPendingChange, addMessage]);

  const handleInput = useCallback(async (input: string) => {
    if (!input.trim() || isProcessing) return;

    addMessage(MessageType.USER, input);
    setIsProcessing(true);

    try {
      if (input.startsWith('/')) {
        const parts = input.slice(1).split(' ');
        const command = parts[0];
        const args = parts.slice(1);
        await handleCommand(command, args);
      } else if (authState !== AuthState.AUTHENTICATED) {
        addMessage(MessageType.ERROR, 'Please authenticate first. Use /login or /auth <api_key>');
      } else {
        await handleClaudeRequest(input);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, authState, addMessage, handleCommand, handleClaudeRequest]);

  const value: TerminalContextType = {
    history,
    isProcessing,
    addMessage,
    clearHistory,
    handleInput,
    initializeTerminal,
  };

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal(): TerminalContextType {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
}

export default TerminalContext;
