import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { TerminalMessage as TMessage, MessageType, DiffLine, LinkMeta, FileDiff } from '@/types';
import { Icon } from '@/components/common';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '@/constants';

interface TerminalMessageProps {
  message: TMessage;
}

function DiffView({ diff }: { diff: DiffLine[] }) {
  return (
    <View style={styles.diffContainer}>
      {diff.map((line, index) => (
        <View
          key={index}
          style={[
            styles.diffLine,
            line.type === 'add' && styles.diffLineAdd,
            line.type === 'remove' && styles.diffLineRemove,
          ]}
        >
          <Text style={styles.diffIndicator}>
            {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}
          </Text>
          <Text
            style={[
              styles.diffContent,
              line.type === 'add' && styles.diffContentAdd,
              line.type === 'remove' && styles.diffContentRemove,
            ]}
          >
            {line.content}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function TerminalMessageView({ message }: TerminalMessageProps) {
  const { type, content, meta } = message;

  switch (type) {
    case MessageType.USER:
      return (
        <View style={styles.userMessage}>
          <Text style={styles.prompt}>❯</Text>
          <Text style={styles.userText}>{content}</Text>
        </View>
      );

    case MessageType.CLAUDE:
      return (
        <View style={styles.claudeMessage}>
          <View style={styles.claudeHeader}>
            <Icon name="sparkles" size={14} color={COLORS.primary} />
            <Text style={styles.claudeLabel}>Claude</Text>
          </View>
          <Text style={styles.claudeText}>{content}</Text>
        </View>
      );

    case MessageType.SYSTEM:
      return (
        <View style={styles.systemMessage}>
          <Text style={styles.systemText}>{content}</Text>
        </View>
      );

    case MessageType.AUTH:
      return (
        <View style={styles.authMessage}>
          <Icon name="shield" size={14} color={COLORS.warning} />
          <Text style={styles.authText}>{content}</Text>
        </View>
      );

    case MessageType.LINK:
      const linkMeta = meta as LinkMeta;
      return (
        <TouchableOpacity
          style={styles.linkMessage}
          onPress={() => Linking.openURL(linkMeta.url)}
        >
          <Icon name="globe" size={12} color={COLORS.info} />
          <Text style={styles.linkText}>{linkMeta.label}</Text>
          <Icon name="external-link" size={10} color={COLORS.info} />
        </TouchableOpacity>
      );

    case MessageType.FILE_EDIT:
      const fileMeta = meta as FileDiff;
      return (
        <View style={styles.fileEditContainer}>
          <View style={styles.fileEditHeader}>
            <Icon name="edit" size={14} color={COLORS.info} />
            <Text style={styles.fileEditPath}>{fileMeta.filename}</Text>
            <View style={styles.fileEditBadge}>
              <Text style={styles.fileEditBadgeText}>{fileMeta.action}</Text>
            </View>
          </View>
          <DiffView diff={fileMeta.diff} />
        </View>
      );

    case MessageType.GIT:
      return (
        <View style={styles.gitMessage}>
          <Icon name="git-branch" size={14} color={COLORS.secondary} />
          <Text style={styles.gitText}>{content}</Text>
        </View>
      );

    case MessageType.SUCCESS:
      return (
        <View style={styles.successMessage}>
          <Icon name="check-circle" size={14} color={COLORS.success} />
          <Text style={styles.successText}>{content}</Text>
        </View>
      );

    case MessageType.ERROR:
      return (
        <View style={styles.errorMessage}>
          <Icon name="x-circle" size={14} color={COLORS.error} />
          <Text style={styles.errorText}>{content}</Text>
        </View>
      );

    case MessageType.LOADING:
      return (
        <View style={styles.loadingMessage}>
          <Icon name="loader" size={14} color={COLORS.primary} />
          <Text style={styles.loadingText}>{content}</Text>
        </View>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  // User message
  userMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  prompt: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  userText: {
    flex: 1,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },

  // Claude message
  claudeMessage: {
    paddingVertical: SPACING.sm,
    paddingLeft: SPACING.base,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(249, 115, 22, 0.5)',
  },
  claudeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  claudeLabel: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  claudeText: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 20,
  },

  // System message
  systemMessage: {
    paddingVertical: 2,
  },
  systemText: {
    color: COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },

  // Auth message
  authMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.xs,
    gap: SPACING.sm,
  },
  authText: {
    color: COLORS.warning,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },

  // Link message
  linkMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingLeft: SPACING.lg,
    gap: SPACING.xs,
  },
  linkText: {
    color: COLORS.info,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    fontSize: TYPOGRAPHY.fontSize.sm,
    textDecorationLine: 'underline',
  },

  // File edit
  fileEditContainer: {
    marginVertical: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
  },
  fileEditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: SPACING.sm,
  },
  fileEditPath: {
    flex: 1,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  fileEditBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  fileEditBadgeText: {
    color: COLORS.warning,
    fontSize: TYPOGRAPHY.fontSize.xs,
  },

  // Diff
  diffContainer: {
    padding: SPACING.md,
  },
  diffLine: {
    flexDirection: 'row',
    paddingVertical: 2,
    paddingHorizontal: SPACING.sm,
    marginHorizontal: -SPACING.sm,
  },
  diffLineAdd: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  diffLineRemove: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  diffIndicator: {
    width: 16,
    color: COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    fontSize: TYPOGRAPHY.fontSize.xs,
    textAlign: 'center',
  },
  diffContent: {
    flex: 1,
    color: COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    fontSize: TYPOGRAPHY.fontSize.xs,
  },
  diffContentAdd: {
    color: COLORS.success,
  },
  diffContentRemove: {
    color: COLORS.error,
  },

  // Git message
  gitMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.xs,
    gap: SPACING.sm,
  },
  gitText: {
    flex: 1,
    color: '#c4b5fd',
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },

  // Success message
  successMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.xs,
    gap: SPACING.sm,
  },
  successText: {
    flex: 1,
    color: COLORS.success,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },

  // Error message
  errorMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.xs,
    gap: SPACING.sm,
  },
  errorText: {
    flex: 1,
    color: COLORS.error,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },

  // Loading message
  loadingMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
});

export default TerminalMessageView;
