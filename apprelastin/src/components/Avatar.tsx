import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTgTheme } from "../theme/tgTheme";

export function Avatar({ name, uri, size = 44 }: { name?: string; uri?: string; size?: number }) {
  const { theme } = useTgTheme();
  const initials = (name || "?")
    .split(" ")
    .map((p) => p.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2, backgroundColor: theme.colors.chip }]}>
      <Text style={[styles.initials, { color: theme.colors.text }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: "center", justifyContent: "center" },
  initials: { fontWeight: "900" },
});
