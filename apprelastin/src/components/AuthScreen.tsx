import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { theme } from "../theme/theme";

const { height } = Dimensions.get("window");

export interface AuthScreenProps {
  mode: "login" | "signup";
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
}

/**
 * AUTHENTICATION SCREEN
 *
 * Minimal, reassuring design for login/signup
 * - Soft focus animations
 * - Friendly, reassuring copy
 * - Large touch targets
 * - No aggressive CTAs
 */
export const AuthScreen: React.FC<AuthScreenProps> = ({
  mode,
  onSubmit,
  isLoading = false,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.motion.calm,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: theme.motion.calm,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleSubmit = () => {
    // Validation
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    onSubmit(email, password);
  };

  const isValid = email.trim() && password.trim() &&
    (mode === "login" || password === confirmPassword && password.length >= 6);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.background} />

      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>
            {mode === "login" ? "Welcome back" : "Let's get started"}
          </Text>
          <Text style={styles.subheading}>
            {mode === "login"
              ? "Your conversations stay private."
              : "A calmer way to communicate."}
          </Text>
        </View>

        {/* Input fields */}
        <View style={styles.inputsContainer}>
          {/* Email field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={theme.colors.inkLight}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError("");
              }}
              editable={!isLoading}
            />
          </View>

          {/* Password field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={theme.colors.inkLight}
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError("");
              }}
              editable={!isLoading}
            />
          </View>

          {/* Confirm password (signup only) */}
          {mode === "signup" && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Confirm password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={theme.colors.inkLight}
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError("");
                }}
                editable={!isLoading}
              />
            </View>
          )}

          {/* Error message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        {/* Privacy note */}
        <Text style={styles.privacyNote}>
          By {mode === "login" ? "signing in" : "creating an account"}, you agree to our Privacy Policy
          and Terms of Service.
        </Text>

        {/* Submit button */}
        <TouchableOpacity
          style={[
            styles.button,
            !isValid && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isValid || isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isLoading
              ? "Just a moment..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Social auth hint */}
        <View style={styles.socialHintContainer}>
          <Text style={styles.socialHintText}>
            {mode === "login"
              ? "Don't have an account? Sign up instead."
              : "Already have an account? Sign in instead."}
          </Text>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.paper,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: height * 0.1,
    paddingBottom: theme.spacing.xl,
    justifyContent: "center",
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

  inputsContainer: {
    marginBottom: theme.spacing.xl,
  },

  fieldContainer: {
    marginBottom: theme.spacing.lg,
  },

  label: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.ink,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  input: {
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    borderRadius: theme.radii.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.ink,
    backgroundColor: theme.colors.paper,
    fontWeight: "400",
  },

  errorContainer: {
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radii.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },

  errorText: {
    color: theme.colors.paper,
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },

  privacyNote: {
    fontSize: 12,
    fontWeight: "400",
    color: theme.colors.inkLight,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: theme.spacing.lg,
  },

  button: {
    backgroundColor: theme.colors.blueDusk,
    borderRadius: theme.radii.card,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: theme.colors.paper,
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.3,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.hairline,
  },

  dividerText: {
    paddingHorizontal: theme.spacing.md,
    fontSize: 12,
    color: theme.colors.inkLight,
    fontWeight: "400",
  },

  socialHintContainer: {
    alignItems: "center",
  },

  socialHintText: {
    fontSize: 13,
    fontWeight: "400",
    color: theme.colors.inkMuted,
    lineHeight: 20,
  },
});
