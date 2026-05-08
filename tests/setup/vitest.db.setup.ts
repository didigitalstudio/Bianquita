import { beforeAll } from "vitest";
import { config as loadEnv } from "dotenv";
import path from "node:path";

beforeAll(() => {
  loadEnv({ path: path.resolve(process.cwd(), ".env.test"), override: true });

  if (!process.env.STAGING_SUPABASE_URL) {
    throw new Error(
      "STAGING_SUPABASE_URL is required for DB tests. " +
        "Configure .env.test (locally) or repo secrets (CI).",
    );
  }
  if (!process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("STAGING_SUPABASE_SERVICE_ROLE_KEY is required for DB tests.");
  }
  if (!process.env.STAGING_SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("STAGING_SUPABASE_PUBLISHABLE_KEY is required for DB tests.");
  }
});
