import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Screen dimensions
export const SCREEN = {
  WIDTH: width,
  HEIGHT: height,
  IS_SMALL: width < 375,
  IS_TABLET: width >= 768,
};

// Colors
export const COLORS = {
  // Base colors
  background: '#0d0d0d',
  surface: '#1a1a1a',
  surfaceLight: '#2a2a2a',
  border: 'rgba(255, 255, 255, 0.05)',
  borderLight: 'rgba(255, 255, 255, 0.1)',

  // Text colors
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  textMuted: '#666666',

  // Brand colors
  primary: '#f97316', // Orange
  primaryDark: '#ea580c',
  primaryLight: '#fb923c',
  secondary: '#a855f7', // Purple
  secondaryDark: '#9333ea',

  // Semantic colors
  success: '#22c55e',
  successBg: 'rgba(34, 197, 94, 0.1)',
  error: '#ef4444',
  errorBg: 'rgba(239, 68, 68, 0.1)',
  warning: '#f59e0b',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  info: '#3b82f6',
  infoBg: 'rgba(59, 130, 246, 0.1)',

  // Language colors
  typescript: '#3178c6',
  javascript: '#f7df1e',
  json: '#22c55e',
  markdown: '#ffffff',
  python: '#3776ab',
  go: '#00add8',
  rust: '#ce422b',

  // Git colors
  git: '#a855f7',
  gitAdd: '#22c55e',
  gitRemove: '#ef4444',
  gitModify: '#f59e0b',
};

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    mono: 'SpaceMono',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

// Border radius
export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// API Configuration
export const API_CONFIG = {
  ANTHROPIC_BASE_URL: 'https://api.anthropic.com/v1',
  ANTHROPIC_OAUTH_URL: 'https://console.anthropic.com/oauth/device',
  ANTHROPIC_KEYS_URL: 'https://console.anthropic.com/settings/keys',
  DEFAULT_MODEL: 'claude-sonnet-4-20250514',
  MAX_TOKENS: 4096,
  TIMEOUT: 60000,
};

// Terminal configuration
export const TERMINAL_CONFIG = {
  MAX_HISTORY: 1000,
  PROMPT_SYMBOL: '❯',
  SCROLL_THRESHOLD: 100,
};

// File extensions mapping
export const FILE_EXTENSIONS: Record<string, string> = {
  tsx: 'TypeScript React',
  ts: 'TypeScript',
  jsx: 'JavaScript React',
  js: 'JavaScript',
  json: 'JSON',
  md: 'Markdown',
  css: 'CSS',
  scss: 'SCSS',
  html: 'HTML',
  py: 'Python',
  go: 'Go',
  rs: 'Rust',
  java: 'Java',
  kt: 'Kotlin',
  swift: 'Swift',
  rb: 'Ruby',
  php: 'PHP',
  c: 'C',
  cpp: 'C++',
  h: 'C Header',
  yml: 'YAML',
  yaml: 'YAML',
  toml: 'TOML',
  xml: 'XML',
  sql: 'SQL',
  sh: 'Shell',
  bash: 'Bash',
  zsh: 'Zsh',
  fish: 'Fish',
  dockerfile: 'Dockerfile',
  gitignore: 'Git Ignore',
};

// Command help text
export const COMMANDS_HELP = {
  auth: {
    login: { cmd: '/login', desc: 'Sign in with Anthropic OAuth' },
    auth: { cmd: '/auth <key>', desc: 'Authenticate with API key' },
    whoami: { cmd: '/whoami', desc: 'Show current user info' },
    logout: { cmd: '/logout', desc: 'Sign out and clear credentials' },
    apikey: { cmd: '/apikey', desc: 'Show/manage API key' },
  },
  files: {
    files: { cmd: '/files', desc: 'Toggle file browser' },
    open: { cmd: '/open <path>', desc: 'Open a file' },
  },
  git: {
    status: { cmd: '/status', desc: 'Show git status' },
    diff: { cmd: '/diff', desc: 'Show pending changes' },
    commit: { cmd: '/commit <msg>', desc: 'Commit staged changes' },
    pr: { cmd: '/pr <title>', desc: 'Create a pull request' },
  },
  other: {
    clear: { cmd: '/clear', desc: 'Clear terminal' },
    help: { cmd: '/help', desc: 'Show this help' },
  },
};

// Error messages
export const ERROR_MESSAGES = {
  INVALID_API_KEY: 'Invalid API key format. Keys should start with "sk-ant-"',
  AUTH_REQUIRED: 'Please authenticate first. Use /login or /auth <api_key>',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_ERROR: 'Failed to communicate with Claude. Please try again.',
  FILE_NOT_FOUND: 'File not found.',
  PERMISSION_DENIED: 'Permission denied.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  AUTH_SUCCESS: 'Authentication successful!',
  FILE_SAVED: 'File saved successfully.',
  COMMIT_SUCCESS: 'Changes committed successfully.',
  PR_CREATED: 'Pull request created successfully!',
};
