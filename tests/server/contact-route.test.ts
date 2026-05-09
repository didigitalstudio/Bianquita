import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Mock the email helper so we don't hit Resend.
 * The route is tested in isolation: validation, error paths, success path.
 */
const sendContactMock = vi.fn().mockResolvedValue(undefined);
vi.mock("@/lib/email", () => ({
  sendContactMessageEmail: sendContactMock,
}));

async function postJson(body: unknown): Promise<Response> {
  const { POST } = await import("@/app/api/contact/route");
  const req = new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return POST(req);
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    sendContactMock.mockClear();
    sendContactMock.mockResolvedValue(undefined);
    // Silence the console.error from the 500 path test
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const validBody = {
    name: "Lucia Pérez",
    email: "lucia@cliente.dev",
    subject: "Consulta general",
    message: "Hola! Tengo una pregunta sobre el body manga larga.",
  };

  describe("happy path", () => {
    it("returns 200 + ok:true and forwards trimmed values", async () => {
      const res = await postJson({
        name: "  Lucia Pérez  ",
        email: "  lucia@cliente.dev  ",
        subject: "  Consulta general  ",
        message: "  Hola! Tengo una pregunta.  ",
      });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true });

      expect(sendContactMock).toHaveBeenCalledTimes(1);
      expect(sendContactMock).toHaveBeenCalledWith({
        name: "Lucia Pérez",
        email: "lucia@cliente.dev",
        subject: "Consulta general",
        message: "Hola! Tengo una pregunta.",
      });
    });
  });

  describe("400 — body parsing", () => {
    it("rejects malformed JSON", async () => {
      const res = await postJson("{ not json");
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "Invalid JSON" });
      expect(sendContactMock).not.toHaveBeenCalled();
    });
  });

  describe("400 — name validation", () => {
    it("rejects missing name", async () => {
      const res = await postJson({ ...validBody, name: undefined });
      expect(res.status).toBe(400);
      expect((await res.json()).error).toMatch(/Nombre/);
    });
    it("rejects empty / whitespace-only name", async () => {
      const res = await postJson({ ...validBody, name: "   " });
      expect(res.status).toBe(400);
    });
    it("rejects name longer than 120 chars", async () => {
      const res = await postJson({ ...validBody, name: "a".repeat(121) });
      expect(res.status).toBe(400);
    });
    it("accepts name exactly 120 chars", async () => {
      const res = await postJson({ ...validBody, name: "a".repeat(120) });
      expect(res.status).toBe(200);
    });
  });

  describe("400 — email validation", () => {
    it("rejects missing email", async () => {
      const res = await postJson({ ...validBody, email: undefined });
      expect(res.status).toBe(400);
      expect((await res.json()).error).toMatch(/Email/);
    });
    it.each([
      "foo",
      "foo@",
      "@bar.com",
      "foo@bar",
      "foo bar@baz.com",
      "foo@bar.",
    ])("rejects malformed email: %s", async (email) => {
      const res = await postJson({ ...validBody, email });
      expect(res.status).toBe(400);
    });
    it("rejects email longer than 200 chars", async () => {
      // 195 + "@b.com" = 201 chars, regex passes but length cap should fail
      const res = await postJson({
        ...validBody,
        email: "a".repeat(195) + "@b.com",
      });
      expect(res.status).toBe(400);
    });
    it.each([
      "foo@bar.com",
      "foo.bar+tag@sub.example.co.uk",
      "ñoño@dominio.com.ar",
    ])("accepts valid email: %s", async (email) => {
      const res = await postJson({ ...validBody, email });
      expect(res.status).toBe(200);
    });
  });

  describe("400 — subject validation", () => {
    it("rejects empty subject", async () => {
      const res = await postJson({ ...validBody, subject: "" });
      expect(res.status).toBe(400);
      expect((await res.json()).error).toMatch(/Asunto/);
    });
    it("rejects subject longer than 200 chars", async () => {
      const res = await postJson({ ...validBody, subject: "x".repeat(201) });
      expect(res.status).toBe(400);
    });
  });

  describe("400 — message validation", () => {
    it("rejects message shorter than 5 chars", async () => {
      const res = await postJson({ ...validBody, message: "Hola" });
      expect(res.status).toBe(400);
      expect((await res.json()).error).toMatch(/Mensaje/);
    });
    it("rejects message longer than 4000 chars", async () => {
      const res = await postJson({ ...validBody, message: "a".repeat(4001) });
      expect(res.status).toBe(400);
    });
    it("accepts message exactly 4000 chars", async () => {
      const res = await postJson({ ...validBody, message: "a".repeat(4000) });
      expect(res.status).toBe(200);
    });
  });

  describe("500 — Resend failure", () => {
    it("returns generic error message when sender throws", async () => {
      sendContactMock.mockRejectedValueOnce(new Error("Resend API quota exceeded"));
      const res = await postJson(validBody);

      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.error).toMatch(/No pudimos enviar/);
      // Crucially, the internal error message must NOT leak to the client
      expect(body.error).not.toContain("Resend");
      expect(body.error).not.toContain("quota");
    });
  });
});
