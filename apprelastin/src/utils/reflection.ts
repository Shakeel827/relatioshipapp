export function gentleCues(text: string): string[] {
  const t = text.trim();
  if (!t) return ["You can take your time."];

  const cues: string[] = [];

  const exclamations = (t.match(/!/g) || []).length;
  const questionMarks = (t.match(/\?/g) || []).length;
  const capsWords = (t.match(/\b[A-Z]{3,}\b/g) || []).length;

  if (exclamations >= 2 || capsWords >= 1) cues.push("This message carries urgency.");
  if (questionMarks >= 2) cues.push("It may be read as pressure, even if you don’t mean it that way.");
  if (t.length > 260) cues.push("There’s a lot here. Consider one clear sentence that holds the heart of it.");
  if (/\b(always|never)\b/i.test(t)) cues.push("Absolute words can land sharply. Softening may protect what you mean.");

  if (cues.length === 0) cues.push("The tone feels steady. If it’s true, it’s enough.");

  return cues.slice(0, 3);
}

