import { NextResponse } from "next/server";
import { createOrder } from "@/lib/data/orders";
import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/types";

interface OrderPayload {
  customer: {
    name: string;
    email: string;
    phone?: string;
    dni?: string;
  };
  shipping: {
    method: string;
    address?: string;
    city?: string;
    zip?: string;
  };
  payment: {
    method: "card" | "transfer" | "mp";
  };
  items: CartItem[];
  shippingCost: number;
  subtotal: number;
  total: number;
}

const FREE_SHIP_THRESHOLD = 35000;

function isShippingMethod(s: unknown): s is string {
  return typeof s === "string" && s.length > 0 && s.length < 64;
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
  if (!["card", "transfer", "mp"].includes(body.payment?.method)) {
    return NextResponse.json({ error: "Método de pago inválido" }, { status: 400 });
  }

  // Recompute totals server-side from item prices to prevent tampering.
  // (We trust the cart prices only as a placeholder; with real catalog
  // pricing we'd look up each item by id from the products table.)
  const subtotal = body.items.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingCost = subtotal >= FREE_SHIP_THRESHOLD ? 0 : Math.max(0, body.shippingCost ?? 0);
  const total = subtotal + shippingCost;

  // Attach user_id if logged in
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
      paymentMethod: body.payment.method,
    });
    return NextResponse.json({
      orderNumber: order.order_number,
      id: order.id,
      total: order.total,
      status: order.status,
    });
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No pudimos crear el pedido" },
      { status: 500 },
    );
  }
}
