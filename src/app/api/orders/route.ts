import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createOrder } from "@/lib/data/orders";
import { createClient } from "@/lib/supabase/server";
import { createPaymentPreference, isMercadoPagoConfigured } from "@/lib/mercadopago";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { FREE_SHIP_THRESHOLD, TRANSFER_DISCOUNT } from "@/lib/constants";
import type { CartItem } from "@/lib/types";

interface OrderPayload {
  customer: { name: string; email: string; phone?: string; dni?: string };
  shipping: { method: string; address?: string; city?: string; zip?: string };
  payment: { method: "card" | "transfer" | "mp" };
  items: CartItem[];
  shippingCost: number;
  subtotal: number;
  total: number;
}

function isShippingMethod(s: unknown): s is string {
  return typeof s === "string" && s.length > 0 && s.length < 64;
}

async function resolveBaseUrl(): Promise<string> {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export async function POST(request: Request) {
  let body: OrderPayload;
  try {
    body = (await request.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.customer?.name || !body.customer?.email) {
    return NextResponse.json({ error: "Faltan datos del cliente" }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
  }
  if (!isShippingMethod(body.shipping?.method)) {
    return NextResponse.json({ error: "Método de envío inválido" }, { status: 400 });
  }
  const paymentMethod = body.payment?.method;
  if (!["card", "transfer", "mp"].includes(paymentMethod)) {
    return NextResponse.json({ error: "Método de pago inválido" }, { status: 400 });
  }

  const subtotal = body.items.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingCost = subtotal >= FREE_SHIP_THRESHOLD ? 0 : Math.max(0, body.shippingCost ?? 0);
  const transferDiscount = paymentMethod === "transfer" ? Math.round(subtotal * TRANSFER_DISCOUNT) : 0;
  const total = subtotal + shippingCost - transferDiscount;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    const order = await createOrder({
      userId: user?.id ?? null,
      customerName: body.customer.name,
      customerEmail: body.customer.email,
      customerPhone: body.customer.phone ?? null,
      customerDni: body.customer.dni ?? null,
      items: body.items,
      shippingMethod: body.shipping.method,
      shippingAddress: {
        address: body.shipping.address ?? "",
        city: body.shipping.city ?? "",
        zip: body.shipping.zip ?? "",
      },
      shippingCost,
      subtotal,
      total,
      paymentMethod,
    });

    let paymentRedirectUrl: string | null = null;
    if ((paymentMethod === "card" || paymentMethod === "mp") && isMercadoPagoConfigured()) {
      try {
        const baseUrl = await resolveBaseUrl();
        const pref = await createPaymentPreference({ order, items: body.items, baseUrl });
        paymentRedirectUrl = pref.initPoint;
      } catch (err) {
        console.error("[mp create-preference]", err);
      }
    }

    // Fire-and-forget confirmation email
    void sendOrderConfirmationEmail(order).catch((err) => console.error("[email]", err));

    return NextResponse.json({
      orderNumber: order.order_number,
      id: order.id,
      total: order.total,
      status: order.status,
      paymentRedirectUrl,
    });
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No pudimos crear el pedido" },
      { status: 500 },
    );
  }
}
