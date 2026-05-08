import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  zip: string;
  isDefault?: boolean;
}

export async function getMyProfile(): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export function parseAddresses(raw: unknown): Address[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((a): a is Address =>
    a && typeof a === "object" && typeof (a as Address).address === "string",
  );
}
