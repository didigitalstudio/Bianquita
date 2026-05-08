import "server-only";

import { MercadoPagoConfig, Preference } from "mercadopago";
import type { OrderRow } from "@/lib/data/orders";
import { BRAND } from "@/lib/constants";

interface CartItemLike {
  id: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
  img?: string;
}

export function isMercadoPagoConfigured(): boolean {
  return !!process.env.MP_ACCESS_TOKEN;
}

function getClient(): MercadoPagoConfig {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error("MP_ACCESS_TOKEN no está configurado");
  return new MercadoPagoConfig({ accessToken: token });
}

export interface CreatePreferenceInput {
  order: OrderRow;
  items: CartItemLike[];
  baseUrl: string;
}

export async function createPaymentPreference({ order, items, baseUrl }: CreatePreferenceInput): Promise<{ id: string; initPoint: string }> {
  const client = getClient();
  const pref = new Preference(client);
  const result = await pref.create({
    body: {
      items: items.map((it) => ({
        id: it.id,
        title: `${it.name}${it.size ? ` · ${it.size}` : ""}${it.color ? ` · ${it.color}` : ""}`,
        quantity: it.qty,
        unit_price: it.price,
        currency_id: "ARS",
      })),
      payer: {
        name: order.customer_name,
        email: order.customer_email,
      },
      external_reference: order.id,
      statement_descriptor: BRAND.name.toUpperCase(),
      back_urls: {
        success: `${baseUrl}/checkout/exito?order=${order.order_number}`,
        failure: `${baseUrl}/checkout/error?order=${order.order_number}`,
        pending: `${baseUrl}/checkout/pendiente?order=${order.order_number}`,
      },
      auto_return: "approved",
      notification_url: `${baseUrl}/api/webhooks/mp`,
      shipments: {
        cost: order.shipping_cost,
        mode: "not_specified",
      },
    },
  });
  if (!result.id || !result.init_point) {
    throw new Error("MercadoPago no devolvió init_point");
  }
  return { id: result.id, initPoint: result.init_point };
}

export type MpPaymentStatus = "approved" | "pending" | "in_process" | "rejected" | "cancelled";

export async function fetchPayment(paymentId: string): Promise<{ status: MpPaymentStatus; externalReference: string | null } | null> {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return null;
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return {
    status: data.status as MpPaymentStatus,
    externalReference: data.external_reference ?? null,
  };
}
