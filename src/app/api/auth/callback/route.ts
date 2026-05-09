import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth / email-link callback. Supabase redirects here after the user clicks
 * a magic link or password-reset link in their email; we exchange the code
 * for a session (sets the auth cookie) and redirect to `next` (the page where
 * they should land, e.g. /cuenta/reset-password).
 *
 * Configure this URL in Supabase Dashboard → Authentication → URL Configuration:
 *   Site URL:               https://unilubikids.com.ar
 *   Redirect URLs (allow):  https://unilubikids.com.ar/api/auth/callback
 *                           https://*-unilubi.vercel.app/api/auth/callback   (preview)
 *                           http://localhost:3000/api/auth/callback          (dev)
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/cuenta";

  if (!code) {
    return NextResponse.redirect(
      `${origin}/cuenta/login?error=missing-code`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback]", error);
    return NextResponse.redirect(
      `${origin}/cuenta/login?error=invalid-link`,
    );
  }

  // Only redirect to relative paths (defense against open redirects).
  const safeNext = next.startsWith("/") ? next : "/cuenta";
  return NextResponse.redirect(`${origin}${safeNext}`);
}
