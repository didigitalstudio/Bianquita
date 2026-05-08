"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ProductImage from "@/components/ui/ProductImage";
import { useCart } from "@/context/CartContext";
import { fmt } from "@/lib/format";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  bg?: string;
}

export default function ProductCard({ product, bg }: ProductCardProps) {
  const { addToCart } = useCart();
  const [hovering, setHovering] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const onSale = !!product.compareAt;
  const sizes = Object.keys(product.stock || {}).filter((s) => product.stock[s] > 0);
  const transferPrice = Math.round(product.price * 0.8);
  const cuotaPrice = Math.round(product.price / 6);

  const quickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id: product.id, name: product.name, price: product.price, img: product.img, size, color: product.colors[0] });
    setShowSizes(false);
  };

  return (
    <Link
      href={`/producto/${product.id}`}
      className="product-card"
      style={bg ? { background: bg } : {}}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); setShowSizes(false); }}
    >
      <div className="img-wrap" style={{ position: "relative" }}>
        <ProductImage src={product.img} alt={product.name} label={product.category} />
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
          {product.tags.includes("nuevo") && <span className="badge badge-brand">Nuevo</span>}
          {onSale && <span className="badge badge-salvia">Oferta</span>}
        </div>
        <button
          onClick={(e) => e.preventDefault()}
          style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Icon name="heart" size={16} />
        </button>

        {hovering && sizes.length > 0 && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 10, background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.05))", animation: "fadeIn .2s" }}>
            {!showSizes ? (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowSizes(true); }}
                style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.96)", backdropFilter: "blur(8px)", borderRadius: 10, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--ink)" }}
              >
                <Icon name="plus" size={14} /> Compra rápida
              </button>
            ) : (
              <div style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(8px)", borderRadius: 10, padding: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-mute)", marginBottom: 8, textTransform: "uppercase" }}>Elegí talle</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {sizes.map((s) => (
                    <button key={s} onClick={(e) => quickAdd(e, s)} style={{ flex: "1 1 auto", minWidth: 36, padding: "6px 8px", border: "1px solid var(--line)", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "#fff" }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="body">
        <div style={{ fontSize: 11, color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{product.category}</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 8, lineHeight: 1.2 }}>{product.name}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>{fmt(product.price)}</span>
          {onSale && <span style={{ fontSize: 13, color: "var(--ink-mute)", textDecoration: "line-through" }}>{fmt(product.compareAt!)}</span>}
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.5 }}>
          <div><b style={{ color: "var(--brand-deep)" }}>{fmt(transferPrice)}</b> con transferencia</div>
          <div style={{ color: "var(--ink-mute)" }}>ó 6 x {fmt(cuotaPrice)} sin interés</div>
        </div>
      </div>
    </Link>
  );
}
