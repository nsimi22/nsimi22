import { API_CONFIG } from '@/constants';
import { SecureStorage } from './storage';
import { ClaudeMessage, ClaudeResponse, FileEdit } from '@/types';

interface ClaudeRequestOptions {
  messages: ClaudeMessage[];
  maxTokens?: number;
  model?: string;
  system?: string;
}

interface ParsedResponse {
  text: string;
  fileEdits: FileEdit[];
  commands: string[];
}

class ClaudeService {
  private apiKey: string | null = null;
  private baseUrl = API_CONFIG.ANTHROPIC_BASE_URL;

  async initialize(): Promise<boolean> {
    this.apiKey = await SecureStorage.getApiKey();
    return !!this.apiKey;
  }

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  async validateApiKey(key: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: API_CONFIG.DEFAULT_MODEL,
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hello' }],
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  async sendMessage(options: ClaudeRequestOptions): Promise<ClaudeResponse> {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    const {
      messages,
      maxTokens = API_CONFIG.MAX_TOKENS,
      model = API_CONFIG.DEFAULT_MODEL,
      system,
    } = options;

    const body: Record<string, unknown> = {
      model,
      max_tokens: maxTokens,
      messages,
    };

    if (system) {
      body.system = system;
    }

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    return response.json();
  }

  async chat(
    userMessage: string,
    context?: {
      currentFile?: string;
      fileContent?: string;
      pendingChanges?: string[];
    }
  ): Promise<ParsedResponse> {
    // Build system prompt based on context
    let systemPrompt = `You are Claude Code, an AI coding assistant running on a mobile device.
You help users edit code files, understand codebases, and manage git operations.

When asked to edit files:
1. Analyze the request carefully
2. Provide clear explanations of what you'll change
3. Show the specific changes using a diff format
4. Be concise but thorough

When responding, use this format for file edits:
<file_edit>
<path>/path/to/file</path>
<description>Brief description of changes</description>
<diff>
- removed line
+ added line
</diff>
</file_edit>

For commands, use:
<command>git status</command>

Keep responses focused and mobile-friendly (concise but complete).`;

    if (context?.currentFile && context?.fileContent) {
      systemPrompt += `\n\nCurrently open file: ${context.currentFile}\n\nFile content:\n\`\`\`\n${context.fileContent}\n\`\`\``;
    }

    if (context?.pendingChanges?.length) {
      systemPrompt += `\n\nPending changes:\n${context.pendingChanges.join('\n')}`;
    }

    const response = await this.sendMessage({
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const responseText = response.content[0]?.text || '';
    return this.parseResponse(responseText);
  }

  private parseResponse(text: string): ParsedResponse {
    const fileEdits: FileEdit[] = [];
    const commands: string[] = [];
    let cleanText = text;

    // Extract file edits
    const fileEditRegex = /<file_edit>([\s\S]*?)<\/file_edit>/g;
    let match;

    while ((match = fileEditRegex.exec(text)) !== null) {
      const editContent = match[1];
      const pathMatch = /<path>(.*?)<\/path>/s.exec(editContent);
      const descMatch = /<description>(.*?)<\/description>/s.exec(editContent);
      const diffMatch = /<diff>([\s\S]*?)<\/diff>/s.exec(editContent);

      if (pathMatch && diffMatch) {
        fileEdits.push({
          path: pathMatch[1].trim(),
          description: descMatch?.[1].trim() || 'File modification',
          originalContent: '',
          newContent: diffMatch[1].trim(),
        });
      }

      cleanText = cleanText.replace(match[0], '');
    }

    // Extract commands
    const commandRegex = /<command>(.*?)<\/command>/g;
    while ((match = commandRegex.exec(text)) !== null) {
      commands.push(match[1].trim());
      cleanText = cleanText.replace(match[0], '');
    }

    return {
      text: cleanText.trim(),
      fileEdits,
      commands,
    };
  }

  async generateCommitMessage(changes: string[]): Promise<string> {
    const response = await this.sendMessage({
      system: 'Generate a concise, conventional commit message for the following changes. Return only the commit message, nothing else.',
      messages: [
        {
          role: 'user',
          content: `Changes:\n${changes.join('\n')}`,
        },
      ],
      maxTokens: 100,
    });

    return response.content[0]?.text.trim() || 'Update files';
  }

  async generatePRDescription(
    title: string,
    changes: string[]
  ): Promise<string> {
    const response = await this.sendMessage({
      system: 'Generate a clear, concise pull request description in markdown format. Include a summary section and a list of changes.',
      messages: [
        {
          role: 'user',
          content: `PR Title: ${title}\n\nChanges:\n${changes.join('\n')}`,
        },
      ],
      maxTokens: 500,
    });

    return response.content[0]?.text || '';
  }

  async explainCode(code: string, language: string): Promise<string> {
    const response = await this.sendMessage({
      system: 'You are a code explanation assistant. Explain the provided code clearly and concisely.',
      messages: [
        {
          role: 'user',
          content: `Explain this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
    });

    return response.content[0]?.text || '';
  }

  async suggestFix(code: string, error: string): Promise<ParsedResponse> {
    const response = await this.sendMessage({
      system: `You are a debugging assistant. Analyze the error and suggest a fix.
Use the <file_edit> format for any code changes.`,
      messages: [
        {
          role: 'user',
          content: `Code:\n\`\`\`\n${code}\n\`\`\`\n\nError:\n${error}`,
        },
      ],
    });

    return this.parseResponse(response.content[0]?.text || '');
  }
}

export const claudeService = new ClaudeService();
export default claudeService;
