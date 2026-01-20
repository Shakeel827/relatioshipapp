import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTgTheme } from "../theme/tgTheme";

export function LoginNudgeModal({
  visible,
  onClose,
  onSignIn,
  onSignUp,
}: {
  visible: boolean;
  onClose(): void;
  onSignIn(): void;
  onSignUp(): void;
}) {
  const { theme } = useTgTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.45)" }]}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Save your chats</Text>
          <Text style={[styles.sub, { color: theme.colors.text2 }]}>
            You can keep chatting anonymously, but signing in keeps your conversations across devices.
          </Text>

          <View style={styles.row}>
            <Pressable onPress={onClose} style={[styles.btnGhost, { borderColor: theme.colors.divider }]}> 
              <Text style={[styles.btnGhostText, { color: theme.colors.text }]}>Not now</Text>
            </Pressable>
            <Pressable onPress={onSignIn} style={[styles.btn, { backgroundColor: theme.colors.accent }]}> 
              <Text style={styles.btnText}>Sign in</Text>
            </Pressable>
          </View>

          <Pressable onPress={onSignUp} style={styles.link}> 
            <Text style={[styles.linkText, { color: theme.colors.accent }]}>Create account</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  card: { width: "100%", maxWidth: 420, borderRadius: 18, padding: 16 },
  title: { fontSize: 18, fontWeight: "800" },
  sub: { marginTop: 8, fontSize: 13, lineHeight: 18 },
  row: { marginTop: 14, flexDirection: "row", gap: 10 },
  btn: { flex: 1, borderRadius: 14, paddingVertical: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "800" },
  btnGhost: { flex: 1, borderRadius: 14, paddingVertical: 12, alignItems: "center", borderWidth: 1 },
  btnGhostText: { fontWeight: "700" },
  link: { marginTop: 10, alignSelf: "center", paddingVertical: 6 },
  linkText: { fontWeight: "800" },
});
