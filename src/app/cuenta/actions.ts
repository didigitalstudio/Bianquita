"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseAddresses, type Address } from "@/lib/data/profile";
import type { Database } from "@/lib/supabase/database.types";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Necesitás iniciar sesión");
  return { supabase, user };
}

export async function updateMyProfile(input: {
  name: string;
  phone: string;
  dni: string;
}) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("profiles")
    .update({
      name: input.name.trim(),
      phone: input.phone.trim() || null,
      dni: input.dni.trim() || null,
    })
    .eq("id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/cuenta");
}

export async function addMyAddress(input: Omit<Address, "id">) {
  const { supabase, user } = await requireUser();
  const { data: profile, error: readErr } = await supabase
    .from("profiles")
    .select("addresses")
    .eq("id", user.id)
    .maybeSingle();
  if (readErr) throw new Error(readErr.message);
  const existing = parseAddresses(profile?.addresses);
  const newAddress: Address = { ...input, id: crypto.randomUUID() };
  const next = input.isDefault
    ? [{ ...newAddress, isDefault: true }, ...existing.map((a) => ({ ...a, isDefault: false }))]
    : existing.length === 0
      ? [{ ...newAddress, isDefault: true }]
      : [...existing, newAddress];
  const { error } = await supabase.from("profiles").update({ addresses: next as unknown as Database["public"]["Tables"]["profiles"]["Update"]["addresses"] }).eq("id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/cuenta");
}

export async function removeMyAddress(id: string) {
  const { supabase, user } = await requireUser();
  const { data: profile, error: readErr } = await supabase
    .from("profiles")
    .select("addresses")
    .eq("id", user.id)
    .maybeSingle();
  if (readErr) throw new Error(readErr.message);
  const existing = parseAddresses(profile?.addresses);
  const next = existing.filter((a) => a.id !== id);
  if (next.length > 0 && !next.some((a) => a.isDefault)) next[0].isDefault = true;
  const { error } = await supabase.from("profiles").update({ addresses: next as unknown as Database["public"]["Tables"]["profiles"]["Update"]["addresses"] }).eq("id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/cuenta");
}

export async function toggleWishlist(productId: string) {
  const { supabase, user } = await requireUser();
  const { data: existing } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();
  if (existing) {
    const { error } = await supabase.from("wishlists").delete().eq("id", existing.id);
    if (error) throw new Error(error.message);
    revalidatePath("/cuenta");
    return { added: false };
  }
  const { error } = await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId });
  if (error) throw new Error(error.message);
  revalidatePath("/cuenta");
  return { added: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/cuenta/login");
}
