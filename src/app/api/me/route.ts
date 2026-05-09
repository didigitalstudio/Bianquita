import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMyProfile, parseAddresses } from "@/lib/data/profile";

/**
 * Lightweight profile endpoint for client components that need to know
 * "is the user logged in, and if so, what's their basic info?".
 *
 * Returns 200 with `{ user: null }` for guests (NOT 401) — this lets the
 * caller `useEffect` once without error handling and just check `!user`.
 *
 * Used by /checkout to autofill the form when the customer is logged in.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null });
  }

  const profile = await getMyProfile();
  const addresses = parseAddresses(profile?.addresses);
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;

  return NextResponse.json({
    user: {
      email: user.email ?? "",
      name: profile?.name ?? "",
      phone: profile?.phone ?? "",
      dni: profile?.dni ?? "",
      defaultAddress: defaultAddress
        ? { address: defaultAddress.address, city: defaultAddress.city, zip: defaultAddress.zip }
        : null,
    },
  });
}
