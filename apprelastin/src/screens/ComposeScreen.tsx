import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { RootStackParamList } from "../types/navigation";
import { AnimatedSanctuaryBackground } from "../components/AnimatedSanctuaryBackground";
import { ReflectionOverlay } from "../components/ReflectionOverlay";
import { theme } from "../theme/theme";
import { sendChatMessage, ChatMessage, getReflection } from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "Compose">;

export function ComposeScreen({ route, navigation }: Props) {
  const { recipientName } = route.params;

  const [draft, setDraft] = useState("");
  const [reflectOpen, setReflectOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const lastTs = useRef<number>(Date.now());

  // 0..1 typing cadence → background intensity (no rerenders)
  const energy = useSharedValue(0);

  // release animation
  const [ghost, setGhost] = useState<string | null>(null);
  const release = useSharedValue(0);

  const onChangeText = (t: string) => {
    const now = Date.now();
    const dt = Math.max(40, now - lastTs.current);
    lastTs.current = now;

    // faster taps -> closer to 1, slower -> closer to 0
    const speed = Math.min(1, 220 / dt);
    energy.value = withTiming(speed, {
      duration: theme.motion.micro,
      easing: Easing.out(Easing.quad),
    });

    setDraft(t);
  };

  const ghostStyle = useAnimatedStyle(() => {
    const p = release.value;
    return {
      opacity: 1 - p,
      transform: [{ translateY: -26 * p }, { scale: 1 - 0.02 * p }],
    };
  });

  const doRelease = async () => {
    const text = draft.trim();
    if (!text) return;

    setReflectOpen(false);
    setGhost(text);
    setDraft("");

    // Add user message to conversation
    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    release.value = 0;
    release.value = withTiming(
      1,
      { duration: theme.motion.slow, easing: Easing.inOut(Easing.sin) },
      (finished) => finished && runOnJS(setGhost)(null)
    );

    requestAnimationFrame(() => inputRef.current?.focus());

    // Send to backend and get AI response
    setLoading(true);
    try {
      const response = await sendChatMessage([...messages, userMessage]);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.reply },
      ]);
      // Scroll to bottom
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error: any) {
      console.error("Failed to get response:", error);
      if (error?.code === 402 || error?.serverCode === "FREE_TIER_EXCEEDED") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "You’ve reached the free conversation limit. Please sign in to continue.",
          },
        ]);
        setTimeout(() => navigation.navigate("SignIn" as never), 300);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm having trouble connecting. Please try again.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const doAdjustTone = () => {
    if (!draft.trim()) return;
    // mock “gentle adjustment”: a softer ending cadence (no AI implementation here)
    setDraft((d) => (/[.!?]$/.test(d.trim()) ? d : d.trimEnd() + "."));
    setReflectOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  // simple positive/negative highlighter (client-side heuristic)
  const renderHighlighted = (text: string) => {
    const positives = ["appreciate", "thank", "love", "understand", "together", "sorry", "kind"];
    const negatives = ["always", "never", "hate", "stupid", "useless", "blame", "angry", "annoying"];
    const tokens = text.split(/(\b)/);
    return (
      <Text>
        {tokens.map((t, i) => {
          const low = t.toLowerCase();
          if (positives.includes(low)) {
            return (
              <Text key={i} style={{ color: theme.colors.success }}>{t}</Text>
            );
          }
          if (negatives.includes(low)) {
            return (
              <Text key={i} style={{ color: theme.colors.danger }}>{t}</Text>
            );
          }
          return <Text key={i} style={{ color: theme.colors.ink }}>{t}</Text>;
        })}
      </Text>
    );
  };

  const doSuggest = async () => {
    const text = draft.trim();
    if (!text) return;
    try {
      const res = await getReflection(
        `Suggest two short, kind opening lines to help me say this more gently: "${text}"`
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reflection },
      ]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Suggestions are unavailable right now." },
      ]);
    }
  };

  return (
    <View style={styles.root}>
      <AnimatedSanctuaryBackground energy={energy} />

      <View style={styles.topRow}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.back, pressed && { opacity: 0.6 }]}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Text style={styles.backText}>Close</Text>
        </Pressable>

        <Text style={styles.to}>To: {recipientName}</Text>

        <Pressable
          onPress={() => setReflectOpen((v) => !v)}
          style={({ pressed }) => [styles.ai, pressed && { opacity: 0.6 }]}
          accessibilityRole="button"
          accessibilityLabel="Reflection"
        >
          <Text style={styles.aiText}>◦</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.flex}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messagesContainer}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Begin your conversation with {recipientName}</Text>
              <Text style={styles.emptySubtext}>Write honestly, write kindly.</Text>
            </View>
          )}

          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.messageBubble,
                msg.role === "user" ? styles.userMessage : styles.assistantMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.role === "user" ? styles.userText : styles.assistantText,
                ]}
              >
                {renderHighlighted(msg.content)}
              </Text>
            </View>
          ))}

          {loading && (
            <View style={[styles.messageBubble, styles.assistantMessage]}>
              <Text style={[styles.messageText, styles.assistantText]}>Listening...</Text>
            </View>
          )}
        </ScrollView>

        <Pressable style={styles.flex} onPress={() => inputRef.current?.focus()}>
          <View style={styles.canvas}>
            {ghost ? <Animated.Text style={[styles.ghost, ghostStyle]}>{ghost}</Animated.Text> : null}

            <TextInput
              ref={inputRef}
              value={draft}
              onChangeText={onChangeText}
              placeholder="Let it be honest. Let it be kind."
              placeholderTextColor="rgba(30,34,40,0.35)"
              multiline
              autoCorrect
              autoCapitalize="sentences"
              selectionColor={theme.colors.lavender}
              style={styles.input}
              editable={!loading}
            />
          </View>
        </Pressable>

        <View style={styles.bottom}>
          <View style={styles.toolbar}>
            <Pressable
              onPress={() => setReflectOpen(true)}
              style={({ pressed }) => [styles.tool, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
              accessibilityLabel="Tone check"
              disabled={loading}
            >
              <Text style={styles.toolText}>Tone</Text>
            </Pressable>
            <Pressable
              onPress={doAdjustTone}
              style={({ pressed }) => [styles.tool, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
              accessibilityLabel="Rephrase gently"
              disabled={loading}
            >
              <Text style={styles.toolText}>Rephrase</Text>
            </Pressable>
            <Pressable
              onPress={doSuggest}
              style={({ pressed }) => [styles.tool, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
              accessibilityLabel="Suggest"
              disabled={loading}
            >
              <Text style={styles.toolText}>Suggest</Text>
            </Pressable>
            <Pressable
              onPress={doRelease}
              style={({ pressed }) => [styles.send, pressed && { opacity: 0.7 }, loading && styles.sendDisabled]}
              accessibilityRole="button"
              accessibilityLabel="Release message"
              disabled={loading}
            >
              <Text style={styles.sendText}>{loading ? "Waiting..." : "Release"}</Text>
            </Pressable>
          </View>
          <Text style={styles.micro}>Send is a closure, not a receipt.</Text>
        </View>
      </KeyboardAvoidingView>

      <ReflectionOverlay
        open={reflectOpen}
        draft={draft}
        onClose={() => setReflectOpen(false)}
        onAdjustTone={doAdjustTone}
        onRelease={doRelease}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.paper },
  flex: { flex: 1 },

  topRow: {
    paddingTop: 54,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { paddingVertical: 10, paddingHorizontal: 10, borderRadius: theme.radii.pill, opacity: 0.8 },
  backText: { color: theme.colors.inkMuted, fontSize: theme.type.small.fontSize, letterSpacing: 0.4 },
  to: { color: theme.colors.ink, fontSize: theme.type.small.fontSize, letterSpacing: 0.4, opacity: 0.85 },
  ai: { paddingVertical: 10, paddingHorizontal: 10, borderRadius: theme.radii.pill, opacity: 0.6 },
  aiText: { color: theme.colors.ink, fontSize: 22 },

  messagesContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    color: theme.colors.ink,
    fontSize: 18,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  emptySubtext: {
    marginTop: theme.spacing.md,
    color: theme.colors.inkMuted,
    fontSize: theme.type.small.fontSize,
    letterSpacing: 0.3,
    textAlign: "center",
  },

  messageBubble: {
    marginVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radii.card,
    maxWidth: "85%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(200, 180, 255, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(200, 180, 255, 0.5)",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  userText: {
    color: theme.colors.ink,
  },
  assistantText: {
    color: theme.colors.ink,
    fontStyle: "italic",
    opacity: 0.9,
  },

  canvas: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxl,
    justifyContent: "center",
  },
  input: {
    color: theme.colors.ink,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0.2,
    textAlign: "center",
    paddingVertical: 0,
  },
  ghost: {
    position: "absolute",
    left: theme.spacing.xl,
    right: theme.spacing.xl,
    textAlign: "center",
    color: theme.colors.ink,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0.2,
    opacity: 0.9,
  },

  bottom: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xxl, alignItems: "center" },
  toolbar: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  tool: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  toolText: { color: theme.colors.ink, fontSize: theme.type.small.fontSize, letterSpacing: 0.3 },
  send: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  sendDisabled: {
    opacity: 0.5,
  },
  sendText: { color: theme.colors.ink, fontSize: theme.type.small.fontSize, letterSpacing: 0.6 },
  micro: { marginTop: 10, color: theme.colors.inkMuted, fontSize: theme.type.small.fontSize, letterSpacing: 0.2, opacity: 0.9 },
});

