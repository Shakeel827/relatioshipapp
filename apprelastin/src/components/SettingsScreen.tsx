import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { theme } from "../theme/theme";

export interface SettingsScreenProps {
  onLogout?: () => void;
}

interface SettingsState {
  privateMode: boolean;
  toneReminders: boolean;
  animationsEnabled: boolean;
  dataCollection: boolean;
}

/**
 * SETTINGS SCREEN
 *
 * Minimal, trustworthy design
 * - Toggle switches only
 * - Simple language
 * - Privacy-first messaging
 * - No unnecessary options
 */
export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onLogout,
}) => {
  const [settings, setSettings] = useState<SettingsState>({
    privateMode: true,
    toneReminders: true,
    animationsEnabled: true,
    dataCollection: false,
  });

  const handleToggle = (key: keyof SettingsState) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = () => {
    Alert.alert(
      "Sign out",
      "Are you sure? You'll need to sign in again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: onLogout,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Settings</Text>
          <Text style={styles.subheading}>
            Customize your experience
          </Text>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>

          <SettingRow
            label="Private mode"
            description="All conversations are encrypted end-to-end"
            value={settings.privateMode}
            onToggle={() => handleToggle("privateMode")}
            disabled
          />

          <SettingRow
            label="Tone reminders"
            description="Get gentle reflections before sending"
            value={settings.toneReminders}
            onToggle={() => handleToggle("toneReminders")}
          />
        </View>

        {/* Display Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display & Feel</Text>

          <SettingRow
            label="Animations"
            description="Smooth, breathing-style transitions"
            value={settings.animationsEnabled}
            onToggle={() => handleToggle("animationsEnabled")}
          />
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Analytics</Text>

          <SettingRow
            label="Usage analytics"
            description="Help us improve Relastin (anonymous)"
            value={settings.dataCollection}
            onToggle={() => handleToggle("dataCollection")}
          />
        </View>

        {/* Legal & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal & Support</Text>

          <SettingLink
            label="Privacy Policy"
            onPress={() =>
              Alert.alert(
                "Privacy Policy",
                "Visit relastin.app/privacy for full details"
              )
            }
          />

          <SettingLink
            label="Terms of Service"
            onPress={() =>
              Alert.alert(
                "Terms",
                "Visit relastin.app/terms for full details"
              )
            }
          />

          <SettingLink
            label="Contact Support"
            onPress={() =>
              Alert.alert(
                "Support",
                "Email support@relastin.app with any questions"
              )
            }
          />
        </View>

        {/* Account Section */}
        <View style={[styles.section, styles.lastSection]}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App version */}
        <Text style={styles.versionText}>Relastin v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

/**
 * Settings toggle row
 */
interface SettingRowProps {
  label: string;
  description?: string;
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  label,
  description,
  value,
  onToggle,
  disabled = false,
}) => {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLabel}>
        <Text style={styles.settingLabelText}>{label}</Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{
          false: theme.colors.hairline,
          true: theme.colors.lavender,
        }}
        thumbColor={value ? theme.colors.blueDusk : theme.colors.inkLight}
      />
    </View>
  );
};

/**
 * Settings link row
 */
interface SettingLinkProps {
  label: string;
  onPress: () => void;
}

const SettingLink: React.FC<SettingLinkProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.settingLink}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.settingLinkText}>{label}</Text>
      <Text style={styles.settingLinkArrow}>→</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },

  headerContainer: {
    marginBottom: theme.spacing.xxl,
  },

  heading: {
    fontSize: 32,
    fontWeight: "300",
    color: theme.colors.ink,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.5,
  },

  subheading: {
    fontSize: 14,
    fontWeight: "400",
    color: theme.colors.inkMuted,
    lineHeight: 20,
  },

  section: {
    backgroundColor: theme.colors.paper,
    borderRadius: theme.radii.card,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    overflow: "hidden",
  },

  lastSection: {
    marginBottom: theme.spacing.xxl,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.ink,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.hairline,
  },

  settingLabel: {
    flex: 1,
    marginRight: theme.spacing.lg,
  },

  settingLabelText: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.colors.ink,
    marginBottom: 4,
  },

  settingDescription: {
    fontSize: 12,
    fontWeight: "400",
    color: theme.colors.inkMuted,
    lineHeight: 16,
  },

  settingLink: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.hairline,
  },

  settingLinkText: {
    fontSize: 15,
    fontWeight: "400",
    color: theme.colors.blueDusk,
  },

  settingLinkArrow: {
    fontSize: 14,
    fontWeight: "300",
    color: theme.colors.inkLight,
  },

  logoutButton: {
    marginHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radii.card,
    alignItems: "center",
  },

  logoutButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.paper,
    letterSpacing: 0.3,
  },

  versionText: {
    fontSize: 11,
    fontWeight: "400",
    color: theme.colors.inkLight,
    textAlign: "center",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
});
