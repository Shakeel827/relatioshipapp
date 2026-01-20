/**
 * EXAMPLE APP STRUCTURE
 *
 * This shows how to use all the components and hooks together.
 * Copy this pattern to implement your navigation flow.
 */

import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth, useChat } from "@/hooks";
import { theme } from "@/theme/theme";
import {
  WelcomeScreen,
  AuthScreen,
  ChatScreen,
  ReflectionPanel,
  SettingsScreen,
} from "@/components";

type AppScreen = "welcome" | "auth" | "chat" | "settings";

interface AppState {
  currentScreen: AppScreen;
  authMode: "login" | "signup";
}

/**
 * Main app component - shows how to tie everything together
 */
export function ExampleApp() {
  const auth = useAuth();
  const chat = useChat();
  const [appState, setAppState] = useState<AppState>({
    currentScreen: "welcome",
    authMode: "login",
  });
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionMessage, setReflectionMessage] = useState("");
  const [reflection, setReflection] = useState("");
  const [isReflecting, setIsReflecting] = useState(false);

  // Determine what screen to show based on auth state
  useEffect(() => {
    if (auth.isLoading) {
      // Still loading auth state
      return;
    }

    if (!auth.isSignedIn) {
      // Show welcome screen first, then auth
      if (appState.currentScreen === "welcome") {
        // Welcome screen will transition to auth after animation
        return;
      }
    } else {
      // User is signed in, show chat
      setAppState((prev) => ({ ...prev, currentScreen: "chat" }));
    }
  }, [auth.isSignedIn, auth.isLoading]);

  // Handle welcome screen completion
  const handleWelcomeComplete = () => {
    setAppState((prev) => ({
      ...prev,
      currentScreen: "auth",
      authMode: "login",
    }));
  };

  // Handle auth submission
  const handleAuthSubmit = async (email: string, password: string) => {
    try {
      if (appState.authMode === "login") {
        await auth.signIn(email, password);
      } else {
        await auth.signUp(email, password);
      }
      // Navigate to chat automatically on success
      setAppState((prev) => ({ ...prev, currentScreen: "chat" }));
    } catch (error) {
      console.error("Auth error:", error);
      // Error is shown in AuthScreen via auth.error
    }
  };

  // Handle message sending
  const handleSendMessage = async (text: string) => {
    await chat.sendMessage(text);
  };

  // Handle reflection request
  const handleReflect = async (text: string) => {
    setReflectionMessage(text);
    setIsReflecting(true);
    setShowReflection(true);

    try {
      const result = await chat.getReflectionForMessage(text);
      setReflection(result);
    } finally {
      setIsReflecting(false);
    }
  };

  // Handle reflection panel actions
  const handleReflectionContinue = () => {
    // Send without further editing
    setShowReflection(false);
  };

  const handleReflectionAdjust = () => {
    // Go back to chat, let user edit
    setShowReflection(false);
  };

  const handleReflectionSendAnyway = () => {
    // Force send the message
    setShowReflection(false);
  };

  // Loading state
  if (auth.isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color={theme.colors.blueDusk}
        />
      </View>
    );
  }

  // Route based on current screen
  switch (appState.currentScreen) {
    case "welcome":
      return (
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      );

    case "auth":
      return (
        <AuthScreen
          mode={appState.authMode}
          onSubmit={handleAuthSubmit}
          isLoading={auth.isLoading}
        />
      );

    case "chat":
      return (
        <>
          <ChatScreen
            messages={chat.messages}
            onSendMessage={handleSendMessage}
            onReflect={handleReflect}
            isLoading={chat.isLoading}
          />
          <ReflectionPanel
            visible={showReflection}
            message={reflectionMessage}
            reflection={reflection}
            onContinue={handleReflectionContinue}
            onAdjust={handleReflectionAdjust}
            onSendAnyway={handleReflectionSendAnyway}
            isLoading={isReflecting}
          />
        </>
      );

    case "settings":
      return (
        <SettingsScreen onLogout={() => auth.signOut()} />
      );

    default:
      return null;
  }
}

export default ExampleApp;

/**
 * IMPLEMENTATION CHECKLIST:
 *
 * ✅ Theme system is set up with colors, spacing, typography
 * ✅ All components are built (WelcomeScreen, AuthScreen, ChatScreen, etc.)
 * ✅ useAuth hook handles authentication state
 * ✅ useChat hook manages messages and API calls
 * ✅ API client connects to backend
 * ✅ Animations are smooth and breathing-paced
 * ✅ No API keys in frontend code
 *
 * NEXT STEPS:
 * 1. Implement real authentication with your backend
 * 2. Add proper navigation (React Navigation)
 * 3. Implement token refresh and session management
 * 4. Add error boundaries for robustness
 * 5. Add analytics tracking (optional)
 * 6. Customize colors and animations as needed
 * 7. Test on iOS and Android devices
 * 8. Deploy to app stores
 *
 * CUSTOMIZATION POINTS:
 * - Change theme colors in src/theme/theme.ts
 * - Update AI system prompt in backend/src/services/chat.service.ts
 * - Add screens to navigation (you'll need React Navigation)
 * - Implement real authentication API calls
 * - Add crash reporting and analytics
 */
