import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { AnimatedSanctuaryBackground } from "../components/AnimatedSanctuaryBackground";
import { Surface } from "../components/Surface";
import { theme } from "../theme/theme";
import { useAuth } from "../hooks";

type Props = NativeStackScreenProps<RootStackParamList, "SignIn">;

export function SignInScreen({ navigation }: Props) {
  const { signIn, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    try {
      await signIn(email, password);
    } catch {
      // handled in hook
    }
  };

  return (
    <View style={styles.root}>
      <AnimatedSanctuaryBackground />
      <View style={styles.center}>
        <Surface style={styles.card} intensity={22}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.sub}>A slower place to say what you mean.</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={(t) => { if (error) clearError(); setEmail(t); }}
              placeholder="you@example.com"
              placeholderTextColor="rgba(30,34,40,0.35)"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={(t) => { if (error) clearError(); setPassword(t); }}
              placeholder="••••••••"
              placeholderTextColor="rgba(30,34,40,0.35)"
              secureTextEntry
              style={styles.input}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={onSubmit}
            disabled={isLoading}
            style={({ pressed }) => [styles.primary, (pressed || isLoading) && { opacity: 0.7 }]}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.ink} />
            ) : (
              <Text style={styles.primaryText}>Sign in</Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation.navigate("SignUp")}
            style={({ pressed }) => [styles.secondary, pressed && { opacity: 0.7 }]}>
            <Text style={styles.secondaryText}>New here? Create an account</Text>
          </Pressable>
        </Surface>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.paper },
  center: { flex: 1, justifyContent: "center", paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xxl },
  card: { alignSelf: "center", width: "100%", maxWidth: 520 },
  title: { color: theme.colors.ink, fontSize: theme.type.title.fontSize, lineHeight: theme.type.title.lineHeight },
  sub: { marginTop: 6, color: theme.colors.inkMuted, fontSize: theme.type.small.fontSize },
  field: { marginTop: theme.spacing.lg },
  label: { color: theme.colors.inkMuted, fontSize: theme.type.small.fontSize, marginBottom: 6 },
  input: {
    color: theme.colors.ink,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: theme.radii.card,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  error: { marginTop: 10, color: "#b84a4a" },
  primary: {
    marginTop: theme.spacing.lg,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
  },
  primaryText: { color: theme.colors.ink, fontSize: theme.type.small.fontSize, letterSpacing: 0.4 },
  secondary: { alignItems: "center", paddingVertical: 12 },
  secondaryText: { color: theme.colors.inkMuted, fontSize: theme.type.small.fontSize },
});
