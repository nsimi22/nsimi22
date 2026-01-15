// Authentication Types
export enum AuthState {
  CHECKING = 'checking',
  UNAUTHENTICATED = 'unauthenticated',
  OAUTH_PENDING = 'oauth_pending',
  AUTHENTICATED = 'authenticated',
}

export type AuthMethod = 'oauth' | 'apikey' | null;

export interface User {
  id?: string;
  email: string;
  name?: string;
  org?: string;
  keyPreview?: string;
}

export interface AuthContextType {
  authState: AuthState;
  authMethod: AuthMethod;
  user: User | null;
  login: () => Promise<void>;
  authenticateWithApiKey: (key: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Terminal Types
export enum MessageType {
  USER = 'user',
  CLAUDE = 'claude',
  SYSTEM = 'system',
  FILE_EDIT = 'file_edit',
  DIFF = 'diff',
  GIT = 'git',
  ERROR = 'error',
  SUCCESS = 'success',
  AUTH = 'auth',
  LINK = 'link',
  LOADING = 'loading',
}

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
  lineNumber?: number;
}

export interface FileDiff {
  filename: string;
  action: 'create' | 'modify' | 'delete';
  diff: DiffLine[];
}

export interface LinkMeta {
  url: string;
  label: string;
}

export interface TerminalMessage {
  id: string;
  type: MessageType;
  content: string | null;
  meta?: FileDiff | LinkMeta | Record<string, unknown>;
  timestamp: number;
}

// File Browser Types
export type FileLanguage = 'tsx' | 'ts' | 'js' | 'jsx' | 'json' | 'md' | 'css' | 'html' | 'py' | 'go' | 'rs' | 'unknown';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  expanded?: boolean;
  children?: FileNode[];
  language?: FileLanguage;
  content?: string;
  gitRepo?: boolean;
  branch?: string;
  modified?: boolean;
  size?: number;
  lastModified?: Date;
}

export interface FileTreeState {
  root: FileNode | null;
  selectedFile: FileNode | null;
  expandedPaths: Set<string>;
}

// Git Types
export interface GitRepo {
  owner: string;
  repo: string;
  branch: string;
  url?: string;
}

export interface PendingChange {
  file: string;
  path: string;
  original: string;
  modified: string;
  diff?: string;
}

export interface PullRequestDraft {
  title: string;
  branch: string;
  base: string;
  changes: PendingChange[];
  description: string;
}

export interface GitStatus {
  staged: string[];
  unstaged: string[];
  untracked: string[];
  ahead: number;
  behind: number;
}

// Claude API Types
export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  id: string;
  type: string;
  role: 'assistant';
  content: Array<{
    type: 'text';
    text: string;
  }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface FileEdit {
  path: string;
  originalContent: string;
  newContent: string;
  description: string;
}

export interface ClaudeToolResult {
  type: 'file_edit' | 'command' | 'search' | 'explanation';
  data: FileEdit | string;
}

// Settings Types
export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  fontSize: number;
  hapticFeedback: boolean;
  autoSave: boolean;
  cloudSync: boolean;
  terminalHeight: number;
}

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  Settings: undefined;
  FileViewer: { path: string };
  PullRequest: { draft: PullRequestDraft };
};

export type BottomTabParamList = {
  Terminal: undefined;
  Files: undefined;
  Git: undefined;
};

// Storage Keys
export const STORAGE_KEYS = {
  API_KEY: 'claude_api_key',
  USER: 'claude_user',
  AUTH_METHOD: 'auth_method',
  SETTINGS: 'app_settings',
  RECENT_FILES: 'recent_files',
  TERMINAL_HISTORY: 'terminal_history',
} as const;
