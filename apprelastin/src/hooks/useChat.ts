/**
 * USECHAT HOOK
 *
 * State management for chat functionality
 * - Handles message history
 * - Manages loading states
 * - Integrates with API client
 */

import { useState, useCallback } from "react";
import { sendChatMessage, getReflection } from "../services/api";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  getReflectionForMessage: (text: string) => Promise<string>;
  clearMessages: () => void;
  clearError: () => void;
}

/**
 * Hook for managing chat state and API calls
 */
export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    try {
      setError(null);
      setIsLoading(true);

      // Add user message
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Get API response
      const conversationMessages = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

      // Add the new user message for context
      conversationMessages.push({
        role: "user" as const,
        content: text.trim(),
      });

      const response = await sendChatMessage(conversationMessages);

      // Add AI response
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: response.reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const getReflectionForMessage = useCallback(
    async (text: string): Promise<string> => {
      try {
        setError(null);
        const result = await getReflection(text);
        return result.reflection;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to analyze tone";
        setError(errorMessage);
        console.error("Reflection error:", err);
        return "Unable to analyze tone at this moment.";
      }
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    getReflectionForMessage,
    clearMessages,
    clearError,
  };
}
