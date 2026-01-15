import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, FileTreeProvider, TerminalProvider } from '@/contexts';
import { MainScreen } from '@/screens';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <FileTreeProvider>
            <TerminalProvider>
              <StatusBar style="light" />
              <MainScreen />
            </TerminalProvider>
          </FileTreeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
