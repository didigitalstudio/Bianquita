import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import type { Database } from "@/lib/supabase/database.types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

function rowToProduct(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category_id,
    audience: r.audience_id,
    price: r.price,
    compareAt: r.compare_at,
    description: r.description,
    materials: r.materials,
    care: r.care,
    tags: r.tags,
    colors: r.colors,
    stock: (r.stock ?? {}) as Record<string, number>,
    img: r.img,
    images: r.images,
    active: r.active,
  };
}

export async function listProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToProduct(data) : null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToProduct(data) : null;
}

export async function listProductsForAdmin(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToProduct);
}
