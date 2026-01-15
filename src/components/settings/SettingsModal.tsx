import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Icon } from '@/components/common';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '@/constants';
import { useAuth } from '@/contexts';
import { AuthState } from '@/types';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onCommand: (command: string) => void;
}

export function SettingsModal({ visible, onClose, onCommand }: SettingsModalProps) {
  const { authState, authMethod, user } = useAuth();
  const isAuthenticated = authState === AuthState.AUTHENTICATED;

  const handleCommand = (cmd: string) => {
    onClose();
    onCommand(cmd);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="x" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* User Info */}
            <View style={styles.userSection}>
              <View style={styles.userAvatar}>
                <Icon name="user" size={20} color={COLORS.text} />
              </View>
              <View style={styles.userInfo}>
                {isAuthenticated ? (
                  <>
                    <Text style={styles.userName}>
                      {user?.name || 'API Key User'}
                    </Text>
                    <Text style={styles.userEmail}>
                      {user?.email || user?.keyPreview}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.userNameMuted}>Not signed in</Text>
                    <Text style={styles.userEmailMuted}>
                      Use /login to authenticate
                    </Text>
                  </>
                )}
              </View>
            </View>

            {isAuthenticated && (
              <View style={styles.authTags}>
                <View
                  style={[
                    styles.authTag,
                    authMethod === 'oauth' ? styles.authTagOAuth : styles.authTagApiKey,
                  ]}
                >
                  <Text
                    style={[
                      styles.authTagText,
                      authMethod === 'oauth'
                        ? styles.authTagTextOAuth
                        : styles.authTagTextApiKey,
                    ]}
                  >
                    {authMethod === 'oauth' ? 'OAuth' : 'API Key'}
                  </Text>
                </View>
                {user?.org && (
                  <View style={styles.authTagOrg}>
                    <Text style={styles.authTagTextOrg}>{user.org}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Actions */}
            <View style={styles.actionsSection}>
              <TouchableOpacity
                style={[styles.actionButton, isAuthenticated && styles.actionButtonDisabled]}
                onPress={() => handleCommand('/login')}
                disabled={isAuthenticated}
              >
                <Icon name="key" size={18} color={isAuthenticated ? COLORS.textMuted : COLORS.textSecondary} />
                <Text style={[styles.actionText, isAuthenticated && styles.actionTextDisabled]}>
                  Sign in with OAuth
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCommand('/apikey')}
              >
                <Icon name="shield" size={18} color={COLORS.textSecondary} />
                <Text style={styles.actionText}>Manage API Key</Text>
              </TouchableOpacity>

              {isAuthenticated && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleCommand('/logout')}
                >
                  <Icon name="log-out" size={18} color={COLORS.error} />
                  <Text style={styles.actionTextDanger}>Sign Out</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* About Section */}
            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>About</Text>
              <Text style={styles.aboutText}>SimiCode IDE v1.0.0</Text>
              <Text style={styles.aboutSubtext}>
                AI-powered mobile code editor with Claude integration
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.base,
  },
  container: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  content: {
    padding: SPACING.base,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text,
  },
  userNameMuted: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textMuted,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  userEmailMuted: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  authTags: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  authTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  authTagOAuth: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  authTagApiKey: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  authTagOrg: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  authTagText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
  },
  authTagTextOAuth: {
    color: COLORS.info,
  },
  authTagTextApiKey: {
    color: COLORS.warning,
  },
  authTagTextOrg: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.secondary,
  },
  actionsSection: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    gap: SPACING.md,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
  },
  actionTextDisabled: {
    color: COLORS.textMuted,
  },
  actionTextDanger: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.error,
  },
  aboutSection: {
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  aboutTitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  aboutText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  aboutSubtext: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});

export default SettingsModal;
