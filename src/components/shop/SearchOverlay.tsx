"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ProductImage from "@/components/ui/ProductImage";
import { PRODUCTS, fmt } from "@/lib/data";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [q, setQ] = useState("");
  if (!open) return null;

  const results = q ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.includes(q.toLowerCase())).slice(0, 6) : [];
  const trending = PRODUCTS.filter((p) => p.tags.includes("best-seller")).slice(0, 4);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(43,35,29,0.55)", zIndex: 100, animation: "fadeIn .2s", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: 80 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--paper)", borderRadius: 22, width: 720, maxWidth: "90vw", padding: 28, animation: "slideUp .3s ease-out" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
          <Icon name="search" size={20} />
          <input autoFocus className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="¿Qué estás buscando?" style={{ border: "none", padding: 0, fontSize: 18, background: "transparent", flex: 1 }} />
          <button className="btn-icon" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div style={{ paddingTop: 20 }}>
          {q ? (
            results.length === 0 ? <p className="muted" style={{ padding: 20, textAlign: "center" }}>Sin resultados para &quot;{q}&quot;</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {results.map((p) => (
                  <Link key={p.id} href={`/producto/${p.id}`} onClick={onClose} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, padding: 10, borderRadius: 12, textAlign: "left" }}>
                    <div style={{ width: 48, height: 56, borderRadius: 8, overflow: "hidden", background: "var(--cream)", position: "relative" }}><ProductImage src={p.img} alt="" label="img" /></div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-mute)", textTransform: "capitalize" }}>{p.category}</div>
                    </div>
                    <div style={{ fontWeight: 700, alignSelf: "center" }}>{fmt(p.price)}</div>
                  </Link>
                ))}
              </div>
            )
          ) : (
            <>
              <div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Más buscados</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {["Bodies", "Recién nacido", "Conjuntos", "Pijamas", "Vestidos"].map((s) => (
                  <button key={s} onClick={() => setQ(s.toLowerCase())} className="badge badge-cream" style={{ padding: "8px 14px", cursor: "pointer", fontSize: 13, textTransform: "none", letterSpacing: 0 }}>{s}</button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Trending</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {trending.map((p) => (
                  <Link key={p.id} href={`/producto/${p.id}`} onClick={onClose} style={{ textAlign: "left" }}>
                    <div style={{ aspectRatio: "1/1", borderRadius: 12, overflow: "hidden", background: "var(--cream)", marginBottom: 8, position: "relative" }}><ProductImage src={p.img} alt="" label="img" /></div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--brand)" }}>{fmt(p.price)}</div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
