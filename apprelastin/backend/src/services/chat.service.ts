import { OpenAI } from "openai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  reply: string;
  model: string;
}

interface CustomAPIResponse {
  reply?: string;
  content?: string;
  message?: string;
  text?: string;
  response?: string;
  choices?: Array<{ message?: { content?: string }; text?: string }>;
}


const SYSTEM_PROMPT = `You are a supportive communication assistant.

YOUR CORE ROLE:
- Help users express themselves clearly and calmly
- Be a mirror, not a judge
- Provide emotionally intelligent responses

STRICT RULES (DO NOT BREAK THESE):
- Never judge the user or their feelings
- Never force advice or diagnose emotions
- Never escalate conflict or tension
- Never manipulate behavior or outcomes
- Never use clinical or clinical language
- Always ask permission before suggesting changes

TONE GUIDELINES:
- Reply like a calm, thoughtful human
- Keep replies short to medium (2-3 sentences typically)
- Be conversational, warm, and genuinely supportive
- Use natural language, avoid corporate speak
- Show you understand their perspective
- Acknowledge feelings without trying to fix them

COMMUNICATION STYLE:
- Ask clarifying questions when needed
- Reflect back what you hear
- Normalize their experience
- Offer gentle perspectives only when asked
- Respect their autonomy

EXAMPLE RESPONSES:
- "It sounds like you're feeling overwhelmed. What's the most pressing thing on your mind?"
- "I hear you. That's a lot to navigate. Would it help to talk through it?"
- "You seem frustrated about this. I'm here to listen."

AVOID:
- "You should..."
- "That's a sign of..."
- Diagnostic language
- Toxic positivity ("Look on the bright side!")
- Urgency or alarm
- Taking sides in conflicts`;

// ============================================================================
// CHAT SERVICE
// ============================================================================

export class ChatService {
  private client: OpenAI | null = null;
  private model: string;
  private provider: string;
  private customApiBaseUrl: string | null = null;
  private customApiKey: string | null = null;

