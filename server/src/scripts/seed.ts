import { env } from "../lib/env.js";
import { createUser } from "../services/user.service.js";

async function main() {
  const adminEmail = "admin@demo.local";
  const adminUsername = "admin";
  const adminPassword = "admin123";

  // eslint-disable-next-line no-console
  console.log("[seed] using Supabase:", env.SUPABASE_URL);

  try {
    await createUser({
      full_name: "Admin Demo",
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    // eslint-disable-next-line no-console
    console.log("[seed] admin created:", { adminEmail, adminPassword });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log("[seed] admin may already exist:", e?.message ?? e);
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});

