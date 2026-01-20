import express, { Request, Response } from "express";
import { requireAuth, AuthedRequest } from "../middleware/auth.js";
import { InviteModel } from "../models/Invite.js";
import { ConversationModel } from "../models/Conversation.js";

const router = express.Router();

// Create invite (returns code and link)
router.post(
  "/invite/create",
  requireAuth,
  async (req: AuthedRequest, res: Response) => {
    try {
      const userId = req.user!.sub;
      const code = Math.random().toString().slice(2, 8); // 6 digits
      const invite = await InviteModel.create({ code, createdBy: userId });
      const link = `${req.protocol}://${req.get("host")}/invite/${code}`;
      res.json({ code, link, expiresAt: invite.expiresAt });
    } catch (e) {
      console.error("Invite create error", e);
      res.status(500).json({ error: "Failed to create invite" });
    }
  }
);

// Accept invite (creates 1:1 conversation if not exists)
router.post(
  "/invite/accept",
  requireAuth,
  async (req: AuthedRequest & Request<{}, {}, { code?: string }>, res: Response) => {
    try {
      const { code } = req.body || {};
      if (!code) return res.status(400).json({ error: "code is required" });

      const invite = await InviteModel.findOne({ code });
      if (!invite) return res.status(404).json({ error: "Invalid code" });
      if (invite.expiresAt && invite.expiresAt < new Date()) {
        return res.status(400).json({ error: "Invite expired" });
      }

      const acceptorId = req.user!.sub;
      if (String(invite.createdBy) === acceptorId) {
        return res.status(400).json({ error: "Cannot accept your own invite" });
      }

      // Ensure conversation
      let conversationId = invite.conversationId;
      if (!conversationId) {
        const convo = await ConversationModel.create({ members: [invite.createdBy, acceptorId] });
        conversationId = convo._id;
        invite.conversationId = conversationId;
      }
      invite.acceptedBy = acceptorId as any;
      await invite.save();

      res.json({ conversationId });
    } catch (e) {
      console.error("Invite accept error", e);
      res.status(500).json({ error: "Failed to accept invite" });
    }
  }
);

export default router;
