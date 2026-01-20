import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";
import { AnimatedSanctuaryBackground } from "../components/AnimatedSanctuaryBackground";
import { Surface } from "../components/Surface";
import { QuietButton } from "../components/QuietButton";
import { NamePickerModal } from "../components/NamePickerModal";
import { mockRecipients } from "../data/mockRecipients";
import { theme } from "../theme/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const names = useMemo(() => mockRecipients.map((r) => r.name), []);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [name, setName] = useState<string>(names[0] ?? "Someone");

  return (
    <View style={styles.root}>
      <AnimatedSanctuaryBackground />

      <View style={styles.topRow}>
        <Pressable
          onPress={() => navigation.navigate("Settings")}
          style={({ pressed }) => [styles.settings, pressed && { opacity: 0.6 }]}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Text style={styles.settingsText}>···</Text>
        </Pressable>
      </View>

      <View style={styles.center}>
        <Surface style={styles.card} intensity={22}>
          <Text style={styles.prompt}>Who are you communicating with today?</Text>

          <Pressable
            onPress={() => setPickerOpen(true)}
            style={({ pressed }) => [styles.selector, pressed && { opacity: 0.7 }]}
            accessibilityRole="button"
            accessibilityLabel="Choose who you are communicating with"
          >
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.hint}>tap to change</Text>
          </Pressable>

          <View style={{ height: theme.spacing.lg }} />
          <QuietButton
            label="Enter the writing space"
            onPress={() => navigation.navigate("Compose", { recipientName: name })}
          />
        </Surface>

        <Text style={styles.footer}>Silence is allowed. Space is part of the message.</Text>
      </View>

      <NamePickerModal
        visible={pickerOpen}
        names={names}
        onClose={() => setPickerOpen(false)}
        onPick={(n) => {
          setName(n);
          setPickerOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.paper },
  topRow: {
    paddingTop: 54,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "flex-end",
  },
  settings: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: theme.radii.pill,
    opacity: 0.55,
  },
  settingsText: { color: theme.colors.ink, fontSize: 20, letterSpacing: 2 },

  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  card: { alignSelf: "center", width: "100%", maxWidth: 520 },
  prompt: {
    color: theme.colors.ink,
    fontSize: theme.type.title.fontSize,
    lineHeight: theme.type.title.lineHeight,
  },

  selector: {
    marginTop: theme.spacing.lg,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: theme.radii.card,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  name: { color: theme.colors.ink, fontSize: 22, letterSpacing: 0.2 },
  hint: {
    marginTop: 6,
    color: theme.colors.inkMuted,
    fontSize: theme.type.small.fontSize,
    letterSpacing: 0.4,
  },

  footer: {
    marginTop: theme.spacing.xl,
    textAlign: "center",
    color: theme.colors.inkMuted,
    fontSize: theme.type.small.fontSize,
    letterSpacing: 0.3,
  },
});

