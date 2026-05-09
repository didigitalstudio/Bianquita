import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getUserMock = vi.fn();
const getProfileMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser: getUserMock },
  }),
}));

vi.mock("@/lib/data/profile", async () => {
  const actual = await vi.importActual<typeof import("@/lib/data/profile")>("@/lib/data/profile");
  return {
    ...actual,
    getMyProfile: getProfileMock,
  };
});

async function get(): Promise<Response> {
  const { GET } = await import("@/app/api/me/route");
  return GET();
}

describe("GET /api/me", () => {
  beforeEach(() => {
    getUserMock.mockReset();
    getProfileMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns { user: null } for guests (NOT 401, by design)", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null } });
    const res = await get();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ user: null });
    expect(getProfileMock).not.toHaveBeenCalled();
  });

  it("returns email + profile fields for logged-in users", async () => {
    getUserMock.mockResolvedValueOnce({
      data: { user: { id: "u1", email: "lucia@test.dev" } },
    });
    getProfileMock.mockResolvedValueOnce({
      name: "Lucia Pérez",
      phone: "+5491111111111",
      dni: "32145678",
      addresses: [],
    });
    const res = await get();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.email).toBe("lucia@test.dev");
    expect(body.user.name).toBe("Lucia Pérez");
    expect(body.user.phone).toBe("+5491111111111");
    expect(body.user.dni).toBe("32145678");
    expect(body.user.defaultAddress).toBeNull();
  });

  it("returns the default address when set, else the first one", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "u1", email: "x@y.com" } } });
    getProfileMock.mockResolvedValueOnce({
      addresses: [
        { id: "1", label: "Casa", address: "Av Test 123", city: "CABA", zip: "1428", isDefault: false },
        { id: "2", label: "Trabajo", address: "Calle 42 567", city: "GBA", zip: "1602", isDefault: true },
      ],
    });
    const res = await get();
    const body = await res.json();
    expect(body.user.defaultAddress).toEqual({
      address: "Calle 42 567",
      city: "GBA",
      zip: "1602",
    });
  });

  it("falls back to first address when none is marked default", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "u1", email: "x@y.com" } } });
    getProfileMock.mockResolvedValueOnce({
      addresses: [
        { id: "1", label: "Casa", address: "Primera", city: "CABA", zip: "1428" },
        { id: "2", label: "Trabajo", address: "Segunda", city: "CABA", zip: "1429" },
      ],
    });
    const res = await get();
    const body = await res.json();
    expect(body.user.defaultAddress?.address).toBe("Primera");
  });

  it("handles profiles with no name/phone/dni gracefully", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "u1", email: "minimal@test.dev" } } });
    getProfileMock.mockResolvedValueOnce(null);
    const res = await get();
    const body = await res.json();
    expect(body.user).toEqual({
      email: "minimal@test.dev",
      name: "",
      phone: "",
      dni: "",
      defaultAddress: null,
    });
  });
});
