import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const limit = Math.min(20, Number(searchParams.get("limit") ?? 6));

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("id,slug,name,price,compare_at,img,category_id,tags")
    .eq("active", true);

  if (q) {
    const safe = q.replace(/[%_]/g, "");
    query = query.or(`name.ilike.%${safe}%,description.ilike.%${safe}%,category_id.ilike.%${safe}%`);
  } else {
    query = query.contains("tags", ["best-seller"]);
  }

  const { data, error } = await query.limit(limit);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = (data ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    compareAt: p.compare_at,
    img: p.img,
    category: p.category_id,
    tags: p.tags,
  }));
  return NextResponse.json({ results });
}
