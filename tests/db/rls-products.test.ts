import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { config as loadEnv } from "dotenv";
import path from "node:path";

// Load .env.test BEFORE the createClient calls below.
loadEnv({ path: path.resolve(process.cwd(), ".env.test") });

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/**
 * RLS tests against the configured Supabase project (set via STAGING_*
 * env vars). The default workflow points STAGING_* at production.
 *
 * Safety:
 *  - Test product uses a unique timestamped id and `active = false`, so it
 *    never appears on /tienda even if cleanup fails.
 *  - Test user uses a unique email and is deleted in afterAll.
 *  - `beforeAll` also pre-cleans any residue from a prior failed run.
 */

const stagingUrl = process.env.STAGING_SUPABASE_URL!;
const publishableKey = process.env.STAGING_SUPABASE_PUBLISHABLE_KEY!;
const serviceRoleKey = process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY!;

const adminClient = createClient<Database>(stagingUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const RUN_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const TEST_PRODUCT_ID = `rls-test-${RUN_ID}`;
const TEST_USER_EMAIL = `rls-test-${RUN_ID}@unilubi.test`;
const TEST_USER_PASSWORD = "rls-tests-correct-horse-battery-staple";
let testUserId: string | null = null;

async function cleanupResidue() {
  // Best-effort cleanup of leftover test data from prior runs.
  await adminClient.from("products").delete().like("id", "rls-test-%");
  const { data: users } = await adminClient.auth.admin.listUsers({ perPage: 200 });
  for (const u of users?.users ?? []) {
    if (u.email?.startsWith("rls-test-")) {
      await adminClient.auth.admin.deleteUser(u.id);
    }
  }
}

beforeAll(async () => {
  await cleanupResidue();

  // Insert the test product (inactive so it doesn't surface on /tienda).
  const { error: insertErr } = await adminClient.from("products").insert({
    id: TEST_PRODUCT_ID,
    slug: TEST_PRODUCT_ID,
    name: "[RLS test] not for sale",
    category_id: "bodies",
    audience_id: "bebe",
    price: 1000,
    stock: { "0-3M": 1 },
    img: "https://example.com/x.jpg",
    active: false,
  });
  if (insertErr) throw insertErr;

  const { data: created, error } = await adminClient.auth.admin.createUser({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
    email_confirm: true,
  });
  if (error) throw error;
  testUserId = created.user.id;
});

afterAll(async () => {
  try {
    if (testUserId) await adminClient.auth.admin.deleteUser(testUserId);
  } catch {
    /* best-effort */
  }
  try {
    await adminClient.from("products").delete().eq("id", TEST_PRODUCT_ID);
  } catch {
    /* best-effort */
  }
});

describe("RLS — products table", () => {
  it("anon CAN SELECT active products", async () => {
    const anon = createClient<Database>(stagingUrl, publishableKey);
    const { data, error } = await anon.from("products").select("id,name").eq("active", true).limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it("anon CANNOT SELECT inactive products", async () => {
    const anon = createClient<Database>(stagingUrl, publishableKey);
    const { data } = await anon.from("products").select("id").eq("id", TEST_PRODUCT_ID);
    expect(data ?? []).toHaveLength(0); // RLS hides it
  });

  it("anon CANNOT INSERT a product", async () => {
    const anon = createClient<Database>(stagingUrl, publishableKey);
    const { error } = await anon.from("products").insert({
      id: `rls-attempt-${RUN_ID}`,
      slug: `rls-attempt-${RUN_ID}`,
      name: "Should fail",
      category_id: "bodies",
      audience_id: "bebe",
      price: 100,
    });
    expect(error).not.toBeNull();
    expect(
      error?.code === "42501" || /row-level security/i.test(error?.message ?? ""),
    ).toBeTruthy();
  });

  it("authenticated non-admin CANNOT UPDATE a product", async () => {
    const userClient = createClient<Database>(stagingUrl, publishableKey);
    const { error: signInErr } = await userClient.auth.signInWithPassword({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });
    expect(signInErr).toBeNull();

    const { error, data } = await userClient
      .from("products")
      .update({ price: 999_999 })
      .eq("id", TEST_PRODUCT_ID)
      .select();
    expect(data ?? []).toHaveLength(0); // silently no-op under RLS
    if (error) {
      expect(error.code === "42501" || /row-level security/i.test(error.message)).toBeTruthy();
    }

    const { data: row } = await adminClient
      .from("products")
      .select("price")
      .eq("id", TEST_PRODUCT_ID)
      .single();
    expect(row?.price).toBe(1000);
  });

  it("service_role CAN UPDATE (sanity check)", async () => {
    const { error } = await adminClient
      .from("products")
      .update({ price: 1500 })
      .eq("id", TEST_PRODUCT_ID);
    expect(error).toBeNull();
    const { data } = await adminClient
      .from("products")
      .select("price")
      .eq("id", TEST_PRODUCT_ID)
      .single();
    expect(data?.price).toBe(1500);
  });
});
