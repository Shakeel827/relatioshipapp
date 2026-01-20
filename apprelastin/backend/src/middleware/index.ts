import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: number[];
}

const rateLimitStore: RateLimitStore = {};

/**
 * Simple rate limiting middleware
 * Tracks requests by IP and enforces limits
 */
export const rateLimiter =
  (
    windowMs: number = 900000, // 15 minutes
    maxRequests: number = 100
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || "unknown";
    const now = Date.now();

    // Initialize or get request timestamps for this IP
    if (!rateLimitStore[ip]) {
      rateLimitStore[ip] = [];
    }

    // Remove old timestamps outside the window
    rateLimitStore[ip] = rateLimitStore[ip].filter((time) => now - time < windowMs);

    // Check if limit exceeded
    if (rateLimitStore[ip].length >= maxRequests) {
      return res.status(429).json({
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil(
          (rateLimitStore[ip][0] + windowMs - now) / 1000
        ),
      });
    }

    // Add current request
    rateLimitStore[ip].push(now);

    // Set rate limit headers
    res.set(
      "X-RateLimit-Limit",
      maxRequests.toString()
    );
    res.set(
      "X-RateLimit-Remaining",
      (maxRequests - rateLimitStore[ip].length).toString()
    );

    next();
  };

/**
 * Error handling middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  // Don't expose internal errors in production
  const message =
    process.env.NODE_ENV === "production"
      ? "An error occurred"
      : err.message;

  res.status(500).json({
    error: message,
  });
};
