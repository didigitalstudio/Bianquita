import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_URL, getServiceRoleKey } from "./env";

let cached: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Service-role Supabase client. Bypasses RLS — server-only.
 * Use ONLY in route handlers / server actions / webhooks where
 * privileged access is required (e.g. inserting orders for guests,
 * processing payment webhooks).
 */
export function createAdminClient() {
  if (cached) return cached;
  cached = createClient<Database>(SUPABASE_URL, getServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
