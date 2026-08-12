import { z } from "zod";

export const inquirySchema = z.object({
  kind: z.enum(["join", "contact"]),
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email address").max(120),
  department: z.string().trim().max(80).optional().or(z.literal("")),
  year: z.string().trim().max(40).optional().or(z.literal("")),
  interest: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Add a little more detail (10+ characters)").max(2000),
  consent: z.literal(true, { message: "Please accept the privacy note" }),
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

const buckets = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

export function rateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= LIMIT) return false;
  bucket.count += 1;
  return true;
}

export function reference(): string {
  return `AIMSA-${Date.now().toString(36).toUpperCase()}`;
}

/**
 * Local-development delivery adapter.
 * Submissions are validated and logged server-side. To deliver them for real,
 * wire an email provider or a database here (see README → Integrations).
 */
export function deliver(input: InquiryInput, ref: string) {
  console.info("[aimsa:inquiry]", ref, input.kind, input.email);
}
