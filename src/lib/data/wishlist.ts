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

export async function getMyWishlistIds(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", user.id);
  if (error) throw error;
  return (data ?? []).map((r) => r.product_id);
}

export async function getMyWishlist(): Promise<Product[]> {
  const ids = await getMyWishlistIds();
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("id", ids);
  if (error) throw error;
  return (data ?? []).map(rowToProduct);
}
