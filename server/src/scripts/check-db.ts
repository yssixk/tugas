import { supabaseAdmin } from "../lib/supa.js";
import { env } from "../lib/env.js";

async function main() {
  // eslint-disable-next-line no-console
  console.log("[check-db] Supabase:", env.SUPABASE_URL);

  const checks = ["categories", "products", "users"] as const;
  for (const table of checks) {
    const { data, error } = await supabaseAdmin.from(table).select("*").limit(1);
    if (error) {
      // eslint-disable-next-line no-console
      console.error(`[check-db] ${table}: FAIL —`, error.message);
      // eslint-disable-next-line no-console
      console.error(
        "\n→ Jalankan file supabase/setup.sql di Supabase Dashboard → SQL Editor\n",
      );
      process.exitCode = 1;
      return;
    }
    // eslint-disable-next-line no-console
    console.log(`[check-db] ${table}: OK (${data?.length ?? 0} row sample)`);
  }

  // eslint-disable-next-line no-console
  console.log("\n[check-db] Database siap. Jalankan: npm run seed");
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});
