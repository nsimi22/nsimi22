import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Header,
  StatusBar,
  Terminal,
  FileBrowser,
  PendingChangesBar,
  PullRequestView,
  SettingsModal,
} from '@/components';
import { useFileTree, useTerminal } from '@/contexts';
import { COLORS } from '@/constants';
import { PullRequestDraft } from '@/types';

type ViewMode = 'terminal' | 'pr';

export function MainScreen() {
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('terminal');
  const [prDraft, setPrDraft] = useState<PullRequestDraft | null>(null);

  const { pendingChanges, connectedRepo, clearPendingChanges } = useFileTree();
  const { addMessage, handleInput } = useTerminal();

  const handleToggleFiles = useCallback(() => {
    setShowFileBrowser(prev => !prev);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const handleSettingsCommand = useCallback((command: string) => {
    handleInput(command);
  }, [handleInput]);

  const handleCreatePR = useCallback(() => {
    if (pendingChanges.length === 0) return;

    const draft: PullRequestDraft = {
      title: 'Updates from SimiCode IDE',
      branch: `simicode/${Date.now()}`,
      base: connectedRepo?.branch || 'main',
      changes: pendingChanges,
      description: `## Changes\n\n${pendingChanges
        .map(c => `- Modified \`${c.file}\``)
        .join('\n')}\n\n---\n*Created via SimiCode IDE Mobile*`,
    };

    setPrDraft(draft);
    setViewMode('pr');
  }, [pendingChanges, connectedRepo]);

  const handleSubmitPR = useCallback((draft: PullRequestDraft) => {
    // Simulate PR submission
    clearPendingChanges();
    setPrDraft(null);
    setViewMode('terminal');

    // Add success message to terminal
    handleInput(`/pr ${draft.title}`);
  }, [clearPendingChanges, handleInput]);

  const handleClosePR = useCallback(() => {
    setPrDraft(null);
    setViewMode('terminal');
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        onToggleFiles={handleToggleFiles}
        onOpenSettings={handleOpenSettings}
        showFileBrowser={showFileBrowser}
      />

      <View style={styles.content}>
        {/* File Browser Sidebar */}
        {showFileBrowser && (
          <View style={styles.sidebar}>
            <FileBrowser onClose={() => setShowFileBrowser(false)} />
          </View>
        )}

        {/* Main Content Area */}
        <View style={styles.main}>
          {viewMode === 'terminal' && (
            <>
              <Terminal />
              <PendingChangesBar onCreatePR={handleCreatePR} />
            </>
          )}

          {viewMode === 'pr' && prDraft && (
            <PullRequestView
              draft={prDraft}
              onClose={handleClosePR}
              onSubmit={handleSubmitPR}
            />
          )}
        </View>
      </View>

      <StatusBar />

      <SettingsModal
        visible={showSettings}
        onClose={handleCloseSettings}
        onCommand={handleSettingsCommand}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 260,
  },
  main: {
    flex: 1,
  },
});

export default MainScreen;
