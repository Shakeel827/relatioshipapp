import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

const users = new Map<string, User>();

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const JWT_SECRET: Secret = (process.env.JWT_SECRET || "dev-secret-change") as Secret;
const JWT_EXPIRES_IN: SignOptions["expiresIn"] = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

export const authService = {
  async register(email: string, password: string) {
    const normalized = email.trim().toLowerCase();
    if (users.has(normalized)) throw new Error("Email already registered");
    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = { id: makeId(), email: normalized, passwordHash, createdAt: Date.now() };
    users.set(normalized, user);
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { token };
  },

  async login(email: string, password: string) {
    const normalized = email.trim().toLowerCase();
    const user = users.get(normalized);
    if (!user) throw new Error("Invalid email or password");
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error("Invalid email or password");
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { token };
  },

  verify(token: string) {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; email: string };
    return payload;
  },
};
