"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/shop/CartDrawer";
import SideMenu from "./SideMenu";
import SearchOverlay from "@/components/shop/SearchOverlay";

export default function Navbar() {
  const { cart, cartOpen, openCart, closeCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const navActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(251, 248, 242, 0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--line-soft)" }}>
        <div style={{ background: "var(--ink)", color: "var(--paper)", padding: "8px 0", fontSize: 12, textAlign: "center", letterSpacing: "0.04em" }}>
          <span style={{ opacity: 0.85 }}>✦ Envío gratis a todo el país en compras superiores a $35.000 ✦</span>
        </div>
        <div className="container-wide" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, flex: 1 }}>
            <button className="btn-icon" onClick={() => setMenuOpen(true)} aria-label="Menú" style={{ marginLeft: -8 }}>
              <Icon name="menu" size={22} />
            </button>
            <nav style={{ display: "flex", gap: 22, fontSize: 14, fontWeight: 500 }}>
              <Link href="/tienda?audience=recien-nacido" style={{ color: navActive("/tienda") && pathname.includes("recien-nacido") ? "var(--brand)" : "inherit" }}>Recién nacido</Link>
              <Link href="/tienda?audience=bebe" style={{ color: navActive("/tienda") && pathname.includes("bebe") ? "var(--brand)" : "inherit" }}>Bebé</Link>
              <Link href="/tienda?audience=nino" style={{ color: navActive("/tienda") && pathname.includes("nino") ? "var(--brand)" : "inherit" }}>Niño/a</Link>
              <Link href="/tienda?tag=oferta" style={{ color: "var(--brand)" }}>Ofertas</Link>
            </nav>
          </div>
          <Link href="/" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <Logo />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", flex: 1 }}>
            <button className="btn-icon" onClick={() => setSearchOpen(true)} aria-label="Buscar"><Icon name="search" size={20} /></button>
            <Link className="btn-icon" href="/cuenta" aria-label="Cuenta" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%" }}><Icon name="user" size={20} /></Link>
            <button className="btn-icon" onClick={openCart} aria-label="Carrito" style={{ position: "relative" }}>
              <Icon name="bag" size={20} />
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: 4, right: 4, background: "var(--brand)", color: "#fff", fontSize: 10, fontWeight: 700, minWidth: 16, height: 16, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={closeCart} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
