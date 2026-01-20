import express, { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/auth/register",
  async (
    req: Request<{}, {}, { email?: string; password?: string }>,
    res: Response
  ) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password || password.length < 6) {
        return res
          .status(400)
          .json({ error: "Email and password (min 6 chars) are required" });
      }
      const { token } = await authService.register(email, password);
      res.json({ token });
    } catch (e: any) {
      const msg = e?.message || "Registration failed";
      res.status(400).json({ error: msg });
    }
  }
);

router.post(
  "/auth/login",
  async (
    req: Request<{}, {}, { email?: string; password?: string }>,
    res: Response
  ) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      const { token } = await authService.login(email, password);
      res.json({ token });
    } catch (e: any) {
      const msg = e?.message || "Login failed";
      res.status(401).json({ error: msg });
    }
  }
);

export default router;

router.get("/auth/me", requireAuth, (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = authService.verify(token);
    res.json({ user: { id: payload.sub, email: payload.email } });
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
});
