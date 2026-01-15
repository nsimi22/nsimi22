import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import { FileNode, FileLanguage } from '@/types';
import { useFileTree } from '@/contexts';
import { Icon } from '@/components/common';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '@/constants';
import { getFileExtension } from '@/utils';

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  selectedPath: string | null;
  onSelect: (node: FileNode) => void;
  onToggle: (path: string) => void;
}

function FileTreeItem({ node, depth, selectedPath, onSelect, onToggle }: FileTreeItemProps) {
  const isSelected = selectedPath === node.path;
  const isFolder = node.type === 'folder';
  const isExpanded = node.expanded;

  const getFileIconColor = (filename: string): string => {
    const ext = getFileExtension(filename);
    const colors: Record<string, string> = {
      tsx: COLORS.typescript,
      ts: COLORS.typescript,
      js: COLORS.javascript,
      jsx: COLORS.javascript,
      json: COLORS.json,
      md: COLORS.text,
      py: COLORS.python,
      go: COLORS.go,
      rs: COLORS.rust,
    };
    return colors[ext] || COLORS.textMuted;
  };

  const handlePress = () => {
    if (isFolder) {
      onToggle(node.path);
    } else {
      onSelect(node);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.treeItem,
          { paddingLeft: depth * 12 + SPACING.sm },
          isSelected && styles.treeItemSelected,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {isFolder && (
          <View style={styles.chevron}>
            <Icon
              name={isExpanded ? 'chevron-down' : 'chevron-right'}
              size={12}
              color={COLORS.textMuted}
            />
          </View>
        )}

        <Icon
          name={isFolder ? (isExpanded ? 'folder-open' : 'folder') : 'file-code'}
          size={16}
          color={isFolder ? '#fbbf24' : getFileIconColor(node.name)}
        />

        <Text style={[styles.fileName, isSelected && styles.fileNameSelected]} numberOfLines={1}>
          {node.name}
        </Text>

        {node.gitRepo && (
          <View style={styles.branchTag}>
            <Icon name="git-branch" size={10} color={COLORS.textMuted} />
            <Text style={styles.branchText}>{node.branch}</Text>
          </View>
        )}

        {node.modified && <View style={styles.modifiedDot} />}
      </TouchableOpacity>

      {isFolder && isExpanded && node.children?.map(child => (
        <FileTreeItem
          key={child.path}
          node={child}
          depth={depth + 1}
          selectedPath={selectedPath}
          onSelect={onSelect}
          onToggle={onToggle}
        />
      ))}
    </View>
  );
}

interface FileBrowserProps {
  onClose?: () => void;
}

export function FileBrowser({ onClose }: FileBrowserProps) {
  const { fileTree, selectedFile, selectFile, toggleFolder } = useFileTree();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSelectFile = useCallback((node: FileNode) => {
    selectFile(node);
    onClose?.();
  }, [selectFile, onClose]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Icon name="cloud" size={12} color={COLORS.textMuted} />
          <Text style={styles.headerText}>iCloud Drive</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="x" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={14} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search files..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* File Tree */}
      <ScrollView style={styles.treeContainer} showsVerticalScrollIndicator={false}>
        <FileTreeItem
          node={fileTree}
          depth={0}
          selectedPath={selectedFile?.path || null}
          onSelect={handleSelectFile}
          onToggle={toggleFolder}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  headerText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    paddingVertical: SPACING.xs,
  },
  treeContainer: {
    flex: 1,
    paddingVertical: SPACING.sm,
  },
  treeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.sm,
    gap: SPACING.sm,
    borderLeftWidth: 2,
    borderLeftColor: 'transparent',
  },
  treeItemSelected: {
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    borderLeftColor: COLORS.primary,
  },
  chevron: {
    width: 16,
    alignItems: 'center',
  },
  fileName: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
  },
  fileNameSelected: {
    color: COLORS.text,
  },
  branchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 'auto',
  },
  branchText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
  },
  modifiedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.warning,
    marginLeft: SPACING.xs,
  },
});

export default FileBrowser;
