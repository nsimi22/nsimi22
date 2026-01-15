import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FileNode, PendingChange, GitRepo } from '@/types';
import { findFileByPath, toggleFolderInTree, updateFileInTree, generateDiff } from '@/utils';

// Mock initial file tree - in production, this would come from cloud storage
const INITIAL_FILE_TREE: FileNode = {
  name: 'Developer',
  path: '/iCloud/Developer',
  type: 'folder',
  expanded: true,
  children: [
    {
      name: 'volt-mobile',
      path: '/iCloud/Developer/volt-mobile',
      type: 'folder',
      expanded: true,
      gitRepo: true,
      branch: 'main',
      children: [
        {
          name: 'src',
          path: '/iCloud/Developer/volt-mobile/src',
          type: 'folder',
          expanded: true,
          children: [
            {
              name: 'App.tsx',
              path: '/iCloud/Developer/volt-mobile/src/App.tsx',
              type: 'file',
              language: 'tsx',
              content: `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './contexts/AuthContext';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}`,
            },
            {
              name: 'api.ts',
              path: '/iCloud/Developer/volt-mobile/src/api.ts',
              type: 'file',
              language: 'ts',
              content: `import axios from 'axios';

const API_BASE = 'https://api.freedomforever.com/v1';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export async function fetchLeads(userId: string) {
  const response = await api.get(\`/leads?user=\${userId}\`);
  return response.data;
}

export async function updateLead(leadId: string, data: any) {
  const response = await api.patch(\`/leads/\${leadId}\`, data);
  return response.data;
}`,
            },
            {
              name: 'components',
              path: '/iCloud/Developer/volt-mobile/src/components',
              type: 'folder',
              expanded: false,
              children: [
                {
                  name: 'Button.tsx',
                  path: '/iCloud/Developer/volt-mobile/src/components/Button.tsx',
                  type: 'file',
                  language: 'tsx',
                  content: `import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, variant === 'secondary' && styles.secondary]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f97316',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f97316',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});`,
                },
              ],
            },
          ],
        },
        {
          name: 'package.json',
          path: '/iCloud/Developer/volt-mobile/package.json',
          type: 'file',
          language: 'json',
          content: `{
  "name": "volt-mobile",
  "version": "2.1.0",
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.0",
    "@react-navigation/native": "^6.1.0",
    "axios": "^1.6.0"
  }
}`,
        },
        {
          name: 'README.md',
          path: '/iCloud/Developer/volt-mobile/README.md',
          type: 'file',
          language: 'md',
          content: `# Volt Mobile

Sales lead management app for Freedom Forever.

## Getting Started

\`\`\`bash
npm install
npm start
\`\`\`

## Features

- Lead tracking
- Real-time sync
- Offline support
`,
        },
      ],
    },
  ],
};

interface FileTreeContextType {
  fileTree: FileNode;
  selectedFile: FileNode | null;
  pendingChanges: PendingChange[];
  connectedRepo: GitRepo | null;
  selectFile: (file: FileNode) => void;
  toggleFolder: (path: string) => void;
  updateFile: (path: string, content: string) => void;
  addPendingChange: (change: PendingChange) => void;
  clearPendingChanges: () => void;
  setConnectedRepo: (repo: GitRepo | null) => void;
  getFileByPath: (path: string) => FileNode | null;
}

const FileTreeContext = createContext<FileTreeContextType | undefined>(undefined);

interface FileTreeProviderProps {
  children: ReactNode;
}

export function FileTreeProvider({ children }: FileTreeProviderProps) {
  const [fileTree, setFileTree] = useState<FileNode>(INITIAL_FILE_TREE);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [connectedRepo, setConnectedRepo] = useState<GitRepo | null>({
    owner: 'freedom-forever',
    repo: 'volt-mobile',
    branch: 'main',
  });

  const selectFile = useCallback((file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
    }
  }, []);

  const toggleFolder = useCallback((path: string) => {
    setFileTree(prev => toggleFolderInTree(prev, path));
  }, []);

  const updateFile = useCallback((path: string, content: string) => {
    setFileTree(prev => updateFileInTree(prev, path, content));

    // Update selected file if it's the one being edited
    setSelectedFile(prev => {
      if (prev?.path === path) {
        return { ...prev, content, modified: true };
      }
      return prev;
    });
  }, []);

  const addPendingChange = useCallback((change: PendingChange) => {
    setPendingChanges(prev => {
      // Replace if same file, otherwise add
      const filtered = prev.filter(c => c.path !== change.path);
      return [...filtered, change];
    });
  }, []);

  const clearPendingChanges = useCallback(() => {
    setPendingChanges([]);
  }, []);

  const getFileByPath = useCallback((path: string): FileNode | null => {
    return findFileByPath(fileTree, path);
  }, [fileTree]);

  const value: FileTreeContextType = {
    fileTree,
    selectedFile,
    pendingChanges,
    connectedRepo,
    selectFile,
    toggleFolder,
    updateFile,
    addPendingChange,
    clearPendingChanges,
    setConnectedRepo,
    getFileByPath,
  };

  return (
    <FileTreeContext.Provider value={value}>
      {children}
    </FileTreeContext.Provider>
  );
}

export function useFileTree(): FileTreeContextType {
  const context = useContext(FileTreeContext);
  if (context === undefined) {
    throw new Error('useFileTree must be used within a FileTreeProvider');
  }
  return context;
}

export default FileTreeContext;
