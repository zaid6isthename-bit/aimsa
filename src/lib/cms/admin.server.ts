import { z } from "zod";

export const ROLES = ["super_admin", "content_admin", "event_admin"] as const;
export type AdminRole = (typeof ROLES)[number];

export const newAdminSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  adminId: z.string().trim().min(3).max(40).regex(/^[a-zA-Z0-9._-]+$/),
  password: z.string().min(10).max(128),
  role: z.enum(ROLES),
});

export const bootstrapSchema = newAdminSchema.omit({ role: true });

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60_000;
const MAX_ATTEMPTS = 8;

/** Fixed-window login rate limit per client IP. */
export function allowLoginAttempt(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_ATTEMPTS;
}