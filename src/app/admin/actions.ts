"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendOrderStatusEmail } from "@/lib/email";
import type { Database } from "@/lib/supabase/database.types";
import type { Product } from "@/lib/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.is_admin) throw new Error("Acceso denegado");
  return supabase;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function createProduct(input: Product) {
  const supabase = await requireAdmin();
  const id = input.id && input.id !== "new" ? input.id : `p-${Date.now()}`;
  const slug = input.slug || slugify(input.name) || id;
  const { error } = await supabase.from("products").insert({
    id,
    slug,
    name: input.name,
    category_id: input.category,
    audience_id: input.audience,
    price: input.price,
    compare_at: input.compareAt,
    description: input.description,
    materials: input.materials,
    care: input.care,
    tags: input.tags,
    colors: input.colors,
    stock: input.stock as Database["public"]["Tables"]["products"]["Insert"]["stock"],
    img: input.img,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/tienda");
  revalidatePath("/");
  return { id };
}

export async function updateProduct(id: string, input: Product) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("products")
    .update({
      slug: input.slug || slugify(input.name) || id,
      name: input.name,
      category_id: input.category,
      audience_id: input.audience,
      price: input.price,
      compare_at: input.compareAt,
      description: input.description,
      materials: input.materials,
      care: input.care,
      tags: input.tags,
      colors: input.colors,
      stock: input.stock as Database["public"]["Tables"]["products"]["Update"]["stock"],
      img: input.img,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/tienda");
  revalidatePath(`/producto/${id}`);
}

export async function deleteProduct(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/tienda");
}

export async function updateStock(id: string, stock: Record<string, number>) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("products")
    .update({ stock: stock as Database["public"]["Tables"]["products"]["Update"]["stock"] })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = await requireAdmin();
  const { data: updated, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  if (updated) {
    void sendOrderStatusEmail(updated).catch((err) => console.error("[email]", err));
  }
  revalidatePath("/admin");
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
