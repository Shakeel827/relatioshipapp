import React, { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { theme } from "../theme/theme";
import { QuietButton } from "./QuietButton";
import { gentleCues } from "../utils/reflection";

export function ReflectionOverlay({
  open,
  draft,
  onClose,
  onAdjustTone,
  onRelease,
}: {
  open: boolean;
  draft: string;
  onClose: () => void;
  onAdjustTone: () => void;
  onRelease: () => void;
}) {
  const v = useSharedValue(0);
  const cues = useMemo(() => gentleCues(draft), [draft]);

  useEffect(() => {
    v.value = withTiming(open ? 1 : 0, {
      duration: open ? theme.motion.calm : theme.motion.gentle,
      easing: Easing.inOut(Easing.sin),
    });
  }, [open, v]);

  const anim = useAnimatedStyle(() => ({
    opacity: v.value,
    transform: [{ translateY: (1 - v.value) * 18 }],
  }));

  return (
    <Animated.View pointerEvents={open ? "auto" : "none"} style={[styles.wrap, anim]}>
      <BlurView intensity={24} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.edge} />
      <View style={styles.inner}>
        <Text style={styles.kicker}>Reflection</Text>
        {cues.map((c) => (
          <Text key={c} style={styles.cue}>
            {c}
          </Text>
        ))}

        <View style={styles.actions}>
          <QuietButton label="Continue as is" onPress={onClose} />
          <View style={{ height: 10 }} />
          <QuietButton label="Adjust tone" onPress={onAdjustTone} />
          <View style={{ height: 10 }} />
          <QuietButton label="Release message" onPress={onRelease} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 18,
    right: 18,
    top: 64,
    borderRadius: theme.radii.card,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  edge: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    borderRadius: theme.radii.card,
  },
  inner: { padding: theme.spacing.lg },
  kicker: {
    color: theme.colors.inkMuted,
    fontSize: theme.type.small.fontSize,
    letterSpacing: 0.7,
    marginBottom: 10,
  },
  cue: {
    color: theme.colors.ink,
    fontSize: theme.type.body.fontSize,
    lineHeight: theme.type.body.lineHeight,
    marginBottom: 8,
  },
  actions: { marginTop: 12 },
});

