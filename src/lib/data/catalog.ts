import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Category, Audience } from "@/lib/types";

export async function listCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id,label,icon,sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((c) => ({ id: c.id, label: c.label, icon: c.icon ?? "" }));
}

export async function listAudiences(): Promise<Audience[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audiences")
    .select("id,label,range,sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((a) => ({ id: a.id, label: a.label, range: a.range ?? "" }));
}
