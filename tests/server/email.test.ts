import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OrderRow } from "@/lib/data/orders";

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

describe("email senders", () => {
  beforeEach(() => {
    sendMock.mockClear();
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.RESEND_FROM_EMAIL = "Unilubi Kids <hola@unilubikids.com.ar>";
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
    expect(payload.html).toContain("$23.200"); // total formatted ARS
  });

  it("sendOrderStatusEmail picks the right copy per status", async () => {
    const { sendOrderStatusEmail } = await import("@/lib/email");
    await sendOrderStatusEmail({ ...sampleOrder, status: "enviado" });

    expect(sendMock).toHaveBeenCalledTimes(1);
    const payload = sendMock.mock.calls[0][0];
    expect(payload.subject).toContain("camino");
    expect(payload.html).toContain("¡En camino!");
  });

  it("is a no-op when RESEND_API_KEY is missing (dev mode)", async () => {
    delete process.env.RESEND_API_KEY;
    vi.resetModules();
    const { sendOrderConfirmationEmail } = await import("@/lib/email");
    await sendOrderConfirmationEmail(sampleOrder);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