  constructor() {
    this.provider = process.env.AI_PROVIDER || "openai";

    if (this.provider === "openai") {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "OPENAI_API_KEY environment variable is not defined. Please set it in your .env file."
        );
      }
      this.client = new OpenAI({ apiKey });
      this.model = process.env.OPENAI_MODEL || "gpt-4-mini";
    } else if (this.provider === "custom") {
      this.customApiBaseUrl = process.env.CUSTOM_API_BASE_URL || null;
      this.customApiKey = process.env.CUSTOM_API_KEY || null;
      this.model = process.env.CUSTOM_MODEL || "default";

      if (!this.customApiBaseUrl || !this.customApiKey) {
        throw new Error(
          "For custom API provider, CUSTOM_API_BASE_URL and CUSTOM_API_KEY are required."
        );
      }
    } else {
      throw new Error(
        `Unknown AI_PROVIDER: ${this.provider}. Supported providers: openai, custom`
      );
    }
  }

  /**
   * Send a message to the AI provider and get an emotionally intelligent response
   */
  async chat(messages: Message[]): Promise<ChatResponse> {
    try {
      if (this.provider === "openai" && this.client) {
        return await this.chatWithOpenAI(messages);
      } else if (
        this.provider === "custom" &&
        this.customApiBaseUrl &&
        this.customApiKey
      ) {
        return await this.chatWithCustomAPI(messages);
      } else {
        throw new Error("No valid AI provider configured.");
      }
    } catch (error) {
      console.error("Chat error:", error);
      throw new Error(
        "Failed to generate response. Please try again in a moment."
      );
    }
  }

  /**
   * Chat with OpenAI API
   */
  private async chatWithOpenAI(messages: Message[]): Promise<ChatResponse> {
    if (!this.client) {
      throw new Error("OpenAI client not initialized.");
    }

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...messages,
      ],
      temperature: 0.7, // Balanced creativity and consistency
      max_tokens: 300, // Keep replies focused and concise
      top_p: 0.9,
    });

    const reply =
      response.choices[0]?.message?.content || "I'm here to listen.";

    return {
      reply,
      model: this.model,
    };
  }

  /**
   * Chat with custom API endpoint
   */
  private async chatWithCustomAPI(messages: Message[]): Promise<ChatResponse> {
    if (!this.customApiBaseUrl || !this.customApiKey) {
      throw new Error("Custom API not configured.");
    }

    const fullMessages = [
      {
        role: "system" as const,
        content: SYSTEM_PROMPT,
      },
      ...messages,
    ];

    const response = await fetch(`${this.customApiBaseUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.customApiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.statusText}`);
    }

    const data = (await response.json()) as CustomAPIResponse;

    const reply = this.extractReplyFromCustomResponse(data);

    return {
      reply,
      model: this.model,
    };
  }

  /**
   * Extract reply from various custom API response formats
   */
  private extractReplyFromCustomResponse(data: CustomAPIResponse): string {
    if (data.reply) return data.reply;
    if (data.content) return data.content;
    if (data.message) return data.message;
    if (data.text) return data.text;
    if (data.response) return data.response;
    if (data.choices && data.choices[0]) {
      if (data.choices[0].message?.content)
        return data.choices[0].message.content;
      if (data.choices[0].text) return data.choices[0].text;
    }
    return "I'm here to listen.";
  }

  /**
   * Analyze tone of a user message (checks if message might escalate conflict)
   * Returns a gentle reflection without judgment
   */
  async reflectOnTone(userMessage: string): Promise<string> {
    try {
      if (this.provider === "openai" && this.client) {
        return await this.reflectToneWithOpenAI(userMessage);
      } else if (
        this.provider === "custom" &&
        this.customApiBaseUrl &&
        this.customApiKey
      ) {
        return await this.reflectToneWithCustomAPI(userMessage);
      } else {
        return "This message comes through clearly.";
      }
    } catch (error) {
      console.error("Tone reflection error:", error);
      return "This message comes through clearly.";
    }
  }

  /**
   * Reflect tone with OpenAI API
   */
  private async reflectToneWithOpenAI(userMessage: string): Promise<string> {
    if (!this.client) {
      return "This message comes through clearly.";
    }

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "system",
          content: `You are a gentle communication advisor. Your job is to help users see how their message might be perceived by others. Be kind and non-judgmental. Offer a brief, empathetic reflection.

IMPORTANT: Only mention tone observations if they're genuinely useful. Don't over-analyze. Keep it to 1-2 short sentences.

Return ONLY the reflection, nothing else.`,
        },
        {
          role: "user",
          content: `How might this message be received? "${userMessage}"`,
        },
      ],
      temperature: 0.6,
      max_tokens: 100,
    });

    return (
      response.choices[0]?.message?.content ||
      "This message comes through clearly."
    );
  }

  /**
   * Reflect tone with custom API
   */
  private async reflectToneWithCustomAPI(userMessage: string): Promise<string> {
    if (!this.customApiBaseUrl || !this.customApiKey) {
      return "This message comes through clearly.";
    }

    const toneSystemPrompt = `You are a gentle communication advisor. Your job is to help users see how their message might be perceived by others. Be kind and non-judgmental. Offer a brief, empathetic reflection.

IMPORTANT: Only mention tone observations if they're genuinely useful. Don't over-analyze. Keep it to 1-2 short sentences.

Return ONLY the reflection, nothing else.`;

    const response = await fetch(`${this.customApiBaseUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.customApiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "system",
            content: toneSystemPrompt,
          },
          {
            role: "user",
            content: `How might this message be received? "${userMessage}"`,
          },
        ],
        temperature: 0.6,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      return "This message comes through clearly.";
    }

    const data = (await response.json()) as CustomAPIResponse;
    return (
      this.extractReplyFromCustomResponse(data) ||
      "This message comes through clearly."
    );
  }

  /**
   * Get the current model name
   */
  getModel(): string {
    return this.model;
  }

  /**
   * Analyze a single user message: return labeled spans only (positive|neutral|negative)
   */
  async analyzeMessage(userMessage: string): Promise<{
    spans: Array<{ start: number; end: number; label: "positive" | "neutral" | "negative" }>;
  }> {
    try {
      if (this.provider === "openai" && this.client) {
        return await this.analyzeWithOpenAI(userMessage);
      }
      // Fallback heuristic
      const spansPN: Array<{ start: number; end: number; label: "positive" | "negative" }> = [];
      const positives = ["appreciate", "thank", "love", "understand", "together", "sorry", "kind"];
      const negatives = ["always", "never", "hate", "stupid", "useless", "blame", "angry", "annoying"];
      const lower = userMessage.toLowerCase();
      positives.forEach((w) => {
        const i = lower.indexOf(w);
        if (i >= 0) spansPN.push({ start: i, end: i + w.length, label: "positive" });
      });
      negatives.forEach((w) => {
        const i = lower.indexOf(w);
        if (i >= 0) spansPN.push({ start: i, end: i + w.length, label: "negative" });
      });
      // Build neutral spans covering remaining ranges
      const spansSorted = spansPN.sort((a, b) => a.start - b.start);
      const result: Array<{ start: number; end: number; label: "positive" | "neutral" | "negative" }> = [];
      let cursor = 0;
      for (const s of spansSorted) {
        if (cursor < s.start) {
          result.push({ start: cursor, end: s.start, label: "neutral" });
        }
        result.push(s);
        cursor = Math.max(cursor, s.end);
      }
      if (cursor < userMessage.length) {
        result.push({ start: cursor, end: userMessage.length, label: "neutral" });
      }
      return { spans: result };
    } catch (e) {
      return { spans: [{ start: 0, end: Math.max(0, userMessage.length), label: "neutral" }] };
    }
  }

  private async analyzeWithOpenAI(userMessage: string): Promise<{
    spans: Array<{ start: number; end: number; label: "positive" | "neutral" | "negative" }>;
  }> {
    if (!this.client) return { spans: [{ start: 0, end: Math.max(0, userMessage.length), label: "neutral" }] };
    const base =
      "You are an AI assistant inside a relationship messaging app. Keep outputs concise. Never reveal chain-of-thought. Neutral, empathetic, non-judgmental.";
    const prompt = `Highlight message segments as positive, neutral, or negative.
Return STRICT JSON only: {"spans":[{"start":number,"end":number,"label":"positive|neutral|negative"},...]}
"start"/"end" are character indices in the ORIGINAL string. No extra fields, no explanation.
Message: "${userMessage}"`;
    const r = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: base + " Output JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 300,
    });
    const raw = r.choices[0]?.message?.content || "{}";
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.spans)) return { spans: parsed.spans };
    } catch {}
    return { spans: [{ start: 0, end: Math.max(0, userMessage.length), label: "neutral" }] };
  }

  async rephraseMessage(userMessage: string): Promise<{ variants: string[] }> {
    try {
      if (this.provider === "openai" && this.client) {
        const r = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            { role: "system", content: "You are an AI assistant inside a relationship messaging app. No chain-of-thought. Use I-statements, remove blame/absolutes, <25 words. Return JSON only: {\"variants\":[...]}" },
            { role: "user", content: `Rephrase kindly using I-statements (<25 words): "${userMessage}"` },
          ],
          temperature: 0.6,
          max_tokens: 200,
        });
        const raw = r.choices[0]?.message?.content || "{}";
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.variants)) return { variants: parsed.variants.slice(0, 3) };
        } catch {}
      }
      return { variants: [userMessage] };
    } catch {
      return { variants: [userMessage] };
    }
  }

  async suggestForMessage(context: string): Promise<{ suggestions: string[] }> {
    try {
      if (this.provider === "openai" && this.client) {
        const r = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            { role: "system", content: "You are an AI assistant inside a relationship messaging app. No chain-of-thought. Provide 2-3 short suggestions. Default very short. Return JSON only: {\"suggestions\":[...]}" },
            { role: "user", content: `Suggest 2-3 gentle openings (very short) for: "${context}"` },
          ],
          temperature: 0.6,
          max_tokens: 200,
        });
        const raw = r.choices[0]?.message?.content || "{}";
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.suggestions)) return { suggestions: parsed.suggestions.slice(0, 3) };
        } catch {}
      }
      return { suggestions: ["I want to share this kindly.", "Can we talk about this together?"] };
    } catch {
      return { suggestions: ["I want to share this kindly.", "Can we talk about this together?"] };
    }
  }

  async perspectiveForUser(context: string): Promise<{ triggers: string; impact: string; action: string }> {
    try {
      if (this.provider === "openai" && this.client) {
        const r = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            { role: "system", content: "You are an AI assistant inside a relationship messaging app. Be neutral, empathetic, concise. No chain-of-thought. Output JSON only: {\"triggers\":string,\"impact\":string,\"action\":string}. Use: Triggers, Impact, Action. Describe feelings with 'may feel/might feel'." },
            { role: "user", content: `Give very short perspective using Triggers/Impact/Action for: "${context}"` },
          ],
          temperature: 0.4,
          max_tokens: 120,
        });
        const raw = r.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.triggers === "string" && typeof parsed.impact === "string" && typeof parsed.action === "string") {
          return parsed;
        }
      }
    } catch {}
    return { triggers: "Different needs surfaced.", impact: "Partner may feel unheard.", action: "Use I-statements and ask what they need." };
  }

  async summarizeConversation(context: string): Promise<{ triggers: string; impact: string; action: string }> {
    try {
      if (this.provider === "openai" && this.client) {
        const r = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            { role: "system", content: "You are an AI assistant inside a relationship messaging app. Summarize very briefly. No chain-of-thought. Output JSON only: {\"triggers\":string,\"impact\":string,\"action\":string}." },
            { role: "user", content: `Summarize (Triggers/Impact/Action) the conversation: "${context}"` },
          ],
          temperature: 0.3,
          max_tokens: 120,
        });
        const raw = r.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.triggers === "string" && typeof parsed.impact === "string" && typeof parsed.action === "string") {
          return parsed;
        }
      }
    } catch {}
    return { triggers: "Recurring trigger identified.", impact: "Both may feel tense.", action: "Agree on one small change and appreciation." };
  }
}

// Export singleton instance
export const chatService = new ChatService();
