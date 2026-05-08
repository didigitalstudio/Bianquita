import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

export interface ReviewWithAuthor extends ReviewRow {
  author_name: string;
}

export interface ReviewsSummary {
  count: number;
  average: number;
  reviews: ReviewWithAuthor[];
}

export async function getReviewsForProduct(productId: string): Promise<ReviewsSummary> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = data ?? [];
  if (rows.length === 0) return { count: 0, average: 0, reviews: [] };

  const userIds = [...new Set(rows.map((r) => r.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id,name")
    .in("id", userIds);
  const nameMap = new Map((profiles ?? []).map((p) => [p.id, p.name ?? "Cliente"] as const));

  const reviews: ReviewWithAuthor[] = rows.map((r) => ({
    ...r,
    author_name: nameMap.get(r.user_id) ?? "Cliente",
  }));
  const average = rows.reduce((s, r) => s + r.rating, 0) / rows.length;
  return { count: rows.length, average, reviews };
}
