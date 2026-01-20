import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { BlurView } from "expo-blur";
import { theme } from "../theme/theme";

type Props = ViewProps & { intensity?: number };

export function Surface({ style, intensity = 18, children, ...rest }: Props) {
  return (
    <View style={[styles.wrap, style]} {...rest}>
      <BlurView intensity={intensity} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.edge} />
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: theme.radii.card,
    overflow: "hidden",
    backgroundColor: theme.colors.glass,
  },
  edge: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    borderRadius: theme.radii.card,
  },
  inner: {
    padding: theme.spacing.lg,
  },
});

