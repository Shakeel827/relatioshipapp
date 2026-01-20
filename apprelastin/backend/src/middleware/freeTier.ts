import { Request, Response, NextFunction } from "express";

// Simple in-memory token usage by IP
const usage: Record<string, number> = {};

const LIMIT = parseInt(process.env.FREE_TIER_TOKEN_LIMIT || "100", 10);

function estimateTokensFromMessages(messages: Array<{ role: string; content: string }>): number {
  const text = messages.map((m) => m.content || "").join(" ");
  // Rough heuristic: ~4 chars per token
  const tokens = Math.ceil(text.length / 4);
  // Minimum floor per request
  return Math.max(20, tokens);
}

export function freeTierGate(req: Request, res: Response, next: NextFunction) {
  // If already authorized, skip free tier check
  const header = req.headers.authorization || "";
  const hasAuth = header.startsWith("Bearer ");
  if (hasAuth) return next();

  // Only apply to specific endpoints
  const gated = new Set(["/chat", "/reflect", "/analyze", "/rephrase", "/suggest"]);
  if (!gated.has(req.path)) return next();

  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const current = usage[ip] || 0;

  const body = (req.body || {}) as { messages?: Array<{ role: string; content: string }>; userMessage?: string };
  const messages = body.messages || (body.userMessage ? [{ role: "user", content: body.userMessage }] : []);
  const cost = estimateTokensFromMessages(messages);

  if (current + cost > LIMIT) {
    return res.status(402).json({
      error: "Free tier limit reached. Please sign in to continue.",
      code: "FREE_TIER_EXCEEDED",
      limit: LIMIT,
    });
  }

  usage[ip] = current + cost;
  // Expose remaining in header for client token meter
  res.setHeader("X-FreeTier-Remaining", String(Math.max(0, LIMIT - usage[ip])));
  next();
}
