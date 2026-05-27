import { createClient } from "@supabase/supabase-js";
import { env, supabaseServiceKey } from "./env.js";

export const supabaseAdmin = createClient(env.SUPABASE_URL, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
