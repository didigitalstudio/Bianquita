import { NextResponse } from "next/server";
import { fetchPayment } from "@/lib/mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

type PaymentStatus = Database["public"]["Enums"]["payment_status"];
type OrderStatus = Database["public"]["Enums"]["order_status"];

const STATUS_MAP: Record<string, { payment: PaymentStatus; order?: OrderStatus }> = {
  approved:   { payment: "approved",   order: "preparando" },
  pending:    { payment: "pending" },
  in_process: { payment: "in_process" },
  rejected:   { payment: "rejected",   order: "cancelado" },
  cancelled:  { payment: "cancelled",  order: "cancelado" },
};

/**
 * MercadoPago IPN/webhook handler. Receives a notification when a payment
 * changes state, looks up the payment with the MP API, and updates the order.
 *
 * Docs: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/your-integrations/notifications/webhooks
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const topic = url.searchParams.get("topic") ?? url.searchParams.get("type");
  const queryId = url.searchParams.get("id") ?? url.searchParams.get("data.id");

  let bodyId: string | null = null;
  try {
    const body = await request.json();
    if (body?.data?.id) bodyId = String(body.data.id);
  } catch {
    // Some MP test payloads have no body — that's fine.
  }
  const paymentId = bodyId ?? queryId;

  if (!paymentId) return NextResponse.json({ ok: true });
  if (topic && topic !== "payment") return NextResponse.json({ ok: true });

  const payment = await fetchPayment(paymentId);
  if (!payment || !payment.externalReference) {
    return NextResponse.json({ ok: false, reason: "payment-not-found" });
  }

  const map = STATUS_MAP[payment.status];
  if (!map) return NextResponse.json({ ok: true });

  const supabase = createAdminClient();
  const update: Database["public"]["Tables"]["orders"]["Update"] = {
    payment_status: map.payment,
    payment_id: paymentId,
  };
  if (map.order) update.status = map.order;

  const { error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", payment.externalReference);

  if (error) {
    console.error("[mp-webhook]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

// MercadoPago tests the URL with a GET; respond 200.
export async function GET() {
  return NextResponse.json({ ok: true });
}
