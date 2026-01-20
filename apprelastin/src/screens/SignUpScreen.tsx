import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { AnimatedSanctuaryBackground } from "../components/AnimatedSanctuaryBackground";
import { Surface } from "../components/Surface";
import { theme } from "../theme/theme";
import { useAuth } from "../hooks";
import { apiRegister } from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

export function SignUpScreen({ navigation }: Props) {
  const { isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");

  const onSubmit = async () => {
    try {
      await apiRegister(email, password, {
        name: name || undefined,
        age: age ? Number(age) : undefined,
        gender: gender || undefined,
        location: location || undefined,
      });
    } catch {
      // handled in hook
    }
  };

  return (
    <View style={styles.root}>
      <AnimatedSanctuaryBackground />
      <View style={styles.center}>
        <Surface style={styles.card} intensity={22}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.sub}>A calmer way to communicate.</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={(t) => { if (error) clearError(); setName(t); }}
              placeholder="Your full name"
              placeholderTextColor="rgba(30,34,40,0.35)"
              style={styles.input}
            />
          </View>

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
              placeholder="At least 6 characters"
              placeholderTextColor="rgba(30,34,40,0.35)"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <View style={styles.row2}>
            <View style={[styles.field, { flex: 1 }]}> 
              <Text style={styles.label}>Age</Text>
              <TextInput
                value={age}
                onChangeText={(t) => { if (error) clearError(); setAge(t.replace(/[^0-9]/g, "")); }}
                keyboardType="number-pad"
                placeholder="e.g. 28"
                placeholderTextColor="rgba(30,34,40,0.35)"
                style={styles.input}
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}> 
              <Text style={styles.label}>Gender</Text>
              <TextInput
                value={gender}
                onChangeText={(t) => { if (error) clearError(); setGender(t); }}
                placeholder="e.g. Female"
                placeholderTextColor="rgba(30,34,40,0.35)"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              value={location}
              onChangeText={(t) => { if (error) clearError(); setLocation(t); }}
              placeholder="City, Country"
              placeholderTextColor="rgba(30,34,40,0.35)"
              style={styles.input}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={onSubmit}
            disabled={isLoading}
            style={({ pressed }) => [styles.primary, (pressed || isLoading) && { opacity: 0.7 }]}
            accessibilityRole="button"
            accessibilityLabel="Create account"
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.ink} />
            ) : (
              <Text style={styles.primaryText}>Create account</Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation.navigate("SignIn")} style={({ pressed }) => [styles.secondary, pressed && { opacity: 0.7 }]}>
            <Text style={styles.secondaryText}>Already have an account? Sign in</Text>
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
  row2: { flexDirection: "row", gap: 10 },
});
