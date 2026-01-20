import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { analyzeMessage, rephraseMessage, suggestMessage } from "../services/api";

interface Props {
  value: string;
  onApply(text: string): void;
}

export const AIHelperSheet: React.FC<Props> = ({ value, onApply }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onAnalyze() {
    setError(null); setLoading("analyze");
    try {
      const res = await analyzeMessage(value);
      // Simple: find first negative span and select it (client highlight handled elsewhere)
      const neg = res.spans.find(s => s.label === "negative");
      if (!neg) setError("No risks found.");
    } catch (e: any) { setError(e?.message || "Analyze failed"); }
    finally { setLoading(null); }
  }

  async function onRephrase() {
    setError(null); setLoading("rephrase");
    try {
      const res = await rephraseMessage(value);
      if (res.variants?.length) onApply(res.variants[0]);
    } catch (e: any) { setError(e?.message || "Rephrase failed"); }
    finally { setLoading(null); }
  }

  async function onSuggest() {
    setError(null); setLoading("suggest");
    try {
      const res = await suggestMessage(value);
      if (res.suggestions?.length) onApply(res.suggestions[0]);
    } catch (e: any) { setError(e?.message || "Suggest failed"); }
    finally { setLoading(null); }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Helper</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={onAnalyze} disabled={!!loading}>
          <Text style={styles.btnText}>{loading === "analyze" ? "…" : "Analyze"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={onRephrase} disabled={!!loading}>
          <Text style={styles.btnText}>{loading === "rephrase" ? "…" : "Rephrase"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={onSuggest} disabled={!!loading}>
          <Text style={styles.btnText}>{loading === "suggest" ? "…" : "Suggest"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    backgroundColor: Platform.select({ web: "#fff", default: "#f9fafb" }) as string,
  },
  title: { fontWeight: "600", marginBottom: 8 },
  row: { flexDirection: "row", gap: 8 },
  btn: { backgroundColor: "#e6f0ff", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12 },
  btnText: { color: "#2563eb", fontWeight: "600" },
  error: { color: "#ef4444", marginBottom: 6 },
});
