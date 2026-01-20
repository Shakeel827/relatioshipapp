import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useTgTheme, ThemeMode } from "../theme/tgTheme";
import { useAuth } from "../hooks";
import { getApiBaseUrl } from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

export function SettingsScreen({ navigation }: Props) {
  const { theme, mode, setMode } = useTgTheme();
  const { signOut, isLoading, isSignedIn, user } = useAuth();
  const [reflectionPrompts, setReflectionPrompts] = useState(true);
  const [gentleHaptics, setGentleHaptics] = useState(false);
  const apiUrl = getApiBaseUrl();

  const modeItems = useMemo(
    () =>
      [
        { key: "system" as const, label: "System" },
        { key: "light" as const, label: "Light" },
        { key: "dark" as const, label: "Dark" },
      ],
    []
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderColor: theme.colors.divider }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.accent} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text2 }]}>ACCOUNT</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.divider }]}>
          {isSignedIn ? (
            <>
              <Text style={[styles.rowTitle, { color: theme.colors.text }]}>{user?.email || "Signed in"}</Text>
              <Text style={[styles.rowSub, { color: theme.colors.text2 }]}>Sync chats across devices</Text>
              <Pressable
                onPress={signOut}
                disabled={isLoading}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  { backgroundColor: theme.colors.surface2, borderColor: theme.colors.divider },
                  (pressed || isLoading) && { opacity: 0.75 },
                ]}
              >
                <Text style={[styles.primaryBtnText, { color: theme.colors.text }]}>{isLoading ? "…" : "Sign out"}</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={[styles.rowTitle, { color: theme.colors.text }]}>Anonymous mode</Text>
              <Text style={[styles.rowSub, { color: theme.colors.text2 }]}>Chats won’t sync across devices.</Text>
              <View style={styles.btnRow}>
                <Pressable
                  onPress={() => navigation.navigate("SignIn")}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Text style={styles.primaryBtnTextOnAccent}>Sign in</Text>
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate("SignUp")}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    { backgroundColor: theme.colors.surface2, borderColor: theme.colors.divider },
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Text style={[styles.primaryBtnText, { color: theme.colors.text }]}>Create account</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text2 }]}>APPEARANCE</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.divider }]}>
          <Text style={[styles.rowTitle, { color: theme.colors.text }]}>Theme</Text>
          <View style={[styles.segment, { backgroundColor: theme.colors.surface2, borderColor: theme.colors.divider }]}>
            {modeItems.map((it) => {
              const active = mode === it.key;
              return (
                <Pressable
                  key={it.key}
                  onPress={() => setMode(it.key as ThemeMode)}
                  style={({ pressed }) => [
                    styles.segmentItem,
                    active && { backgroundColor: theme.colors.surface },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text
                    style={{
                      color: active ? theme.colors.text : theme.colors.text2,
                      fontWeight: active ? "800" : "700",
                      fontSize: 13,
                    }}
                  >
                    {it.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text2 }]}>PREFERENCES</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.divider }]}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: theme.colors.text }]}>Reflection layer</Text>
              <Text style={[styles.rowSub, { color: theme.colors.text2 }]}>Gentle cues that never shame.</Text>
            </View>
            <Switch value={reflectionPrompts} onValueChange={setReflectionPrompts} />
          </View>

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: theme.colors.text }]}>Gentle touch</Text>
              <Text style={[styles.rowSub, { color: theme.colors.text2 }]}>Soft feedback only when invited.</Text>
            </View>
            <Switch value={gentleHaptics} onValueChange={setGentleHaptics} />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text2 }]}>ABOUT</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.divider }]}>
          <Text style={[styles.rowSub, { color: theme.colors.text2 }]}>Backend: {apiUrl}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: "900" },
  content: { paddingHorizontal: 12, paddingTop: 12, gap: 10 },
  sectionTitle: { fontSize: 12, fontWeight: "900", letterSpacing: 0.7, marginTop: 4 },
  card: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 14, paddingVertical: 8 },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: "900" },
  rowSub: { marginTop: 4, fontSize: 13, fontWeight: "600", lineHeight: 18 },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  primaryBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  primaryBtnTextOnAccent: { color: "#fff", fontWeight: "900", fontSize: 13 },
  primaryBtnText: { fontWeight: "900", fontSize: 13 },
  segment: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 4,
    flexDirection: "row",
    gap: 4,
  },
  segmentItem: { flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: "center" },
});

