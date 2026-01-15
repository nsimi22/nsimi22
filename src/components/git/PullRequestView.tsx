import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Icon } from '@/components/common';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '@/constants';
import { PullRequestDraft, PendingChange } from '@/types';
import { useFileTree, useTerminal } from '@/contexts';

interface PullRequestViewProps {
  draft: PullRequestDraft;
  onClose: () => void;
  onSubmit: (draft: PullRequestDraft) => void;
}

export function PullRequestView({ draft, onClose, onSubmit }: PullRequestViewProps) {
  const [title, setTitle] = useState(draft.title);
  const [description, setDescription] = useState(draft.description);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { connectedRepo } = useFileTree();

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate PR creation
    await new Promise(resolve => setTimeout(resolve, 1500));

    onSubmit({
      ...draft,
      title,
      description,
    });

    setIsSubmitting(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Icon name="chevron-left" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerIcon}>
          <Icon name="git-pull-request" size={20} color={COLORS.text} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Create Pull Request</Text>
          <Text style={styles.headerSubtitle}>
            {connectedRepo?.owner}/{connectedRepo?.repo}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="PR title"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        {/* Branch Info */}
        <View style={styles.field}>
          <Text style={styles.label}>Branch</Text>
          <View style={styles.branchInfo}>
            <Icon name="git-branch" size={14} color={COLORS.secondary} />
            <Text style={styles.branchText}>{draft.branch}</Text>
            <Text style={styles.branchArrow}>→</Text>
            <Text style={styles.branchText}>{draft.base}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your changes..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Changed Files */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Changed Files ({draft.changes.length})
          </Text>
          <View style={styles.changedFiles}>
            {draft.changes.map((change, index) => (
              <View key={index} style={styles.changedFile}>
                <Icon name="file-code" size={14} color={COLORS.info} />
                <Text style={styles.changedFileName}>{change.file}</Text>
                <View style={styles.changedFileBadge}>
                  <Text style={styles.changedFileBadgeText}>modified</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Icon name="git-pull-request" size={16} color={COLORS.text} />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Creating...' : 'Create PR'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.base,
  },
  field: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  textArea: {
    minHeight: 120,
    paddingTop: SPACING.sm,
  },
  branchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  branchText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
  },
  branchArrow: {
    color: COLORS.textMuted,
  },
  changedFiles: {
    gap: SPACING.xs,
  },
  changedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
  },
  changedFileName: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.mono,
  },
  changedFileBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  changedFileBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.warning,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.lg,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});

export default PullRequestView;
