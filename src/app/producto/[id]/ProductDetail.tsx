"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import ProductCard from "@/components/shop/ProductCard";
import SizeGuideModal from "@/components/shop/SizeGuideModal";
import { fmt } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product, Audience } from "@/lib/types";

const COLOR_HEX: Record<string, string> = {
  crema: "#FDF4EC", salvia: "#B8D4B8", terracota: "#C9A38A",
  "rosa-viejo": "#E8B4BC", beige: "#E8D4B8", "celeste-suave": "#C8DCE2", "crema-mix": "#FAE0E4",
};

interface Props {
  product: Product;
  audiences: Audience[];
  related: Product[];
  ratingAverage: number;
  ratingCount: number;
}

export default function ProductDetail({ product, audiences, related, ratingAverage, ratingCount }: Props) {
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();
  const { isInWishlist, toggle } = useWishlist();
  const router = useRouter();

  const sizes = Object.keys(product.stock);
  const [size, setSize] = useState(sizes.find((s) => product.stock[s] > 0) || sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const inStock = (product.stock[size] ?? 0) > 0;

  // Gallery: main image + extras from product.images. Dedupe in case the
  // main image is also in the array. If there's only one image total, hide
  // the thumbnail row entirely instead of showing a single dead thumb.
  const gallery = [product.img, ...(product.images ?? []).filter((u) => u !== product.img)];
  const [activeImage, setActiveImage] = useState(0);

  const onAdd = () => {
    addToCart({ ...product, size, color, qty });
    showToast(`${product.name} agregado al carrito`);
    openCart();
  };

  const onWishlist = async () => {
    const res = await toggle(product.id);
    if (res === null) {
      showToast("Iniciá sesión para guardar favoritos");
      router.push("/cuenta/login");
      return;
    }
    showToast(res.added ? "Agregado a favoritos ❤" : "Quitado de favoritos");
  };
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="fade-in">
      <section style={{ padding: "32px 0" }}>
        <div className="container-wide" style={{ fontSize: 12, color: "var(--ink-mute)" }}>
          <Link href="/">Inicio</Link> / <Link href="/tienda">Tienda</Link> / <span style={{ color: "var(--ink)" }}>{product.name}</span>
        </div>
      </section>

      <section style={{ padding: "0 0 64px" }}>
        <div className="container-wide producto-grid">
          <div>
            <div style={{ aspectRatio: "4/5", background: "var(--cream)", borderRadius: 22, overflow: "hidden", marginBottom: 12, position: "relative" }}>
              <Image src={gallery[activeImage]} alt={product.name} fill style={{ objectFit: "cover" }} sizes="50vw" priority />
            </div>
            {gallery.length > 1 && (
              <div className="producto-thumbs">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Ver foto ${i + 1} de ${gallery.length}`}
                    aria-current={i === activeImage}
                    style={{ aspectRatio: "1/1", background: "var(--cream)", borderRadius: 14, overflow: "hidden", border: i === activeImage ? "2px solid var(--brand)" : "1px solid var(--line)", cursor: "pointer", position: "relative", padding: 0 }}
                  >
                    <Image src={src} alt="" fill style={{ objectFit: "cover" }} sizes="12vw" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {product.tags.includes("nuevo") && <span className="badge badge-brand">Nuevo</span>}
              {product.compareAt && <span className="badge badge-salvia">Oferta</span>}
              <span className="badge badge-cream">{audiences.find((a) => a.id === product.audience)?.label}</span>
            </div>
            <h1 className="h2" style={{ marginBottom: 8 }}>{product.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 2, color: "var(--brand)" }}>
                {[1, 2, 3, 4, 5].map((i) => <Icon key={i} name="star" size={14} />)}
              </div>
              <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                {ratingCount === 0 ? "Aún sin reseñas" : `${ratingAverage.toFixed(1)} · ${ratingCount} ${ratingCount === 1 ? "reseña" : "reseñas"}`}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--brand)" }}>{fmt(product.price)}</span>
              {product.compareAt && <span style={{ fontSize: 18, color: "var(--ink-mute)", textDecoration: "line-through" }}>{fmt(product.compareAt)}</span>}
            </div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 28 }}>O 3 cuotas sin interés de {fmt(Math.round(product.price / 3))}</p>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Color: <span style={{ color: "var(--ink-soft)", fontWeight: 400, textTransform: "capitalize" }}>{color.replace("-", " ")}</span></div>
              <div style={{ display: "flex", gap: 10 }}>
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)} aria-label={`Color ${c.replace("-", " ")}`} style={{ width: 36, height: 36, borderRadius: "50%", border: color === c ? "2px solid var(--ink)" : "1px solid var(--line)", padding: 3 }}>
                    <span style={{ display: "block", width: "100%", height: "100%", borderRadius: "50%", background: COLOR_HEX[c] || "#ccc", border: "1px solid rgba(0,0,0,0.05)" }} />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Talle: <span style={{ color: "var(--ink-soft)", fontWeight: 400 }}>{size}</span></span>
                <button type="button" onClick={() => setSizeGuideOpen(true)} className="btn-link" style={{ fontSize: 12 }}>Guía de talles</button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {sizes.map((s) => {
                  const out = product.stock[s] === 0;
                  return (
                    <button key={s} disabled={out} onClick={() => setSize(s)} style={{ padding: "10px 18px", border: size === s ? "2px solid var(--ink)" : "1px solid var(--line)", borderRadius: 10, background: "#fff", fontWeight: 600, fontSize: 13, opacity: out ? 0.4 : 1, textDecoration: out ? "line-through" : "none", cursor: out ? "not-allowed" : "pointer" }}>{s}</button>
                  );
                })}
              </div>
              {inStock && product.stock[size] <= 3 && <p style={{ fontSize: 12, color: "var(--brand)", marginTop: 10 }}>⚡ Quedan solo {product.stock[size]} unidades</p>}
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)", borderRadius: 999, background: "#fff" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Disminuir cantidad" style={{ padding: "12px 16px" }}><Icon name="minus" size={14} /></button>
                <span style={{ minWidth: 30, textAlign: "center", fontWeight: 600 }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} aria-label="Aumentar cantidad" style={{ padding: "12px 16px" }}><Icon name="plus" size={14} /></button>
              </div>
              <button className="btn btn-primary btn-lg" disabled={!inStock} onClick={onAdd} style={{ flex: 1 }}>
                {inStock ? <>Agregar al carrito · {fmt(product.price * qty)}</> : "Sin stock en este talle"}
              </button>
              <button onClick={onWishlist} className="btn btn-ghost btn-lg" aria-label={inWishlist ? "Quitar de favoritos" : "Agregar a favoritos"} style={{ width: 52, height: 52, color: inWishlist ? "var(--brand)" : "inherit" }}><Icon name="heart" /></button>
            </div>
            {inStock ? (
              <Link href="/checkout" className="btn btn-dark btn-lg" onClick={onAdd} style={{ width: "100%", marginBottom: 28, display: "flex", justifyContent: "center" }}>
                Comprar ahora →
              </Link>
            ) : (
              <button className="btn btn-dark btn-lg" disabled style={{ width: "100%", marginBottom: 28, opacity: 0.5, cursor: "not-allowed" }}>
                Sin stock en este talle
              </button>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="card-soft" style={{ padding: 14, display: "flex", gap: 10, alignItems: "center" }}>
                <Icon name="truck" size={20} />
                <div style={{ fontSize: 12 }}><strong>Envío gratis</strong><br /><span className="muted">desde $35.000</span></div>
              </div>
              <div className="card-soft" style={{ padding: 14, display: "flex", gap: 10, alignItems: "center" }}>
                <Icon name="shield" size={20} />
                <div style={{ fontSize: 12 }}><strong>Cambios gratis</strong><br /><span className="muted">15 días</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <div style={{ display: "flex", gap: 32, borderBottom: "1px solid var(--line)", marginBottom: 24 }}>
            {([["desc", "Descripción"], ["mat", "Materiales y cuidado"], ["env", "Envíos"]] as [string, string][]).map(([id, l]) => (
              <button key={id} onClick={() => setTab(id)} style={{ padding: "16px 0", fontSize: 14, fontWeight: 600, borderBottom: tab === id ? "2px solid var(--brand)" : "2px solid transparent", color: tab === id ? "var(--brand)" : "var(--ink-soft)", marginBottom: -1 }}>{l}</button>
            ))}
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ink-soft)" }}>
            {tab === "desc" && <p>{product.description}</p>}
            {tab === "mat" && (<><p><strong>Composición:</strong> {product.materials}</p><p><strong>Cuidado:</strong> {product.care}</p></>)}
            {tab === "env" && <p>Despachamos dentro de las 48 hs hábiles. Envíos a todo el país por Andreani o Correo Argentino. Cadetería local en CABA y GBA.</p>}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 80px" }}>
        <div className="container-wide">
          <h2 className="h2" style={{ marginBottom: 24 }}>Te puede gustar</h2>
          <div className="product-grid-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} audience={product.audience} />
    </div>
  );
}
