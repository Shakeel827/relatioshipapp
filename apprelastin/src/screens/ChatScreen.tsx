import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { RootStackParamList } from "../types/navigation";
import { getMessages, sendMessage, MessageDTO } from "../services/api";
import { AIHelperSheet } from "../components/AIHelperSheet";
import { useTgTheme } from "../theme/tgTheme";

export const ChatScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Chat">>();
  const nav = useNavigation();
  const { theme } = useTgTheme();
  const { conversationId, title } = route.params;
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const listRef = useRef<FlatList<MessageDTO>>(null);

  const load = useCallback(async () => {
    try {
      const since = messages.length ? messages[messages.length - 1].createdAt : undefined;
      const res = await getMessages(conversationId, since);
      if (res.messages?.length) setMessages(prev => [...prev, ...res.messages]);
    } catch (e) {}
  }, [conversationId, messages]);

  useEffect(() => {
    // initial load
    (async () => { const res = await getMessages(conversationId); setMessages(res.messages || []); })();
    // simple polling every 2.5s
    const t = setInterval(load, 2500);
    return () => clearInterval(t);
  }, [conversationId]);

  async function onSend() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await sendMessage(conversationId, input.trim());
      setMessages(prev => [...prev, res.message]);
      setInput("");
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    } finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.colors.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderColor: theme.colors.divider }]}>
        <TouchableOpacity onPress={() => (nav as any).goBack?.()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={22} color={theme.colors.accent} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>{title || "Chat"}</Text>
        <TouchableOpacity onPress={() => setShowAI((v) => !v)} style={styles.headerIcon}>
          <Ionicons name="sparkles-outline" size={20} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>
      <FlatList
        ref={listRef}
        contentContainerStyle={{ padding: 12, paddingBottom: 18 }}
        data={messages}
        keyExtractor={(m) => m._id}
        renderItem={({ item }) => (
          <View style={[
            styles.bubble,
            item.type === "text" ? styles.me : styles.them,
            { backgroundColor: item.type === "text" ? theme.colors.bubbleMe : theme.colors.bubbleOther }
          ]}>
            <Text style={[styles.msg, { color: theme.colors.bubbleText }]}>{item.text}</Text>
            <Text style={[styles.time, { color: theme.colors.bubbleText2 }]}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
          </View>
        )}
      />
      {showAI ? <AIHelperSheet value={input} onApply={setInput} /> : null}
      <View style={[styles.composer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.divider }]}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="add" size={22} color={theme.colors.text2} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface2, color: theme.colors.text }]}
          placeholder="Write a message"
          placeholderTextColor={theme.colors.text2}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={[styles.send, { backgroundColor: theme.colors.accent }]} onPress={onSend} disabled={loading}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  title: { flex: 1, fontSize: 16, fontWeight: "800" },
  bubble: { maxWidth: "82%", borderRadius: 18, paddingVertical: 8, paddingHorizontal: 10, marginVertical: 6 },
  me: { alignSelf: "flex-end" },
  them: { alignSelf: "flex-start" },
  msg: { fontSize: 15, lineHeight: 20 },
  time: { fontSize: 11, marginTop: 4 },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  input: { flex: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  send: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
});
