import { FileLanguage, FileNode, DiffLine } from '@/types';
import { FILE_EXTENSIONS } from '@/constants';

/**
 * Generate a unique ID for messages
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get the file extension from a filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Get the language type from a filename
 */
export function getFileLanguage(filename: string): FileLanguage {
  const ext = getFileExtension(filename);
  const languageMap: Record<string, FileLanguage> = {
    tsx: 'tsx',
    ts: 'ts',
    js: 'js',
    jsx: 'jsx',
    json: 'json',
    md: 'md',
    css: 'css',
    html: 'html',
    py: 'py',
    go: 'go',
    rs: 'rs',
  };
  return languageMap[ext] || 'unknown';
}

/**
 * Get human-readable file type
 */
export function getFileTypeName(filename: string): string {
  const ext = getFileExtension(filename);
  return FILE_EXTENSIONS[ext] || 'Text File';
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format date relative to now
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

/**
 * Mask an API key for display
 */
export function maskApiKey(key: string): string {
  if (!key || key.length < 16) return '****';
  return `${key.substring(0, 12)}...${key.substring(key.length - 4)}`;
}

/**
 * Validate API key format
 */
export function isValidApiKey(key: string): boolean {
  return key.startsWith('sk-ant-') && key.length > 20;
}

/**
 * Find a file in the file tree by path
 */
export function findFileByPath(tree: FileNode | null, path: string): FileNode | null {
  if (!tree) return null;
  if (tree.path === path) return tree;
  if (tree.children) {
    for (const child of tree.children) {
      const found = findFileByPath(child, path);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Toggle folder expanded state in file tree
 */
export function toggleFolderInTree(tree: FileNode, targetPath: string): FileNode {
  if (tree.path === targetPath && tree.type === 'folder') {
    return { ...tree, expanded: !tree.expanded };
  }
  if (tree.children) {
    return {
      ...tree,
      children: tree.children.map(child => toggleFolderInTree(child, targetPath)),
    };
  }
  return tree;
}

/**
 * Update file content in tree
 */
export function updateFileInTree(tree: FileNode, path: string, content: string): FileNode {
  if (tree.path === path && tree.type === 'file') {
    return { ...tree, content, modified: true };
  }
  if (tree.children) {
    return {
      ...tree,
      children: tree.children.map(child => updateFileInTree(child, path, content)),
    };
  }
  return tree;
}

/**
 * Get all files from tree (flat list)
 */
export function getAllFiles(tree: FileNode): FileNode[] {
  const files: FileNode[] = [];

  function traverse(node: FileNode) {
    if (node.type === 'file') {
      files.push(node);
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  }

  traverse(tree);
  return files;
}

/**
 * Generate diff between two strings
 */
export function generateDiff(original: string, modified: string): DiffLine[] {
  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');
  const diff: DiffLine[] = [];

  let i = 0;
  let j = 0;

  while (i < originalLines.length || j < modifiedLines.length) {
    if (i >= originalLines.length) {
      diff.push({ type: 'add', content: modifiedLines[j], lineNumber: j + 1 });
      j++;
    } else if (j >= modifiedLines.length) {
      diff.push({ type: 'remove', content: originalLines[i], lineNumber: i + 1 });
      i++;
    } else if (originalLines[i] === modifiedLines[j]) {
      diff.push({ type: 'context', content: originalLines[i], lineNumber: i + 1 });
      i++;
      j++;
    } else {
      // Simple diff: mark as remove then add
      diff.push({ type: 'remove', content: originalLines[i], lineNumber: i + 1 });
      diff.push({ type: 'add', content: modifiedLines[j], lineNumber: j + 1 });
      i++;
      j++;
    }
  }

  return diff;
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength - 3)}...`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Parse command from input string
 */
export function parseCommand(input: string): { command: string; args: string[] } | null {
  if (!input.startsWith('/')) return null;
  const parts = input.slice(1).split(' ');
  const command = parts[0];
  const args = parts.slice(1);
  return { command, args };
}

/**
 * Get color for file language
 */
export function getLanguageColor(language: FileLanguage): string {
  const colors: Record<FileLanguage, string> = {
    tsx: '#3178c6',
    ts: '#3178c6',
    js: '#f7df1e',
    jsx: '#f7df1e',
    json: '#22c55e',
    md: '#ffffff',
    css: '#264de4',
    html: '#e34c26',
    py: '#3776ab',
    go: '#00add8',
    rs: '#ce422b',
    unknown: '#666666',
  };
  return colors[language];
}

/**
 * Check if path is within directory
 */
export function isPathWithinDirectory(path: string, directory: string): boolean {
  const normalizedPath = path.replace(/\\/g, '/');
  const normalizedDir = directory.replace(/\\/g, '/');
  return normalizedPath.startsWith(normalizedDir);
}

/**
 * Get parent directory path
 */
export function getParentPath(path: string): string {
  const parts = path.split('/');
  parts.pop();
  return parts.join('/') || '/';
}

/**
 * Get filename from path
 */
export function getFilename(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1] || '';
}
