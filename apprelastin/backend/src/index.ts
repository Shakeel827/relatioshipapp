import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";
import inviteRoutes from "./routes/invite.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import { connectMongo, getMongoStatus } from "./lib/mongo.js";
import { rateLimiter, errorHandler } from "./middleware/index.js";
import { freeTierGate } from "./middleware/freeTier.js";

const app: Express = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Body parsing
app.use(express.json({ limit: "10mb" }));

// CORS - Allow frontend requests
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8081",
      "http://localhost:19000",
      "http://localhost:19001",
      // Add your production domain here
    ],
    credentials: true,
  })
);

// Rate limiting
const rateLimitWindowMs =
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10);
const rateLimitMaxRequests = parseInt(
  process.env.RATE_LIMIT_MAX_REQUESTS || "100",
  10
);
app.use("/api/", rateLimiter(rateLimitWindowMs, rateLimitMaxRequests));
// Free tier gate (allows limited unauthenticated usage for chat/reflect)
app.use("/api", freeTierGate);

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get("/", (req, res) => {
  res.json({
    name: "Relastin Backend",
    version: "1.0.0",
    status: "running",
    docs: "See /api/health for service status",
  });
});

// API health: includes DB status
app.get("/api/health", (req, res) => {
  const mongo = getMongoStatus();
  res.json({
    name: "Relastin Backend",
    status: "ok",
    mongo,
  });
});

// Auth + Chat API
app.use("/api", authRoutes);
app.use("/api", chatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.path,
  });
});

// Error handling
app.use(errorHandler);

// ============================================================================
// DB + START SERVER
// ============================================================================

(async () => {
  try {
    if (!MONGO_URI) {
      console.warn("MONGO_URI is not set. Proceeding without database.");
    } else {
      await connectMongo(MONGO_URI);
    }

    // Mount domain routes (after DB ready)
    app.use("/api", inviteRoutes);
    app.use("/api", conversationRoutes);

    app.listen(PORT, () => {
      console.log(`\n🌙 Relastin Backend running on http://localhost:${PORT}`);
      console.log(`📝 Chat endpoint: POST /api/chat`);
      console.log(`🔍 Reflect endpoint: POST /api/reflect`);
      console.log(`❤️  Health check: GET /api/health\n`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
