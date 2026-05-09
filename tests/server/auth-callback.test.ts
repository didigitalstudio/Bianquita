import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const exchangeMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: {
      exchangeCodeForSession: exchangeMock,
    },
  }),
}));

async function get(url: string): Promise<Response> {
  const { GET } = await import("@/app/api/auth/callback/route");
  return GET(new Request(url) as unknown as Parameters<typeof GET>[0]);
}

describe("GET /api/auth/callback", () => {
  beforeEach(() => {
    exchangeMock.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("redirects to /cuenta/login?error=missing-code when no code", async () => {
    const res = await get("http://localhost:3000/api/auth/callback");
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/cuenta/login?error=missing-code");
    expect(exchangeMock).not.toHaveBeenCalled();
  });

  it("exchanges code and redirects to default /cuenta on success", async () => {
    exchangeMock.mockResolvedValueOnce({ error: null });
    const res = await get("http://localhost:3000/api/auth/callback?code=abc123");
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/cuenta");
    expect(exchangeMock).toHaveBeenCalledWith("abc123");
  });

  it("respects ?next= for the post-exchange redirect", async () => {
    exchangeMock.mockResolvedValueOnce({ error: null });
    const res = await get(
      "http://localhost:3000/api/auth/callback?code=abc&next=/cuenta/reset-password",
    );
    expect(res.headers.get("location")).toBe("http://localhost:3000/cuenta/reset-password");
  });

  it("rejects open-redirect attempts (next must start with /)", async () => {
    exchangeMock.mockResolvedValueOnce({ error: null });
    const res = await get(
      "http://localhost:3000/api/auth/callback?code=abc&next=https://evil.com/phish",
    );
    expect(res.headers.get("location")).toBe("http://localhost:3000/cuenta");
  });

  it("redirects to login?error=invalid-link when exchangeCodeForSession fails", async () => {
    exchangeMock.mockResolvedValueOnce({
      error: { message: "Invalid or expired code" },
    });
    const res = await get("http://localhost:3000/api/auth/callback?code=expired");
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/cuenta/login?error=invalid-link");
  });
});
