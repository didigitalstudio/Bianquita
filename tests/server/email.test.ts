import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OrderRow } from "@/lib/data/orders";
import type { Database } from "@/lib/supabase/database.types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

/**
 * We mock the `resend` module so the real Resend SDK never runs in tests
 * and we can assert the payload shape sent to `emails.send`.
 */
const sendMock = vi.fn().mockResolvedValue({ data: { id: "test-email-id" }, error: null });
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

const sampleOrder: OrderRow = {
  id: "11111111-1111-1111-1111-111111111111",
  order_number: "ULB-9001",
  user_id: null,
  customer_name: "Lucia Test",
  customer_email: "lucia@test.dev",
  customer_phone: null,
  customer_dni: null,
  items: [
    { id: "p1", name: "Body manga larga rayado", price: 8900, qty: 2, size: "0-3M", color: "crema", img: "" },
  ],
  shipping_method: "andreani-domicilio",
  shipping_address: { address: "Calle Falsa 123", city: "CABA", zip: "1428" },
  shipping_cost: 5400,
  subtotal: 17800,
  total: 23200,
  payment_method: "transfer",
  payment_status: "pending",
  payment_id: null,
  status: "pendiente-pago",
  notes: null,
  created_at: "2026-05-08T12:00:00.000Z",
  updated_at: "2026-05-08T12:00:00.000Z",
};

