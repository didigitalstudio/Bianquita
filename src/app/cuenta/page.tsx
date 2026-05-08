import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};
import { getMyProfile, parseAddresses } from "@/lib/data/profile";
import { listOrdersForUser } from "@/lib/data/orders";
import { getMyWishlist } from "@/lib/data/wishlist";
import { createClient } from "@/lib/supabase/server";
import CuentaClient, { type ClientOrder } from "./CuentaClient";

export default async function CuentaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/cuenta/login");

  const [profile, orderRows, wishlist] = await Promise.all([
    getMyProfile(),
    listOrdersForUser(user.id),
    getMyWishlist(),
  ]);

  const orders: ClientOrder[] = orderRows.map((o) => ({
    id: o.id,
    number: o.order_number,
    date: o.created_at,
    status: o.status,
    items: Array.isArray(o.items) ? o.items.length : 0,
    total: o.total,
  }));

  return (
    <CuentaClient
      email={user.email ?? ""}
      profile={{
        name: profile?.name ?? "",
        phone: profile?.phone ?? "",
        dni: profile?.dni ?? "",
        addresses: parseAddresses(profile?.addresses),
      }}
      orders={orders}
      wishlist={wishlist}
    />
  );
}
