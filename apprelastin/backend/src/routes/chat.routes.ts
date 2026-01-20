import express, { Request, Response, NextFunction } from "express";
import { chatService } from "../services/chat.service.js";
// Note: Free tier access is enforced by freeTierGate middleware at app level.

const router = express.Router();

// ============================================================================
// MIDDLEWARE
// ============================================================================

interface ChatRequest extends Request {
  body: {
    messages?: Array<{ role: string; content: string }>;
    userMessage?: string;
  };
}

// Validate chat request
const validateChatRequest = (
  req: ChatRequest,
  res: Response,
  next: NextFunction
) => {
  const { messages, userMessage } = req.body;

  // Accept either messages array or a single userMessage
  if (!messages && !userMessage) {
    return res.status(400).json({
      error:
        "Request must include either 'messages' array or 'userMessage' string",
    });
  }

  if (userMessage && typeof userMessage !== "string") {
    return res.status(400).json({ error: "userMessage must be a string" });
  }

  if (messages && !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages must be an array" });
  }

  next();
};

// ============================================================================
// ROUTES
// ============================================================================

/**
 * POST /api/chat
 * Send a message and receive an emotionally intelligent response
 *
 * Request body:
 * {
 *   "userMessage": "I'm feeling overwhelmed...",
 *   // OR
 *   "messages": [
 *     { "role": "user", "content": "Hello" },
 *     { "role": "assistant", "content": "Hi there..." }
 *   ]
 * }
 *
 * Response:
 * {
 *   "reply": "It sounds like you're feeling...",
 *   "model": "gpt-4-mini"
 * }
 */
router.post(
  "/chat",
  validateChatRequest,
  async (req: ChatRequest, res: Response) => {
    try {
      const { messages, userMessage } = req.body;

      // Convert single message to messages format if needed
      const conversationMessages = (messages as Array<{ role: "user" | "assistant"; content: string }>) || [
        { role: "user" as const, content: userMessage },
      ];

      // Call OpenAI service
      const response = await chatService.chat(conversationMessages);

      res.json(response);
    } catch (error) {
      console.error("Chat endpoint error:", error);
      const message =
        error instanceof Error ? error.message : "Internal server error";
      res
        .status(500)
        .json({ error: message || "Failed to generate response" });
    }
  }
);

/**
 * POST /api/perspective
 * Body: { context: string }
 * Returns: { triggers: string, impact: string, action: string }
 */
router.post(
  "/perspective",
  async (req: Request<{}, {}, { context?: string }>, res: Response) => {
    try {
      const { context } = req.body || {};
      if (!context || typeof context !== "string") {
        return res.status(400).json({ error: "context must be a non-empty string" });
      }
      const result = await chatService.perspectiveForUser(context);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Failed to generate perspective" });
    }
  }
);

/**
 * POST /api/summary
 * Body: { context: string }
 * Returns: { triggers: string, impact: string, action: string }
 */
router.post(
  "/summary",
  async (req: Request<{}, {}, { context?: string }>, res: Response) => {
    try {
      const { context } = req.body || {};
      if (!context || typeof context !== "string") {
        return res.status(400).json({ error: "context must be a non-empty string" });
      }
      const result = await chatService.summarizeConversation(context);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Failed to summarize conversation" });
    }
  }
);

/**
 * POST /api/reflect
 * Get a gentle tone reflection on a message before sending
 *
 * Request body:
 * {
 *   "userMessage": "Your message text here"
 * }
 *
 * Response:
 * {
 *   "reflection": "This message comes through clearly."
 * }
 */
router.post(
  "/reflect",
  async (req: Request<{}, {}, { userMessage?: string }>, res: Response) => {
    try {
      const { userMessage } = req.body;

      if (!userMessage || typeof userMessage !== "string") {
        return res
          .status(400)
          .json({ error: "userMessage must be a non-empty string" });
      }

      const reflection = await chatService.reflectOnTone(userMessage);

      res.json({ reflection });
    } catch (error) {
      console.error("Reflect endpoint error:", error);
      res.status(500).json({ error: "Failed to analyze tone" });
    }
  }
);

/**
 * GET /api/health
 * Simple health check endpoint
 */
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    model: chatService.getModel(),
    timestamp: new Date().toISOString(),
  });
});

export default router;

/**
 * POST /api/analyze
 * Body: { userMessage: string }
 * Returns: { spans: [...] }
 */
router.post(
  "/analyze",
  async (req: Request<{}, {}, { userMessage?: string }>, res: Response) => {
    try {
      const { userMessage } = req.body || {};
      if (!userMessage || typeof userMessage !== "string") {
        return res.status(400).json({ error: "userMessage must be a non-empty string" });
      }
      const result = await chatService.analyzeMessage(userMessage);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Failed to analyze message" });
    }
  }
);

/**
 * POST /api/rephrase
 * Body: { userMessage: string }
 * Returns: { variants: string[] }
 */
router.post(
  "/rephrase",
  async (req: Request<{}, {}, { userMessage?: string }>, res: Response) => {
    try {
      const { userMessage } = req.body || {};
      if (!userMessage || typeof userMessage !== "string") {
        return res.status(400).json({ error: "userMessage must be a non-empty string" });
      }
      const result = await chatService.rephraseMessage(userMessage);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Failed to rephrase message" });
    }
  }
);

/**
 * POST /api/suggest
 * Body: { context: string }
 * Returns: { suggestions: string[] }
 */
router.post(
  "/suggest",
  async (req: Request<{}, {}, { context?: string }>, res: Response) => {
    try {
      const { context } = req.body || {};
      if (!context || typeof context !== "string") {
        return res.status(400).json({ error: "context must be a non-empty string" });
      }
      const result = await chatService.suggestForMessage(context);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
  }
);
