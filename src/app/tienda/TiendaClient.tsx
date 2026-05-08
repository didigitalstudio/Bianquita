"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Icon from "@/components/ui/Icon";
import ProductCard from "@/components/shop/ProductCard";
import ProductImage from "@/components/ui/ProductImage";
import EmptyState from "@/components/ui/EmptyState";
import { fmt } from "@/lib/format";
import type { Product, Category, Audience } from "@/lib/types";

interface Props {
  products: Product[];
  categories: Category[];
  audiences: Audience[];
}

export default function TiendaClient({ products, categories, audiences }: Props) {
  const searchParams = useSearchParams();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("recommended");
  const [filterCat, setFilterCat] = useState<string | null>(null);
  const [filterAud, setFilterAud] = useState<string | null>(searchParams.get("audience"));
  const [filterTag, setFilterTag] = useState<string | null>(searchParams.get("tag"));
  const [priceMax, setPriceMax] = useState(35000);
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    setFilterAud(searchParams.get("audience"));
    setFilterTag(searchParams.get("tag"));
  }, [searchParams]);

  const filtered = useMemo(() => {
    let r = products.filter((p) => {
      if (filterCat && p.category !== filterCat) return false;
      if (filterAud && p.audience !== filterAud) return false;
      if (filterTag && !p.tags.includes(filterTag)) return false;
      if (p.price > priceMax) return false;
      return true;
    });
    if (sort === "low") r = r.slice().sort((a, b) => a.price - b.price);
    else if (sort === "high") r = r.slice().sort((a, b) => b.price - a.price);
    else if (sort === "new") r = r.slice().sort((a, b) => (b.tags.includes("nuevo") ? 1 : 0) - (a.tags.includes("nuevo") ? 1 : 0));
    return r;
  }, [products, filterCat, filterAud, filterTag, priceMax, sort]);

  const audLabel = audiences.find((a) => a.id === filterAud)?.label;
  const title = filterTag === "oferta" ? "Ofertas" : filterTag === "nuevo" ? "Lo nuevo" : filterTag === "regalo" ? "Para regalar" : audLabel || "Toda la colección";

  return (
    <div className="fade-in">
      <section style={{ padding: "48px 0 32px", background: "var(--cream)" }}>
        <div className="container-wide">
          <div style={{ fontSize: 12, color: "var(--ink-mute)", marginBottom: 12, display: "flex", gap: 6, alignItems: "center" }}>
            <Link href="/">Inicio</Link> <span>/</span> <span>Tienda</span>
            {filterAud && <><span>/</span> <span>{audLabel}</span></>}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 className="h1" style={{ fontSize: "clamp(36px, 5vw, 60px)", marginBottom: 8 }}>{title}</h1>
              <p className="muted" style={{ fontSize: 15 }}>{filtered.length} productos · prendas suaves para vestir momentos cotidianos</p>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: "auto", padding: "10px 14px", background: "rgba(255,255,255,0.7)" }}>
                <option value="recommended">Recomendados</option>
                <option value="new">Nuevos primero</option>
                <option value="low">Precio: menor a mayor</option>
                <option value="high">Precio: mayor a menor</option>
              </select>
              <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 999, padding: 3, background: "#fff" }}>
                <button onClick={() => setView("grid")} style={{ padding: "6px 10px", borderRadius: 999, background: view === "grid" ? "var(--ink)" : "transparent", color: view === "grid" ? "#fff" : "inherit" }}><Icon name="grid" size={14} /></button>
                <button onClick={() => setView("list")} style={{ padding: "6px 10px", borderRadius: 999, background: view === "list" ? "var(--ink)" : "transparent", color: view === "list" ? "#fff" : "inherit" }}><Icon name="list" size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "32px 0 80px" }}>
        <div className="container-wide tienda-grid">
          <button
            type="button"
            className="btn btn-ghost tienda-filters-toggle"
            onClick={() => setMobileFilters((v) => !v)}
            aria-expanded={mobileFilters}
          >
            <Icon name="filter" size={14} /> {mobileFilters ? "Ocultar filtros" : "Filtros"}
          </button>
          <aside data-open={mobileFilters} className="tienda-aside" style={{ position: "sticky", top: 100, alignSelf: "start", maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
            <FilterBlock title="Edad">
              {audiences.map((a) => (
                <FilterRow key={a.id} active={filterAud === a.id} onClick={() => setFilterAud(filterAud === a.id ? null : a.id)}>
                  <span>{a.label}</span><span className="muted" style={{ fontSize: 12 }}>{a.range}</span>
                </FilterRow>
              ))}
            </FilterBlock>
            <FilterBlock title="Categoría">
              {categories.map((c) => {
                const count = products.filter((p) => p.category === c.id).length;
                return (
                  <FilterRow key={c.id} active={filterCat === c.id} onClick={() => setFilterCat(filterCat === c.id ? null : c.id)}>
                    <span>{c.label}</span><span className="muted" style={{ fontSize: 12 }}>{count}</span>
                  </FilterRow>
                );
              })}
            </FilterBlock>
            <FilterBlock title="Precio">
              <div style={{ padding: "8px 0" }}>
                <input type="range" min="5000" max="35000" step="1000" value={priceMax} onChange={(e) => setPriceMax(+e.target.value)} style={{ width: "100%", accentColor: "var(--brand)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--ink-soft)" }}>
                  <span>$5.000</span><span style={{ fontWeight: 700, color: "var(--brand)" }}>{fmt(priceMax)}</span>
                </div>
              </div>
            </FilterBlock>
            <FilterBlock title="Tags">
              {([["nuevo", "Nuevo"], ["best-seller", "Más vendido"], ["oferta", "En oferta"], ["regalo", "Para regalar"]] as [string, string][]).map(([id, l]) => (
                <FilterRow key={id} active={filterTag === id} onClick={() => setFilterTag(filterTag === id ? null : id)}>
                  <span>{l}</span>
                </FilterRow>
              ))}
            </FilterBlock>
            {(filterCat || filterAud || filterTag) && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setFilterCat(null); setFilterAud(null); setFilterTag(null); }} style={{ width: "100%", marginTop: 16 }}>Limpiar filtros</button>
            )}
          </aside>

          <div>
            {filtered.length === 0 ? (
              <EmptyState icon="search" title="No encontramos prendas" body="Probá ajustando los filtros." cta={
                <button className="btn btn-ghost" onClick={() => { setFilterCat(null); setFilterAud(null); setFilterTag(null); }}>Limpiar filtros</button>
              } />
            ) : view === "grid" ? (
              <div className="product-grid-3">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filtered.map((p) => <ProductRow key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: "var(--ink-soft)", marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{children}</div>
    </div>
  );
}

function FilterRow({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 10, background: active ? "var(--brand-soft)" : "transparent", color: active ? "var(--brand-deep)" : "var(--ink)", fontWeight: active ? 600 : 500, fontSize: 14, textAlign: "left" }}>
      {children}
    </button>
  );
}

function ProductRow({ product }: { product: Product }) {
  return (
    <Link href={`/producto/${product.id}`} style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 20, padding: 16, background: "#fff", border: "1px solid var(--line)", borderRadius: 16, alignItems: "center" }}>
      <div style={{ aspectRatio: "1/1", borderRadius: 10, overflow: "hidden", background: "var(--cream)", position: "relative" }}>
        <ProductImage src={product.img} alt={product.name} label={product.category} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{product.category}</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 20, marginTop: 2, marginBottom: 4 }}>{product.name}</div>
        <p className="muted" style={{ fontSize: 13, margin: 0 }}>{product.description.slice(0, 90)}…</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{fmt(product.price)}</div>
        {product.compareAt && <div style={{ fontSize: 12, color: "var(--ink-mute)", textDecoration: "line-through" }}>{fmt(product.compareAt)}</div>}
        <span className="btn btn-ghost btn-sm" style={{ marginTop: 8, display: "inline-flex" }}>Ver →</span>
      </div>
    </Link>
  );
}
