import { z } from "zod";
import "dotenv/config";

const optionalKey = z.preprocess((v) => {
  if (typeof v !== "string") return v;
  const t = v.trim();
  return t.length === 0 ? undefined : t;
}, z.string().min(20).optional());

const envSchema = z
  .object({
    PORT: z.coerce.number().default(4000),
    CLIENT_ORIGIN: z.string().default("http://localhost:5173"),

    JWT_ACCESS_SECRET: z.string().min(16),
    JWT_ACCESS_EXPIRES_IN: z.string().default("7d"),

    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: optionalKey,
    SUPABASE_SECRET_KEY: optionalKey,
    SUPABASE_PUBLISHABLE_KEY: optionalKey,

    SUPABASE_AVATAR_BUCKET: z.string().default("avatars"),
    SUPABASE_PRODUCT_BUCKET: z.string().default("products"),
  })
  .transform((raw) => {
    const supabaseKey =
      raw.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
      raw.SUPABASE_SECRET_KEY?.trim() ||
      raw.SUPABASE_PUBLISHABLE_KEY?.trim() ||
      "";

    return { ...raw, supabaseKey };
  })
  .refine((e) => e.supabaseKey.length >= 20, {
    message:
      "Set SUPABASE_SERVICE_ROLE_KEY (sb_secret_...) atau SUPABASE_PUBLISHABLE_KEY di server/.env",
  });

const parsed = envSchema.parse(process.env);

export const env = parsed;

/** Key untuk Supabase client di server (secret key disarankan untuk production). */
export const supabaseServiceKey = parsed.supabaseKey;

export function getAllowedOrigins(): string[] {
  return env.CLIENT_ORIGIN.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
