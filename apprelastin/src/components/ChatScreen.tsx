import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { theme } from "../theme/theme";

const { height, width } = Dimensions.get("window");

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatScreenProps {
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
  onReflect?: (text: string) => void;
  isLoading?: boolean;
}

/**
 * CHAT SCREEN
 *
 * Emotion-first message display
 * - Card-style message blocks (not bubbles)
 * - Gentle fade + slide animations
 * - AI replies feel human and slightly delayed
 * - Composer always available at bottom
 */
export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  onSendMessage,
  onReflect,
  isLoading = false,
}) => {
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const text = inputText.trim();
    setInputText("");

    await onSendMessage(text);
  };

  return (
    <View style={styles.container}>
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              Start a conversation
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              Take your time. Share what's on your mind.
            </Text>
          </View>
        )}

        {messages.map((message, index) => (
          <MessageCard
            key={message.id}
            message={message}
            index={index}
            onReflect={onReflect}
          />
        ))}

        {isLoading && (
          <MessageCard
            message={{
              id: "loading",
              role: "assistant",
              content: "",
              timestamp: Date.now(),
            }}
            index={messages.length}
            isLoading
          />
        )}
      </ScrollView>

      {/* Composer */}
      <ComposerFooter
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        isLoading={isLoading}
        inputRef={inputRef}
      />
    </View>
  );
};

/**
 * Individual message card
 */
interface MessageCardProps {
  message: Message;
  index: number;
  isLoading?: boolean;
  onReflect?: (text: string) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  index,
  isLoading = false,
  onReflect,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Staggered animation for each message
    const delay = message.role === "assistant" ? theme.motion.gentle : 0;

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: theme.motion.calm,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: theme.motion.calm,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, [fadeAnim, slideAnim, message.role]);

  const isUser = message.role === "user";
  const isLoadingMessage = isLoading && !message.content;

  return (
    <Animated.View
      style={[
        styles.messageWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          alignSelf: isUser ? "flex-end" : "flex-start",
        },
      ]}
    >
      <View
        style={[
          styles.messageCard,
          isUser ? styles.userMessage : styles.assistantMessage,
        ]}
      >
        {isLoadingMessage ? (
          <TypingIndicator />
        ) : (
          <>
            <Text
              style={[
                styles.messageText,
                isUser ? styles.userText : styles.assistantText,
              ]}
            >
              {message.content}
            </Text>

            {/* Reflection button for user messages */}
            {isUser && onReflect && !isLoading && (
              <TouchableOpacity
                style={styles.reflectButton}
                onPress={() => onReflect(message.content)}
              >
                <Text style={styles.reflectButtonText}>
                  How does this sound?
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </Animated.View>
  );
};

/**
 * Typing indicator animation
 */
const TypingIndicator: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createBounce = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      createBounce(dot1, 0),
      createBounce(dot2, 150),
      createBounce(dot3, 300),
    ]).start();
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot1 }] }]} />
      <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot2 }] }]} />
      <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot3 }] }]} />
    </View>
  );
};

/**
 * Composer footer with input and send button
 */
interface ComposerFooterProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  inputRef: React.RefObject<TextInput>;
}

const ComposerFooter: React.FC<ComposerFooterProps> = ({
  value,
  onChangeText,
  onSend,
  isLoading = false,
  inputRef,
}) => {
  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <View style={styles.composerContainer}>
      <View style={styles.composerInner}>
        <TextInput
          ref={inputRef}
          style={styles.composerInput}
          placeholder="Share your thoughts..."
          placeholderTextColor={theme.colors.inkLight}
          multiline
          maxLength={500}
          value={value}
          onChangeText={onChangeText}
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={onSend}
          disabled={!canSend}
          activeOpacity={0.7}
        >
          <Text style={styles.sendButtonText}>
            {isLoading ? "..." : "Send"}
          </Text>
        </TouchableOpacity>
      </View>

      {value.length > 450 && (
        <Text style={styles.charCount}>
          {500 - value.length} characters remaining
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  messagesContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },

  messageWrapper: {
    marginVertical: theme.spacing.sm,
    maxWidth: width - theme.spacing.lg * 2 - theme.spacing.lg,
  },

  messageCard: {
    borderRadius: theme.radii.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },

  userMessage: {
    backgroundColor: theme.colors.blueDusk,
  },

  assistantMessage: {
    backgroundColor: theme.colors.paper,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
  },

  messageText: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22,
  },

  userText: {
    color: theme.colors.paper,
  },

  assistantText: {
    color: theme.colors.ink,
  },

  reflectButton: {
    marginTop: theme.spacing.sm,
    alignSelf: "flex-start",
  },

  reflectButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.blueDusk,
    textDecorationLine: "underline",
  },

  typingContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },

  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.blueDusk,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: height * 0.3,
  },

  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "300",
    color: theme.colors.ink,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.3,
  },

  emptyStateSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: theme.colors.inkMuted,
    textAlign: "center",
    lineHeight: 20,
  },

  composerContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.paper,
    borderTopWidth: 1,
    borderTopColor: theme.colors.hairline,
  },

  composerInner: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.md,
  },

  composerInput: {
    flex: 1,
    minHeight: 44,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 14,
    fontWeight: "400",
    color: theme.colors.ink,
    maxHeight: 100,
  },

  sendButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
    minWidth: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },

  sendButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.blueDusk,
  },

  charCount: {
    fontSize: 11,
    fontWeight: "400",
    color: theme.colors.inkLight,
    marginTop: theme.spacing.sm,
    textAlign: "right",
  },
});
