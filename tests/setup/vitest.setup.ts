import "@testing-library/jest-dom/vitest";
import { afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// Provide minimal env for code paths that read env at module load.
beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://stub.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??= "stub_publishable_key";
});
