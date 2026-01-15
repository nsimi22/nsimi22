import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, AppSettings, User, TerminalMessage } from '@/types';

/**
 * Secure storage for sensitive data (API keys, tokens)
 */
export const SecureStorage = {
  async setApiKey(key: string): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.API_KEY, key);
  },

  async getApiKey(): Promise<string | null> {
    return SecureStore.getItemAsync(STORAGE_KEYS.API_KEY);
  },

  async deleteApiKey(): Promise<void> {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.API_KEY);
  },

  async setAuthToken(token: string): Promise<void> {
    await SecureStore.setItemAsync('auth_token', token);
  },

  async getAuthToken(): Promise<string | null> {
    return SecureStore.getItemAsync('auth_token');
  },

  async deleteAuthToken(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
  },
};

/**
 * Regular storage for non-sensitive data
 */
export const Storage = {
  // User data
  async setUser(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  async deleteUser(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Auth method
  async setAuthMethod(method: 'oauth' | 'apikey'): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_METHOD, method);
  },

  async getAuthMethod(): Promise<'oauth' | 'apikey' | null> {
    const method = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_METHOD);
    return method as 'oauth' | 'apikey' | null;
  },

  async deleteAuthMethod(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_METHOD);
  },

  // Settings
  async setSettings(settings: AppSettings): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  async getSettings(): Promise<AppSettings | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  },

  // Recent files
  async setRecentFiles(files: string[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.RECENT_FILES, JSON.stringify(files));
  },

  async getRecentFiles(): Promise<string[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_FILES);
    return data ? JSON.parse(data) : [];
  },

  async addRecentFile(path: string): Promise<void> {
    const files = await this.getRecentFiles();
    const filtered = files.filter(f => f !== path);
    const updated = [path, ...filtered].slice(0, 10); // Keep last 10
    await this.setRecentFiles(updated);
  },

  // Terminal history
  async setTerminalHistory(history: TerminalMessage[]): Promise<void> {
    // Only save last 100 messages
    const trimmed = history.slice(-100);
    await AsyncStorage.setItem(STORAGE_KEYS.TERMINAL_HISTORY, JSON.stringify(trimmed));
  },

  async getTerminalHistory(): Promise<TerminalMessage[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TERMINAL_HISTORY);
    return data ? JSON.parse(data) : [];
  },

  async clearTerminalHistory(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.TERMINAL_HISTORY);
  },

  // Clear all data
  async clearAll(): Promise<void> {
    await Promise.all([
      SecureStorage.deleteApiKey(),
      SecureStorage.deleteAuthToken(),
      AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.AUTH_METHOD,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.RECENT_FILES,
        STORAGE_KEYS.TERMINAL_HISTORY,
      ]),
    ]);
  },
};

// Default settings
export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  fontSize: 14,
  hapticFeedback: true,
  autoSave: true,
  cloudSync: true,
  terminalHeight: 300,
};

export default Storage;
