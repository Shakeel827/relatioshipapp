import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { requireAuth, AuthedRequest } from "../middleware/auth.js";
import { ConversationModel } from "../models/Conversation.js";
import { MessageModel } from "../models/Message.js";

const router = express.Router();

// List user's conversations
router.get("/conversations", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!.sub);
    const convos = await ConversationModel.find({ members: userId })
      .sort({ updatedAt: -1 })
      .lean();
    res.json({ conversations: convos });
  } catch (e) {
    console.error("List conversations error", e);
    res.status(500).json({ error: "Failed to list conversations" });
  }
});

// Ensure/create a conversation with partner
router.post(
  "/conversations",
  requireAuth,
  async (
    req: AuthedRequest & Request<{}, {}, { partnerId?: string; aiEnabled?: boolean }>,
    res: Response
  ) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user!.sub);
      const { partnerId, aiEnabled } = req.body || {};
      if (!partnerId) return res.status(400).json({ error: "partnerId is required" });
      const partnerObjId = new mongoose.Types.ObjectId(partnerId);

      let convo = await ConversationModel.findOne({ members: { $all: [userId, partnerObjId] } });
      if (!convo) {
        convo = await ConversationModel.create({ members: [userId, partnerObjId], aiEnabled: aiEnabled ?? true });
      }
      res.json({ conversation: convo });
    } catch (e) {
      console.error("Create conversation error", e);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  }
);

// Get messages for a conversation (optional since timestamp)
router.get(
  "/conversations/:id/messages",
  requireAuth,
  async (req: AuthedRequest & Request<{ id: string }, {}, {}, { since?: string }>, res: Response) => {
    try {
      const convoId = new mongoose.Types.ObjectId(req.params.id);
      const since = req.query.since ? new Date(req.query.since) : undefined;
      const filter: any = { conversationId: convoId };
      if (since) filter.createdAt = { $gt: since };
      const msgs = await MessageModel.find(filter).sort({ createdAt: 1 }).lean();
      res.json({ messages: msgs });
    } catch (e) {
      console.error("List messages error", e);
      res.status(500).json({ error: "Failed to list messages" });
    }
  }
);

// Send a message
router.post(
  "/messages",
  requireAuth,
  async (
    req: AuthedRequest & Request<{}, {}, { conversationId?: string; text?: string; flags?: { hideFromAI?: boolean } }>,
    res: Response
  ) => {
    try {
      const { conversationId, text, flags } = req.body || {};
      if (!conversationId || !text) return res.status(400).json({ error: "conversationId and text required" });
      const convoId = new mongoose.Types.ObjectId(conversationId);

      const convo = await ConversationModel.findById(convoId);
      if (!convo) return res.status(404).json({ error: "Conversation not found" });
      const userId = new mongoose.Types.ObjectId(req.user!.sub);
      const isMember = convo.members.some((m: any) => String(m) === String(userId));
      if (!isMember) return res.status(403).json({ error: "Not a member" });

      const msg = await MessageModel.create({ conversationId: convoId, senderId: userId, text, flags });
      convo.updatedAt = new Date();
      await convo.save();

      // TODO: emit via WS later
      res.json({ message: msg });
    } catch (e) {
      console.error("Send message error", e);
      res.status(500).json({ error: "Failed to send message" });
    }
  }
);

export default router;
