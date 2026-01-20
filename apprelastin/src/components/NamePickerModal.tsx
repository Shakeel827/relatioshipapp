import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { theme } from "../theme/theme";

export function NamePickerModal({
  visible,
  names,
  onClose,
  onPick,
}: {
  visible: boolean;
  names: string[];
  onClose: () => void;
  onPick: (name: string) => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={StyleSheet.absoluteFill}>
        <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFill} />
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>Choose a name</Text>
          {names.map((n) => (
            <Pressable
              key={n}
              onPress={() => onPick(n)}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
            >
              <Text style={styles.name}>{n}</Text>
            </Pressable>
          ))}
          <Pressable onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Not now</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    marginTop: "auto",
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    borderTopLeftRadius: theme.radii.card,
    borderTopRightRadius: theme.radii.card,
    borderTopWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: "rgba(244,239,230,0.55)",
  },
  title: {
    color: theme.colors.inkMuted,
    fontSize: theme.type.small.fontSize,
    letterSpacing: 0.6,
    marginBottom: theme.spacing.md,
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.hairline,
  },
  name: {
    color: theme.colors.ink,
    fontSize: theme.type.body.fontSize,
    lineHeight: theme.type.body.lineHeight,
  },
  close: { marginTop: theme.spacing.lg, alignSelf: "flex-start" },
  closeText: { color: theme.colors.inkMuted, fontSize: theme.type.small.fontSize, letterSpacing: 0.3 },
});

