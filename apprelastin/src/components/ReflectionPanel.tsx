import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import { theme } from "../theme/theme";

const { height } = Dimensions.get("window");

export interface ReflectionPanelProps {
  visible: boolean;
  message: string;
  reflection: string;
  onContinue: () => void;
  onAdjust: () => void;
  onSendAnyway: () => void;
  isLoading?: boolean;
}

/**
 * AI REFLECTION PANEL
 *
 * Bottom-sheet style panel for tone reflection
 * - Opens when user taps "How does this sound?"
 * - Frosted glass / soft overlay feel
 * - Gentle tone analysis without judgment
 * - Options to continue, adjust, or send anyway
 */
export const ReflectionPanel: React.FC<ReflectionPanelProps> = ({
  visible,
  message,
  reflection,
  onContinue,
  onAdjust,
  onSendAnyway,
  isLoading = false,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: theme.motion.gentle,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: theme.motion.gentle,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: theme.motion.gentle,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: theme.motion.gentle,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const slideStyle = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [height, 0],
        }),
      },
    ],
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      {/* Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      />

      {/* Bottom sheet */}
      <Animated.View style={[styles.container, slideStyle]}>
        <View style={styles.handle} />

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          scrollEnabled
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>
              How does this sound?
            </Text>
            <Text style={styles.headerSubtitle}>
              A gentle review before you send
            </Text>
          </View>

          {/* User message display */}
          <View style={styles.messageSection}>
            <Text style={styles.sectionLabel}>Your message</Text>
            <View style={styles.messagePreview}>
              <Text style={styles.messagePreviewText}>{message}</Text>
            </View>
          </View>

          {/* Reflection */}
          <View style={styles.reflectionSection}>
            <Text style={styles.sectionLabel}>Gentle reflection</Text>
            <View style={styles.reflectionBox}>
              <Text style={styles.reflectionText}>
                {isLoading ? "Analyzing tone..." : reflection}
              </Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={onContinue}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonPrimaryText}>
                Continue as is
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={onAdjust}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonSecondaryText}>
                Adjust tone
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonTertiary]}
              onPress={onSendAnyway}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonTertiaryText}>
                Send anyway
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info text */}
          <Text style={styles.infoText}>
            This reflection is just a suggestion. You know your message best.
          </Text>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
  },

  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.paper,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.8,
    shadowColor: theme.colors.ink,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 25,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.hairline,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },

  content: {
    flex: 1,
  },

  contentInner: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },

  headerSection: {
    marginBottom: theme.spacing.xl,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "300",
    color: theme.colors.ink,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.3,
  },

  headerSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: theme.colors.inkMuted,
    lineHeight: 18,
  },

  messageSection: {
    marginBottom: theme.spacing.xl,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.ink,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  messagePreview: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
  },

  messagePreviewText: {
    fontSize: 14,
    fontWeight: "400",
    color: theme.colors.ink,
    lineHeight: 20,
  },

  reflectionSection: {
    marginBottom: theme.spacing.xl,
  },

  reflectionBox: {
    backgroundColor: theme.colors.lavenderMist,
    borderRadius: theme.radii.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.lavender,
  },

  reflectionText: {
    fontSize: 14,
    fontWeight: "400",
    color: theme.colors.ink,
    lineHeight: 20,
  },

  buttonsContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },

  button: {
    borderRadius: theme.radii.card,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },

  buttonPrimary: {
    backgroundColor: theme.colors.blueDusk,
  },

  buttonPrimaryText: {
    color: theme.colors.paper,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  buttonSecondary: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.blueDusk,
  },

  buttonSecondaryText: {
    color: theme.colors.blueDusk,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  buttonTertiary: {
    backgroundColor: "transparent",
  },

  buttonTertiaryText: {
    color: theme.colors.inkMuted,
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.3,
  },

  infoText: {
    fontSize: 12,
    fontWeight: "400",
    color: theme.colors.inkLight,
    textAlign: "center",
    lineHeight: 18,
    marginTop: theme.spacing.md,
  },
});
