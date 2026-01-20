import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { createInvite, acceptInvite } from "../services/api";
import { useTgTheme } from "../theme/tgTheme";
import { useAuth } from "../hooks";
import { LoginNudgeModal } from "../components/LoginNudgeModal";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

export const InviteScreen: React.FC = () => {
  const { theme } = useTgTheme();
  const { isSignedIn } = useAuth();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [code, setCode] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [needLogin, setNeedLogin] = useState(false);

  async function onCreate() {
    setStatus(null);
    if (!isSignedIn) { setNeedLogin(true); return; }
    try {
      const res = await createInvite();
      setCode(res.code);
      setLink(res.link);
      setStatus("Invite created");
      setOpen(true);
    } catch {
      setStatus("Failed to create invite");
    }
  }

  async function onCopy() {
    if (!link && !code) return;
    await Clipboard.setStringAsync(link || code!);
    setStatus("Copied");
  }

  async function onAccept() {
    if (!code) return;
    try {
      await acceptInvite(code);
      setStatus("Accepted – chat created");
      setOpen(false);
    } catch {
      setStatus("Invalid code");
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.bg }] }>
      <View style={styles.center}>
        <TouchableOpacity
          onPress={onCreate}
          style={[styles.cta, { backgroundColor: theme.colors.accent }]}
        >
          <Text style={styles.ctaText}>Create Invite</Text>
        </TouchableOpacity>
        {status ? <Text style={[styles.status, { color: theme.colors.text2 }]}>{status}</Text> : null}
      </View>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.divider }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-add-outline" size={18} color={theme.colors.accent} />
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Invite Partner</Text>
            </View>
            <Text style={[styles.label, { color: theme.colors.text2 }]}>Share this code</Text>
            <Text style={[styles.value, { color: theme.colors.text }]} selectable>{code}</Text>
            {link ? (
              <>
                <Text style={[styles.label, { color: theme.colors.text2 }]}>Or share link</Text>
                <Text style={[styles.value, { color: theme.colors.text }]} numberOfLines={2} selectable>{link}</Text>
              </>
            ) : null}
            <View style={styles.row}>
              <TouchableOpacity style={[styles.btnGhost, { borderColor: theme.colors.divider }]} onPress={onCopy}>
                <Text style={[styles.btnGhostText, { color: theme.colors.text }]}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: theme.colors.accent }]} onPress={onAccept}>
                <Text style={styles.btnText}>Accept (test)</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.close} onPress={() => setOpen(false)}>
              <Text style={{ color: theme.colors.text2, fontWeight: "800" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <LoginNudgeModal
        visible={needLogin}
        onClose={() => setNeedLogin(false)}
        onSignIn={() => { setNeedLogin(false); nav.navigate("Settings"); }}
        onSignUp={() => { setNeedLogin(false); nav.navigate("Settings"); }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  cta: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 18 },
  ctaText: { color: "#fff", fontWeight: "900" },
  status: { marginTop: 10, fontSize: 12 },

  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center", padding: 16 },
  card: { width: "100%", maxWidth: 480, borderRadius: 18, padding: 16, borderWidth: StyleSheet.hairlineWidth },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: "900" },
  label: { marginTop: 8, fontSize: 12, fontWeight: "800" },
  value: { marginTop: 4, fontSize: 14, fontWeight: "800" },
  row: { flexDirection: "row", gap: 10, marginTop: 12 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "900" },
  btnGhost: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: "center", borderWidth: StyleSheet.hairlineWidth },
  btnGhostText: { fontWeight: "900" },
  close: { alignSelf: "center", marginTop: 8, paddingVertical: 6, paddingHorizontal: 10 },
});