describe("email senders — orders", () => {
  beforeEach(() => {
    sendMock.mockClear();
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.RESEND_FROM_EMAIL = "Unilubi Kids <hola@unilubikids.com.ar>";
    delete process.env.CONTACT_INBOX;
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("sendOrderConfirmationEmail calls Resend with order info", async () => {
    const { sendOrderConfirmationEmail } = await import("@/lib/email");
    await sendOrderConfirmationEmail(sampleOrder);

    expect(sendMock).toHaveBeenCalledTimes(1);
    const payload = sendMock.mock.calls[0][0];
    expect(payload.to).toBe("lucia@test.dev");
    expect(payload.from).toBe("Unilubi Kids <hola@unilubikids.com.ar>");
    expect(payload.subject).toContain("ULB-9001");
    expect(payload.html).toContain("ULB-9001");
    expect(payload.html).toContain("Body manga larga rayado");
    expect(payload.html).toContain("$23.200");
  });

  describe("sendOrderStatusEmail", () => {
    const cases: Array<{ status: OrderStatus; subjectMatch: RegExp; bodyMatch: RegExp }> = [
      { status: "pendiente-pago", subjectMatch: /pendiente de pago/i, bodyMatch: /esperando tu pago/i },
      { status: "preparando",     subjectMatch: /preparando/i,        bodyMatch: /preparar tu pedido/i },
      { status: "enviado",        subjectMatch: /camino/i,            bodyMatch: /¡En camino!/ },
      { status: "entregado",      subjectMatch: /entregado/i,         bodyMatch: /Recibiste tu pedido/i },
      { status: "cancelado",      subjectMatch: /cancelado/i,         bodyMatch: /Pedido cancelado/i },
    ];

    for (const { status, subjectMatch, bodyMatch } of cases) {
      it(`uses the right copy for status="${status}"`, async () => {
        const { sendOrderStatusEmail } = await import("@/lib/email");
        await sendOrderStatusEmail({ ...sampleOrder, status });

        expect(sendMock).toHaveBeenCalledTimes(1);
        const payload = sendMock.mock.calls[0][0];
        expect(payload.to).toBe("lucia@test.dev");
        expect(payload.subject).toMatch(subjectMatch);
        expect(payload.html).toMatch(bodyMatch);
        expect(payload.html).toContain("ULB-9001");
      });
    }
  });

  it("is a no-op when RESEND_API_KEY is missing (dev mode)", async () => {
    delete process.env.RESEND_API_KEY;
    vi.resetModules();
    const { sendOrderConfirmationEmail, sendOrderStatusEmail } = await import("@/lib/email");
    await sendOrderConfirmationEmail(sampleOrder);
    await sendOrderStatusEmail(sampleOrder);
    expect(sendMock).not.toHaveBeenCalled();
  });
});

describe("sendContactMessageEmail", () => {
  beforeEach(() => {
    sendMock.mockClear();
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.RESEND_FROM_EMAIL = "Unilubi Kids <hola@unilubikids.com.ar>";
    delete process.env.CONTACT_INBOX;
  });

  afterEach(() => {
    vi.resetModules();
  });

  const baseMsg = {
    name: "Lucia Pérez",
    email: "lucia@cliente.dev",
    subject: "Consulta general",
    message: "Hola! Quería saber si tienen el body en talle 6-9M.",
  };

  it("sends to the default inbox with proper from / reply-to / subject", async () => {
    const { sendContactMessageEmail } = await import("@/lib/email");
    await sendContactMessageEmail(baseMsg);

    expect(sendMock).toHaveBeenCalledTimes(1);
    const payload = sendMock.mock.calls[0][0];
    expect(payload.from).toBe("Unilubi Kids <hola@unilubikids.com.ar>");
    expect(payload.to).toBe("hola@unilubikids.com.ar"); // default inbox
    expect(payload.replyTo).toBe("lucia@cliente.dev");
    expect(payload.subject).toBe("[Contacto] Consulta general — Lucia Pérez");
    expect(payload.html).toContain("Lucia Pérez");
    expect(payload.html).toContain("lucia@cliente.dev");
    expect(payload.html).toContain("Hola! Quería saber si tienen el body en talle 6-9M.");
  });

  it("respects CONTACT_INBOX env var override", async () => {
    process.env.CONTACT_INBOX = "ventas@otro-dominio.com";
    vi.resetModules();
    const { sendContactMessageEmail } = await import("@/lib/email");
    await sendContactMessageEmail(baseMsg);

    const payload = sendMock.mock.calls[0][0];
    expect(payload.to).toBe("ventas@otro-dominio.com");
  });

  it("escapes HTML in user-supplied fields (XSS protection)", async () => {
    const { sendContactMessageEmail } = await import("@/lib/email");
    await sendContactMessageEmail({
      name: '<script>alert("xss")</script>',
      email: "attacker@evil.dev",
      subject: 'Subject with <img src=x onerror="alert(1)">',
      message: 'Message with <a href="javascript:void(0)">click</a> & "quotes"',
    });

    const payload = sendMock.mock.calls[0][0];
    expect(payload.html).not.toContain("<script>");
    expect(payload.html).not.toContain("<img src=x");
    expect(payload.html).not.toContain('<a href="javascript:');
    // raw chars should be encoded
    expect(payload.html).toContain("&lt;script&gt;");
    expect(payload.html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    expect(payload.html).toContain("&amp; &quot;quotes&quot;");
  });

  it("escapes HTML in the email field (the mailto: link)", async () => {
    const { sendContactMessageEmail } = await import("@/lib/email");
    await sendContactMessageEmail({
      ...baseMsg,
      email: 'foo@bar.com"><script>alert(1)</script>',
    });

    const payload = sendMock.mock.calls[0][0];
    expect(payload.html).not.toContain("<script>alert(1)</script>");
    expect(payload.html).toContain("&quot;&gt;&lt;script&gt;");
    // reply-to is set verbatim (Resend handles header escaping)
    expect(payload.replyTo).toBe('foo@bar.com"><script>alert(1)</script>');
  });

  it("preserves newlines in the message body via white-space:pre-wrap", async () => {
    const { sendContactMessageEmail } = await import("@/lib/email");
    await sendContactMessageEmail({
      ...baseMsg,
      message: "Línea 1\nLínea 2\n\nÚltima línea",
    });

    const payload = sendMock.mock.calls[0][0];
    expect(payload.html).toContain("white-space:pre-wrap");
    expect(payload.html).toContain("Línea 1\nLínea 2");
  });

  it("is a no-op when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    vi.resetModules();
    const { sendContactMessageEmail } = await import("@/lib/email");
    await sendContactMessageEmail(baseMsg);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("propagates errors so the route handler can return 500", async () => {
    sendMock.mockRejectedValueOnce(new Error("Resend API down"));
    const { sendContactMessageEmail } = await import("@/lib/email");
    await expect(sendContactMessageEmail(baseMsg)).rejects.toThrow("Resend API down");
  });
});
