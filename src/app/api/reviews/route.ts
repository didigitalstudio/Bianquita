import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Iniciá sesión para dejar una reseña" }, { status: 401 });

  let body: { productId?: string; rating?: number; title?: string; text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { productId, rating, title, text } = body;
  if (!productId || typeof productId !== "string") return NextResponse.json({ error: "productId requerido" }, { status: 400 });
  if (typeof rating !== "number" || rating < 1 || rating > 5) return NextResponse.json({ error: "Rating debe ser 1-5" }, { status: 400 });
  if (text && text.length > 2000) return NextResponse.json({ error: "El texto es demasiado largo" }, { status: 400 });

  const { error } = await supabase.from("reviews").upsert({
    product_id: productId,
    user_id: user.id,
    rating,
    title: title?.slice(0, 120) ?? null,
    body: text?.slice(0, 2000) ?? null,
  }, { onConflict: "product_id,user_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
