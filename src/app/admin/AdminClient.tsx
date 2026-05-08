"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import ProductImage from "@/components/ui/ProductImage";
import { fmt } from "@/lib/format";
import type { Product, Category, Audience } from "@/lib/types";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  updateOrderStatus,
  signOutAdmin,
} from "./actions";

type AdminView = "dashboard" | "products" | "edit" | "orders" | "stock";

export interface AdminOrder {
  id: string; // uuid
  number: string; // ULB-XXXX
  customer: string;
  email: string;
  date: string;
  status: "pendiente-pago" | "preparando" | "enviado" | "entregado" | "cancelado";
  items: number;
  total: number;
  payment: string;
  shipping: string;
  address: string;
}

interface Props {
  initialProducts: Product[];
  initialOrders: AdminOrder[];
  categories: Category[];
  audiences: Audience[];
}

export default function AdminClient({ initialProducts, initialOrders, categories, audiences }: Props) {
  const router = useRouter();
  const [view, setView] = useState<AdminView>("dashboard");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  return (
    <div className="admin-shell" style={{ background: "#FAF6EE" }}>
      <aside style={{ background: "var(--ink)", color: "var(--paper)", padding: "24px 16px", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "8px 12px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 20 }}>
          <Logo size="sm" inverted />
          <div style={{ fontSize: 11, color: "rgba(245, 239, 230, 0.5)", marginTop: 8, letterSpacing: "0.15em", textTransform: "uppercase" }}>Admin Panel</div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {([["dashboard", "Dashboard", "trend"], ["products", "Productos", "tag"], ["stock", "Stock", "box"], ["orders", "Pedidos", "truck"]] as [AdminView, string, string][]).map(([id, l, ic]) => (
            <button key={id} onClick={() => setView(id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: view === id ? "var(--brand)" : "transparent", color: view === id ? "#fff" : "rgba(245, 239, 230, 0.75)", fontSize: 14, fontWeight: 500, textAlign: "left", transition: "all .15s" }}>
              <Icon name={ic} size={16} />{l}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 12px" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>UK</div>
            <div style={{ fontSize: 13 }}><div>Admin Unilubi</div><div style={{ fontSize: 11, color: "rgba(245, 239, 230, 0.5)" }}>Propietaria</div></div>
          </div>
          <Link href="/" style={{ width: "100%", marginTop: 8, padding: "10px 14px", borderRadius: 10, color: "rgba(245, 239, 230, 0.6)", fontSize: 13, textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="logout" size={14} />Volver a la tienda
          </Link>
          <form action={signOutAdmin}>
            <button type="submit" style={{ width: "100%", marginTop: 4, padding: "10px 14px", borderRadius: 10, color: "rgba(245, 239, 230, 0.6)", fontSize: 13, textAlign: "left", display: "flex", alignItems: "center", gap: 10, background: "transparent" }}>
              <Icon name="x" size={14} />Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <div style={{ padding: "32px 40px", overflow: "auto" }}>
        {view === "dashboard" && <AdminDashboard products={products} orders={orders} setView={setView} />}
        {view === "products" && (
          <AdminProducts
            products={products}
            categories={categories}
            audiences={audiences}
            onRemove={async (id) => {
              if (!confirm("¿Eliminar este producto?")) return;
              try {
                await deleteProduct(id);
                setProducts((ps) => ps.filter((p) => p.id !== id));
                showToast("Producto eliminado");
              } catch (e: unknown) {
                showToast((e as Error).message);
              }
            }}
            onEdit={(id) => { setEditProductId(id); setView("edit"); }}
            onNew={() => { setEditProductId("new"); setView("edit"); }}
          />
        )}
        {view === "edit" && (
          <AdminEditProduct
            products={products}
            categories={categories}
            audiences={audiences}
            productId={editProductId}
            onSaved={(saved, isNew) => {
              setProducts((ps) => isNew ? [saved, ...ps] : ps.map((p) => p.id === saved.id ? saved : p));
              showToast(isNew ? "Producto creado" : "Cambios guardados");
              setView("products");
              router.refresh();
            }}
            onCancel={() => setView("products")}
            showToast={showToast}
          />
        )}
        {view === "orders" && (
          <AdminOrders
            orders={orders}
            onUpdateStatus={async (id, status) => {
              try {
                await updateOrderStatus(id, status);
                setOrders((os) => os.map((o) => o.id === id ? { ...o, status } : o));
                showToast("Pedido actualizado");
              } catch (e: unknown) {
                showToast((e as Error).message);
              }
            }}
          />
        )}
        {view === "stock" && (
          <AdminStock
            products={products}
            onUpdate={async (pid, stock) => {
              try {
                await updateStock(pid, stock);
                setProducts((ps) => ps.map((p) => p.id === pid ? { ...p, stock } : p));
              } catch (e: unknown) {
                showToast((e as Error).message);
              }
            }}
          />
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function AdminDashboard({ products, orders, setView }: { products: Product[]; orders: AdminOrder[]; setView: (v: AdminView) => void }) {
  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => Object.values(p.stock).some((v) => v <= 2 && v > 0)).length;
  const outStock = products.filter((p) => Object.values(p.stock).every((v) => v === 0)).length;
  const pending = orders.filter((o) => o.status === "preparando" || o.status === "pendiente-pago").length;

  const STATUS_COLORS: Record<string, string> = { "pendiente-pago": "badge-warn", preparando: "badge-soft", enviado: "badge-salvia", entregado: "badge-ok", cancelado: "badge-err" };
  const STATUS_LABELS: Record<string, string> = { "pendiente-pago": "Pendiente pago", preparando: "Preparando", enviado: "En camino", entregado: "Entregado", cancelado: "Cancelado" };

  const sparkValues = [12, 18, 15, 22, 28, 24, 32, 30, 38, 35, 42, 48, 45, 52];

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 className="h2" style={{ marginBottom: 4 }}>Hola, Unilubi ✦</h1>
          <p className="muted">Esto es lo que pasó hoy en tu tienda</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select className="select" style={{ width: "auto", background: "#fff" }}><option>Hoy</option><option>Esta semana</option><option>Este mes</option></select>
          <button className="btn btn-primary" onClick={() => setView("edit")}><Icon name="plus" size={14} /> Nuevo producto</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Ventas del mes", value: fmt(totalSales), trend: orders.length === 0 ? "Aún sin ventas" : `${orders.length} pedidos`, icon: "trend", color: "var(--brand)" },
          { label: "Pedidos activos", value: pending, trend: `${pending} por preparar`, icon: "box", color: "var(--salvia-deep)" },
          { label: "Productos activos", value: products.length, trend: `${lowStock} con stock bajo`, icon: "tag", color: "var(--ink)" },
          { label: "Sin stock", value: outStock, trend: outStock > 0 ? "Requiere atención" : "Todo bien", icon: "shield", color: outStock > 0 ? "#a55" : "var(--salvia-deep)" },
        ].map((k) => (
          <div key={k.label} className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <span style={{ fontSize: 12, color: "var(--ink-mute)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{k.label}</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", color: k.color }}><Icon name={k.icon} size={18} /></div>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 8 }}>{k.trend}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, marginBottom: 32 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
            <div><div style={{ fontWeight: 700, marginBottom: 2 }}>Ventas últimos 14 días</div><div style={{ fontSize: 12, color: "var(--ink-mute)" }}>Comparado con período anterior</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontFamily: "var(--font-display)", fontSize: 26 }}>{fmt(totalSales)}</div><div style={{ fontSize: 12, color: "var(--salvia-deep)", fontWeight: 600 }}>—</div></div>
          </div>
          <Sparkline values={sparkValues} />
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 18 }}>Más vendidos</div>
          {products.slice(0, 4).map((p, i) => (
            <div key={p.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: i < 3 ? "1px solid var(--line-soft)" : "none" }}>
              <div style={{ width: 12, color: "var(--ink-mute)", fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
              <div style={{ width: 40, height: 48, borderRadius: 8, overflow: "hidden", background: "var(--cream)", position: "relative" }}><ProductImage src={p.img} alt={p.name} label="img" /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "var(--ink-mute)" }}>—</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{fmt(p.price)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontWeight: 700 }}>Pedidos recientes</div>
          <button className="btn-link" onClick={() => setView("orders")}>Ver todos →</button>
        </div>
        {orders.length === 0 ? (
          <p className="muted" style={{ padding: "32px 0", textAlign: "center", fontSize: 14 }}>Aún no hay pedidos</p>
        ) : (
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead style={{ color: "var(--ink-mute)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <tr><th style={{ textAlign: "left", padding: "10px 0", fontWeight: 600 }}>Pedido</th><th style={{ textAlign: "left", padding: "10px 0", fontWeight: 600 }}>Cliente</th><th style={{ textAlign: "left", padding: "10px 0", fontWeight: 600 }}>Estado</th><th style={{ textAlign: "right", padding: "10px 0", fontWeight: 600 }}>Total</th></tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} style={{ borderTop: "1px solid var(--line-soft)" }}>
                  <td style={{ padding: "12px 0", fontFamily: "var(--font-display)", fontWeight: 600 }}>{o.number}</td>
                  <td style={{ padding: "12px 0" }}>{o.customer}</td>
                  <td style={{ padding: "12px 0" }}><span className={`badge ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</span></td>
                  <td style={{ padding: "12px 0", textAlign: "right", fontWeight: 700 }}>{fmt(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values), min = Math.min(...values);
  const w = 600, h = 140, p = 8;
  const pts = values.map((v, i) => `${p + (i / (values.length - 1)) * (w - 2 * p)},${h - p - ((v - min) / (max - min)) * (h - 2 * p)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 140 }}>
      <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--brand)" stopOpacity="0.25" /><stop offset="100%" stopColor="var(--brand)" stopOpacity="0" /></linearGradient></defs>
      <polygon points={`${p},${h - p} ${pts} ${w - p},${h - p}`} fill="url(#grad)" />
      <polyline points={pts} fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => { const x = p + (i / (values.length - 1)) * (w - 2 * p); const y = h - p - ((v - min) / (max - min)) * (h - 2 * p); return <circle key={i} cx={x} cy={y} r="2.5" fill="#fff" stroke="var(--brand)" strokeWidth="2" />; })}
    </svg>
  );
}

// ── Products ─────────────────────────────────────────────────────────────────

function AdminProducts({ products, categories, audiences, onRemove, onEdit, onNew }: { products: Product[]; categories: Category[]; audiences: Audience[]; onRemove: (id: string) => void; onEdit: (id: string) => void; onNew: () => void }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  const filtered = products.filter((p) => {
    if (filterCat !== "all" && p.category !== filterCat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalStock = (p: Product) => Object.values(p.stock).reduce((s, v) => s + v, 0);

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div><h1 className="h2" style={{ marginBottom: 4 }}>Productos</h1><p className="muted">{products.length} productos en el catálogo</p></div>
        <button className="btn btn-primary" onClick={onNew}><Icon name="plus" size={14} /> Nuevo producto</button>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <input className="input" placeholder="Buscar producto…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <select className="select" value={filterCat} onChange={(e) => setFilterCat(e.target.value)} style={{ width: "auto" }}>
          <option value="all">Todas las categorías</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "80px 2fr 1fr 1fr 1fr 1fr 100px", padding: "14px 20px", background: "var(--cream)", fontSize: 11, color: "var(--ink-mute)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          <span>Imagen</span><span>Producto</span><span>Categoría</span><span>Precio</span><span>Stock</span><span>Estado</span><span style={{ textAlign: "right" }}>Acciones</span>
        </div>
        {filtered.map((p) => {
          const stock = totalStock(p);
          const out = stock === 0, low = stock > 0 && stock < 5;
          return (
            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "80px 2fr 1fr 1fr 1fr 1fr 100px", padding: "14px 20px", borderTop: "1px solid var(--line-soft)", alignItems: "center", fontSize: 14 }}>
              <div style={{ width: 56, height: 64, borderRadius: 8, overflow: "hidden", background: "var(--cream)", position: "relative" }}><ProductImage src={p.img} alt={p.name} label="img" /></div>
              <div><div style={{ fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: 12, color: "var(--ink-mute)" }}>{p.id} · {audiences.find((a) => a.id === p.audience)?.label}</div></div>
              <div style={{ textTransform: "capitalize" }}>{p.category}</div>
              <div><div style={{ fontWeight: 700 }}>{fmt(p.price)}</div>{p.compareAt && <div style={{ fontSize: 11, color: "var(--ink-mute)", textDecoration: "line-through" }}>{fmt(p.compareAt)}</div>}</div>
              <div><div style={{ fontWeight: 600, color: out ? "#a55" : low ? "#b87" : "var(--ink)" }}>{stock} u.</div><div style={{ fontSize: 11, color: "var(--ink-mute)" }}>{Object.keys(p.stock).length} talles</div></div>
              <div><span className={`badge ${out ? "badge-err" : low ? "badge-warn" : "badge-ok"}`}>{out ? "Sin stock" : low ? "Stock bajo" : "Activo"}</span></div>
              <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                <button className="btn-icon" style={{ width: 32, height: 32 }} onClick={() => onEdit(p.id)} aria-label="Editar producto"><Icon name="edit" size={14} /></button>
                <button className="btn-icon" style={{ width: 32, height: 32, color: "#a55" }} onClick={() => onRemove(p.id)} aria-label="Eliminar producto"><Icon name="trash" size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Edit Product ──────────────────────────────────────────────────────────────

function AdminEditProduct({ products, categories, audiences, productId, onSaved, onCancel, showToast }: { products: Product[]; categories: Category[]; audiences: Audience[]; productId: string | null; onSaved: (saved: Product, isNew: boolean) => void; onCancel: () => void; showToast: (m: string) => void }) {
  const isNew = !productId || productId === "new";
  const existing = products.find((p) => p.id === productId);
  const blank: Product = { id: "", name: "", category: categories[0]?.id ?? "bodies", audience: audiences[0]?.id ?? "bebe", price: 0, compareAt: null, stock: {}, colors: [], description: "", materials: "", care: "", tags: [], img: "" };
  const [form, setForm] = useState<Product>(existing ? JSON.parse(JSON.stringify(existing)) : blank);
  const [pending, startTransition] = useTransition();

  const upd = <K extends keyof Product>(k: K, v: Product[K]) => setForm((f) => ({ ...f, [k]: v }));
  const updStock = (size: string, val: string) => setForm((f) => ({ ...f, stock: { ...f.stock, [size]: Math.max(0, +val || 0) } }));
  const addSize = () => { const s = prompt("Nombre del talle (ej: 6, 12-18M)"); if (s) updStock(s, "0"); };
  const removeSize = (s: string) => { const ns = { ...form.stock }; delete ns[s]; upd("stock", ns); };
  const toggleTag = (t: string) => upd("tags", form.tags.includes(t) ? form.tags.filter((x) => x !== t) : [...form.tags, t]);
  const toggleColor = (c: string) => upd("colors", form.colors.includes(c) ? form.colors.filter((x) => x !== c) : [...form.colors, c]);

  const save = () => {
    if (!form.name) { showToast("Falta el nombre"); return; }
    if (form.price <= 0) { showToast("El precio debe ser mayor a 0"); return; }
    startTransition(async () => {
      try {
        if (isNew) {
          const { id } = await createProduct(form);
          onSaved({ ...form, id }, true);
        } else {
          await updateProduct(productId!, form);
          onSaved(form, false);
        }
      } catch (e: unknown) {
        showToast((e as Error).message);
      }
    });
  };

  const ALL_COLORS = ["crema", "salvia", "terracota", "rosa-viejo", "beige", "celeste-suave"];
  const COLOR_HEX: Record<string, string> = { crema: "#F5EFE6", salvia: "#9CA888", terracota: "#B5663D", "rosa-viejo": "#D9B3A2", beige: "#D6C5AE", "celeste-suave": "#C5D4DA" };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <button className="btn-link" onClick={onCancel} style={{ fontSize: 13, marginBottom: 8 }}>← Volver a productos</button>
          <h1 className="h2">{isNew ? "Nuevo producto" : form.name}</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={onCancel} disabled={pending}>Cancelar</button>
          <button className="btn btn-primary" onClick={save} disabled={pending}>
            {pending ? "Guardando…" : isNew ? "Crear producto" : "Guardar cambios"}
          </button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="h3" style={{ marginBottom: 18 }}>Información general</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="field"><label>Nombre del producto</label><input className="input" value={form.name} onChange={(e) => upd("name", e.target.value)} placeholder="Ej: Body manga larga rayado" /></div>
              <div className="field"><label>Descripción</label><textarea className="textarea" value={form.description} onChange={(e) => upd("description", e.target.value)} placeholder="Describí el producto…" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="field"><label>Categoría</label><select className="select" value={form.category} onChange={(e) => upd("category", e.target.value)}>{categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
                <div className="field"><label>Edad</label><select className="select" value={form.audience} onChange={(e) => upd("audience", e.target.value)}>{audiences.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}</select></div>
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <div className="h3" style={{ marginBottom: 18 }}>Precio</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field"><label>Precio de venta</label><input className="input" type="number" min={0} value={form.price} onChange={(e) => upd("price", +e.target.value)} /></div>
              <div className="field"><label>Precio anterior (oferta)</label><input className="input" type="number" min={0} value={form.compareAt || ""} onChange={(e) => upd("compareAt", e.target.value ? +e.target.value : null)} placeholder="Opcional" /></div>
            </div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div className="h3">Talles y stock</div>
              <button className="btn btn-ghost btn-sm" onClick={addSize}><Icon name="plus" size={14} /> Agregar talle</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {Object.entries(form.stock).map(([s, v]) => (
                <div key={s} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 6, padding: 12, border: "1px solid var(--line)", borderRadius: 12, background: "#fff" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>Talle {s}</div>
                    <input type="number" value={v} onChange={(e) => updStock(s, e.target.value)} style={{ width: "100%", border: "none", fontSize: 18, fontWeight: 700, color: v === 0 ? "#a55" : "var(--ink)", padding: 0 }} />
                  </div>
                  <button onClick={() => removeSize(s)} aria-label={`Eliminar talle ${s}`} style={{ color: "var(--ink-mute)", padding: 4, alignSelf: "flex-start" }}><Icon name="x" size={14} /></button>
                </div>
              ))}
              {Object.keys(form.stock).length === 0 && <div className="muted" style={{ gridColumn: "span 3", padding: 20, textAlign: "center", fontSize: 13 }}>Agregá al menos un talle</div>}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="h3" style={{ marginBottom: 18 }}>Imagen del producto</div>
            <div style={{ aspectRatio: "1/1", borderRadius: 14, overflow: "hidden", background: "var(--cream)", marginBottom: 12, position: "relative" }}>
              <ProductImage src={form.img} alt="" label="vista" />
            </div>
            <div className="field"><label>URL de imagen</label><input className="input" value={form.img} onChange={(e) => upd("img", e.target.value)} placeholder="https://…" /></div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <div className="h3" style={{ marginBottom: 14 }}>Colores disponibles</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ALL_COLORS.map((c) => (
                <button key={c} onClick={() => toggleColor(c)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: form.colors.includes(c) ? "2px solid var(--brand)" : "1px solid var(--line)", borderRadius: 999, background: "#fff", fontSize: 13, textTransform: "capitalize" }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", background: COLOR_HEX[c], border: "1px solid rgba(0,0,0,0.05)" }} />{c.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <div className="h3" style={{ marginBottom: 14 }}>Etiquetas</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {([["nuevo", "Nuevo"], ["best-seller", "Más vendido"], ["oferta", "En oferta"], ["regalo", "Para regalar"]] as [string, string][]).map(([id, l]) => (
                <button key={id} onClick={() => toggleTag(id)} className={`badge ${form.tags.includes(id) ? "badge-brand" : "badge-cream"}`} style={{ cursor: "pointer", padding: "8px 14px" }}>
                  {form.tags.includes(id) && "✓ "}{l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stock ─────────────────────────────────────────────────────────────────────

function AdminStock({ products, onUpdate }: { products: Product[]; onUpdate: (pid: string, stock: Record<string, number>) => void }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const list = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    const total = Object.values(p.stock).reduce((s, v) => s + v, 0);
    if (filter === "low" && (total >= 5 || total === 0)) return false;
    if (filter === "out" && total > 0) return false;
    return true;
  });

  const setStockValue = (pid: string, size: string, val: string) => {
    const p = products.find((x) => x.id === pid)!;
    const next = { ...p.stock, [size]: Math.max(0, +val || 0) };
    onUpdate(pid, next);
  };
  const adjustStock = (pid: string, size: string, delta: number) => {
    const p = products.find((x) => x.id === pid)!;
    setStockValue(pid, size, String((p.stock[size] || 0) + delta));
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div><h1 className="h2" style={{ marginBottom: 4 }}>Stock</h1><p className="muted">Controlá las unidades de cada talle. Los cambios se aplican en vivo.</p></div>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input className="input" placeholder="Buscar producto…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 360 }} />
        <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 999, padding: 3, background: "#fff" }}>
          {([["all", "Todos"], ["low", "Stock bajo"], ["out", "Sin stock"]] as [string, string][]).map(([id, l]) => (
            <button key={id} onClick={() => setFilter(id)} style={{ padding: "8px 16px", borderRadius: 999, background: filter === id ? "var(--ink)" : "transparent", color: filter === id ? "#fff" : "inherit", fontSize: 13, fontWeight: 600 }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {list.map((p) => {
          const total = Object.values(p.stock).reduce((s, v) => s + v, 0);
          return (
            <div key={p.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center", marginBottom: 14 }}>
                <div style={{ width: 56, height: 64, borderRadius: 8, overflow: "hidden", background: "var(--cream)", position: "relative" }}><ProductImage src={p.img} alt={p.name} label="img" /></div>
                <div><div style={{ fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: 12, color: "var(--ink-mute)" }}>{p.id} · {fmt(p.price)}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: total === 0 ? "#a55" : total < 5 ? "#b87" : "var(--ink)" }}>{total}</div><div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Total</div></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
                {Object.entries(p.stock).map(([s, v]) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: v === 0 ? "rgba(170,80,80,0.08)" : "var(--cream)", borderRadius: 10 }}>
                    <div style={{ flex: 1, fontSize: 12 }}><div style={{ color: "var(--ink-mute)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600, fontSize: 10 }}>Talle {s}</div></div>
                    <button onClick={() => adjustStock(p.id, s, -1)} aria-label="Disminuir" style={{ width: 26, height: 26, borderRadius: 6, background: "#fff", border: "1px solid var(--line)" }}><Icon name="minus" size={12} /></button>
                    <input type="number" value={v} onChange={(e) => setStockValue(p.id, s, e.target.value)} style={{ width: 36, textAlign: "center", border: "none", background: "transparent", fontWeight: 700, fontSize: 14, color: v === 0 ? "#a55" : "var(--ink)" }} />
                    <button onClick={() => adjustStock(p.id, s, 1)} aria-label="Aumentar" style={{ width: 26, height: 26, borderRadius: 6, background: "#fff", border: "1px solid var(--line)" }}><Icon name="plus" size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Orders ────────────────────────────────────────────────────────────────────

function AdminOrders({ orders, onUpdateStatus }: { orders: AdminOrder[]; onUpdateStatus: (id: string, status: AdminOrder["status"]) => void }) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const STATUS: Record<string, { label: string; cls: string }> = {
    "pendiente-pago": { label: "Pendiente pago", cls: "badge-warn" },
    preparando: { label: "Preparando", cls: "badge-soft" },
    enviado: { label: "En camino", cls: "badge-salvia" },
    entregado: { label: "Entregado", cls: "badge-ok" },
    cancelado: { label: "Cancelado", cls: "badge-err" },
  };

  const list = orders.filter((o) => filter === "all" || o.status === filter);

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div><h1 className="h2" style={{ marginBottom: 4 }}>Pedidos</h1><p className="muted">{orders.length} pedidos · {orders.filter((o) => o.status === "preparando").length} esperando despacho</p></div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setFilter("all")} className={`badge ${filter === "all" ? "badge-brand" : "badge-cream"}`} style={{ padding: "8px 14px", cursor: "pointer" }}>Todos ({orders.length})</button>
        {Object.entries(STATUS).map(([id, s]) => {
          const count = orders.filter((o) => o.status === id).length;
          return <button key={id} onClick={() => setFilter(id)} className={`badge ${filter === id ? "badge-brand" : "badge-cream"}`} style={{ padding: "8px 14px", cursor: "pointer" }}>{s.label} ({count})</button>;
        })}
      </div>
      {orders.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <p className="muted">Aún no recibiste pedidos.</p>
        </div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr 1fr 1fr", padding: "14px 20px", background: "var(--cream)", fontSize: 11, color: "var(--ink-mute)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            <span>Pedido</span><span>Cliente</span><span>Fecha</span><span>Items</span><span>Total</span><span>Estado</span><span style={{ textAlign: "right" }}>Acciones</span>
          </div>
          {list.map((o) => (
            <div key={o.id} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr 1fr 1fr", padding: "14px 20px", borderTop: "1px solid var(--line-soft)", alignItems: "center", fontSize: 14 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{o.number}</span>
              <div><div style={{ fontWeight: 600 }}>{o.customer}</div><div style={{ fontSize: 12, color: "var(--ink-mute)" }}>{o.email}</div></div>
              <span style={{ color: "var(--ink-soft)" }}>{new Date(o.date).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}</span>
              <span>{o.items} prendas</span>
              <span style={{ fontWeight: 700 }}>{fmt(o.total)}</span>
              <span><span className={`badge ${STATUS[o.status].cls}`}>{STATUS[o.status].label}</span></span>
              <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                <button className="btn-icon" style={{ width: 32, height: 32 }} onClick={() => setSelected(o)} aria-label="Ver pedido"><Icon name="eye" size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(43,35,29,0.45)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: 24, animation: "fadeIn .2s" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--paper)", borderRadius: 22, width: 640, maxHeight: "90vh", overflowY: "auto", animation: "slideUp .3s" }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid var(--line-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 12, color: "var(--ink-mute)" }}>Pedido</div><div className="h3">{selected.number}</div></div>
              <button className="btn-icon" onClick={() => setSelected(null)} aria-label="Cerrar"><Icon name="x" /></button>
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 12, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>Estado</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {Object.entries(STATUS).map(([id, s]) => (
                    <button key={id} onClick={() => { onUpdateStatus(selected.id, id as AdminOrder["status"]); setSelected({ ...selected, status: id as AdminOrder["status"] }); }} style={{ padding: "8px 14px", borderRadius: 999, border: selected.status === id ? "2px solid var(--brand)" : "1px solid var(--line)", background: selected.status === id ? "var(--brand-soft)" : "#fff", fontSize: 13, fontWeight: 600 }}>
                      {selected.status === id && "✓ "}{s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 22 }}>
                <div><div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Cliente</div><strong>{selected.customer}</strong><br /><span className="muted" style={{ fontSize: 13 }}>{selected.email}</span></div>
                <div><div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Pago</div><strong>{selected.payment}</strong></div>
                <div style={{ gridColumn: "span 2" }}><div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Envío</div><strong>{selected.shipping}</strong><br /><span className="muted" style={{ fontSize: 13 }}>{selected.address}</span></div>
              </div>
              <div className="card-soft" style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>Total del pedido</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--brand)" }}>{fmt(selected.total)}</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }}><Icon name="mail" size={14} /> Email cliente</button>
                <button className="btn btn-primary" style={{ flex: 1 }}><Icon name="truck" size={14} /> Generar etiqueta</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
