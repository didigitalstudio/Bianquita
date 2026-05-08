import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";
import type { CartItem } from "@/lib/types";

export type OrderStatus = Database["public"]["Enums"]["order_status"];
export type PaymentStatus = Database["public"]["Enums"]["payment_status"];
export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

export interface NewOrderInput {
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  customerDni?: string | null;
  items: CartItem[];
  shippingMethod: string;
  shippingAddress: Record<string, unknown>;
  shippingCost: number;
  subtotal: number;
  total: number;
  paymentMethod: "card" | "transfer" | "mp";
  notes?: string;
}

function generateOrderNumber(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `ULB-${n}`;
}

/**
 * Creates a new order. Runs with the service role to bypass RLS so guest
 * checkouts work too. The caller is responsible for validating cart contents
 * (prices, stock) before calling this.
 */
export async function createOrder(input: NewOrderInput): Promise<OrderRow> {
  const supabase = createAdminClient();

  // Try a few times in case of order_number collision (very unlikely with 4 digits).
  for (let attempt = 0; attempt < 5; attempt++) {
    const orderNumber = generateOrderNumber();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: input.userId ?? null,
        customer_name: input.customerName,
        customer_email: input.customerEmail,
        customer_phone: input.customerPhone ?? null,
        customer_dni: input.customerDni ?? null,
        items: input.items as unknown as Database["public"]["Tables"]["orders"]["Insert"]["items"],
        shipping_method: input.shippingMethod,
        shipping_address: input.shippingAddress as Database["public"]["Tables"]["orders"]["Insert"]["shipping_address"],
        shipping_cost: input.shippingCost,
        subtotal: input.subtotal,
        total: input.total,
        payment_method: input.paymentMethod,
        notes: input.notes ?? null,
      })
      .select("*")
      .single();

    if (!error) return data;
    // Unique violation on order_number → retry
    if (error.code === "23505" && error.message.includes("order_number")) continue;
    throw error;
  }
  throw new Error("Could not generate a unique order number after 5 attempts");
}

export async function listOrdersForAdmin(): Promise<OrderRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listOrdersForUser(userId: string): Promise<OrderRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<OrderRow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
