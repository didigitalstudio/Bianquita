"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const mainLinks = [
  { l: "Inicio", href: "/" },
  { l: "Recién nacido", href: "/tienda?audience=recien-nacido" },
  { l: "Bebé", href: "/tienda?audience=bebe" },
  { l: "Niño/a", href: "/tienda?audience=nino" },
  { l: "Todos los productos", href: "/tienda" },
  { l: "Ofertas", href: "/tienda?tag=oferta" },
];

const secondaryLinks = [
  { l: "Mi cuenta", href: "/cuenta" },
  { l: "Envíos", href: "/envios" },
  { l: "Preguntas frecuentes", href: "/faq" },
  { l: "Contacto", href: "/contacto" },
  { l: "Admin", href: "/admin" },
];

export default function SideMenu({ open, onClose }: SideMenuProps) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(43, 35, 29, 0.4)", zIndex: 100, animation: "fadeIn .2s" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 380, maxWidth: "90vw", height: "100%", background: "var(--paper)", padding: "32px 32px 24px", display: "flex", flexDirection: "column", animation: "slideRight .3s ease-out" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <Logo size="sm" />
          <button className="btn-icon" onClick={onClose}><Icon name="x" /></button>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {mainLinks.map((it) => (
            <Link key={it.l} href={it.href} onClick={onClose} style={{ textAlign: "left", padding: "14px 0", fontSize: 22, fontFamily: "var(--font-display)", borderBottom: "1px solid var(--line-soft)", display: "block" }}>
              {it.l}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
          {secondaryLinks.map((it) => (
            <Link key={it.l} href={it.href} onClick={onClose} style={{ textAlign: "left", padding: "6px 0", color: "var(--ink-soft)", fontSize: 14, display: "block" }}>
              {it.l} →
            </Link>
          ))}
        </div>
      </div>
      <style>{`@keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
}
