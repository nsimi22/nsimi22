import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { AuthState, AuthMethod, User, AuthContextType } from '@/types';
import { Storage, SecureStorage } from '@/services/storage';
import { claudeService } from '@/services/claude';
import { API_CONFIG } from '@/constants';
import { maskApiKey, isValidApiKey } from '@/utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

WebBrowser.maybeCompleteAuthSession();

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(AuthState.CHECKING);
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      setIsLoading(true);

      // Check for stored API key
      const storedKey = await SecureStorage.getApiKey();
      const storedUser = await Storage.getUser();
      const storedMethod = await Storage.getAuthMethod();

      if (storedKey) {
        // Validate the key is still valid
        const isValid = await claudeService.validateApiKey(storedKey);
        if (isValid) {
          claudeService.setApiKey(storedKey);
          setAuthMethod('apikey');
          setUser(storedUser || { email: 'API Key User', keyPreview: maskApiKey(storedKey) });
          setAuthState(AuthState.AUTHENTICATED);
        } else {
          // Key is invalid, clear it
          await SecureStorage.deleteApiKey();
          setAuthState(AuthState.UNAUTHENTICATED);
        }
      } else if (storedUser && storedMethod === 'oauth') {
        // OAuth user - check if token is still valid
        const token = await SecureStorage.getAuthToken();
        if (token) {
          setAuthMethod('oauth');
          setUser(storedUser);
          setAuthState(AuthState.AUTHENTICATED);
        } else {
          setAuthState(AuthState.UNAUTHENTICATED);
        }
      } else {
        setAuthState(AuthState.UNAUTHENTICATED);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setAuthState(AuthState.UNAUTHENTICATED);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async () => {
    try {
      setAuthState(AuthState.OAUTH_PENDING);

      // Generate device code for OAuth flow
      const deviceCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      // Open browser for OAuth
      const result = await WebBrowser.openAuthSessionAsync(
        `${API_CONFIG.ANTHROPIC_OAUTH_URL}?code=${deviceCode}`,
        Linking.createURL('/auth-callback')
      );

      if (result.type === 'success') {
        // In a real implementation, we would exchange the code for tokens
        // For now, simulate successful OAuth
        const mockUser: User = {
          id: 'user_' + Math.random().toString(36).substring(2, 9),
          email: 'user@example.com',
          name: 'User',
          org: 'Personal',
        };

        await Storage.setUser(mockUser);
        await Storage.setAuthMethod('oauth');

        setUser(mockUser);
        setAuthMethod('oauth');
        setAuthState(AuthState.AUTHENTICATED);
      } else {
        setAuthState(AuthState.UNAUTHENTICATED);
      }
    } catch (error) {
      console.error('OAuth error:', error);
      setAuthState(AuthState.UNAUTHENTICATED);
      throw error;
    }
  }, []);

  const authenticateWithApiKey = useCallback(async (key: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Validate format
      if (!isValidApiKey(key)) {
        return false;
      }

      // Validate with API
      const isValid = await claudeService.validateApiKey(key);
      if (!isValid) {
        return false;
      }

      // Store and set
      await SecureStorage.setApiKey(key);
      await Storage.setAuthMethod('apikey');

      claudeService.setApiKey(key);

      const userData: User = {
        email: 'API Key User',
        keyPreview: maskApiKey(key),
      };

      await Storage.setUser(userData);
      setUser(userData);
      setAuthMethod('apikey');
      setAuthState(AuthState.AUTHENTICATED);

      return true;
    } catch (error) {
      console.error('API key auth error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      // Clear all stored auth data
      await SecureStorage.deleteApiKey();
      await SecureStorage.deleteAuthToken();
      await Storage.deleteUser();
      await Storage.deleteAuthMethod();

      setUser(null);
      setAuthMethod(null);
      setAuthState(AuthState.UNAUTHENTICATED);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    authState,
    authMethod,
    user,
    login,
    authenticateWithApiKey,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
