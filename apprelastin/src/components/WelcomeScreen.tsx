import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { theme } from "../theme/theme";

const { height, width } = Dimensions.get("window");

export interface WelcomeScreenProps {
  onComplete?: () => void;
}

/**
 * WELCOME SCREEN
 *
 * Full-screen animated loading experience
 * - Soft gradient background
 * - Breathing text animation
 * - Calming, meditative pace
 * - NO spinner or progress
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onComplete,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;
  const breatheAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main fade-in sequence
    Animated.sequence([
      // Fade in + scale up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: theme.motion.slow,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: theme.motion.slow,
          useNativeDriver: true,
        }),
      ]),
      // Breathing loop (after initial appear)
      Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 2400, // 2.4s in
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 0,
            duration: 2400, // 2.4s out
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      ),
    ]).start();

    // Call completion callback after delay
    if (onComplete) {
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [fadeAnim, scaleAnim, breatheAnim, onComplete]);

  // Breathing opacity: 0.7 -> 1 -> 0.7
  const breatheOpacity = breatheAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 1, 0.7],
  });

  return (
    <View style={styles.container}>
      {/* Animated gradient background */}
      <Animated.View
        style={[
          styles.gradientOverlay,
          {
            opacity: fadeAnim,
          },
        ]}
      />

      {/* Main content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Main heading */}
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: breatheOpacity,
            },
          ]}
        >
          Pause.
        </Animated.Text>

        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: breatheOpacity,
            },
          ]}
        >
          Then speak.
        </Animated.Text>

        {/* Supporting text */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          A calmer way to communicate.
        </Animated.Text>
      </Animated.View>

      {/* Subtle breathing indicator dots */}
      <View style={styles.dotsContainer}>
        {[0, 0.33, 0.66].map((delay) => (
          <BreathingDot key={delay} delay={delay} />
        ))}
      </View>
    </View>
  );
};

/**
 * Individual breathing dot for subtle animation
 */
const BreathingDot: React.FC<{ delay: number }> = ({ delay }) => {
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          delay: delay * 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.paper,
    opacity: 0.5,
  },

  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },

  title: {
    fontSize: 64,
    fontWeight: "200",
    color: theme.colors.ink,
    marginBottom: theme.spacing.sm,
    letterSpacing: -1,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 48,
    fontWeight: "300",
    color: theme.colors.blueDusk,
    marginBottom: theme.spacing.xl,
    letterSpacing: -0.5,
    textAlign: "center",
  },

  tagline: {
    fontSize: 16,
    fontWeight: "400",
    color: theme.colors.inkMuted,
    letterSpacing: 0.3,
    textAlign: "center",
    lineHeight: 24,
  },

  dotsContainer: {
    position: "absolute",
    bottom: height * 0.1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "center",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.lavender,
    opacity: 0.6,
  },
});
