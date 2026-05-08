import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ids: [] });
  const { data, error } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ids: (data ?? []).map((r) => r.product_id) });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth required" }, { status: 401 });

  let body: { productId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const productId = body.productId;
  if (!productId || typeof productId !== "string") {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("wishlists").delete().eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ added: false });
  }
  const { error } = await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ added: true });
}
