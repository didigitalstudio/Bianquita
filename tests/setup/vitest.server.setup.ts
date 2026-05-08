import { beforeAll } from "vitest";

beforeAll(() => {
  // Stub values — server tests should mock the SDKs they call out to.
  process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://stub.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??= "stub_publishable_key";
  process.env.SUPABASE_SERVICE_ROLE_KEY ??= "stub_service_key";
  process.env.RESEND_API_KEY ??= "re_test_key";
});
