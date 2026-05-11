"use client";

import { useId, useState, useTransition } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import EmptyState from "@/components/ui/EmptyState";
import ProductCard from "@/components/shop/ProductCard";
import { fmt } from "@/lib/format";
import type { Product } from "@/lib/types";
import type { Address } from "@/lib/data/profile";
import { addMyAddress, removeMyAddress, signOut, updateMyProfile } from "./actions";

export interface ClientOrder {
  id: string;
  number: string;
  date: string;
  status: "pendiente-pago" | "preparando" | "enviado" | "entregado" | "cancelado";
  items: number;
  total: number;
}

interface Props {
  email: string;
  profile: { name: string; phone: string; dni: string; addresses: Address[] };
  orders: ClientOrder[];
  wishlist: Product[];
}

const STATUS_LABELS: Record<ClientOrder["status"], [string, string]> = {
  "pendiente-pago": ["Pendiente pago", "badge-warn"],
  preparando: ["Preparando", "badge-soft"],
  enviado: ["En camino", "badge-salvia"],
  entregado: ["Entregado", "badge-ok"],
  cancelado: ["Cancelado", "badge-err"],
};

export default function CuentaClient({ email, profile, orders, wishlist }: Props) {
  const [tab, setTab] = useState<"orders" | "fav" | "addr" | "data">("orders");
  const initial = (profile.name || email).charAt(0).toUpperCase();

  return (
    <div className="fade-in" style={{ padding: "32px 0 80px" }}>
      <div className="container-wide cuenta-grid">
        <aside>
          <div style={{ padding: 18, background: "var(--cream)", borderRadius: 16, marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--brand)", color: "#fff", fontFamily: "var(--font-display)", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{initial}</div>
            <div style={{ fontWeight: 700 }}>{profile.name || "Sin nombre"}</div>
            <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{email}</div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {([
              ["orders", `Mis pedidos${orders.length ? ` (${orders.length})` : ""}`, "box"],
              ["fav", `Favoritos${wishlist.length ? ` (${wishlist.length})` : ""}`, "heart"],
              ["addr", "Direcciones", "map"],
              ["data", "Mis datos", "user"],
            ] as [typeof tab, string, string][]).map(([id, l, ic]) => (
              <button key={id} onClick={() => setTab(id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: tab === id ? "var(--brand-soft)" : "transparent", color: tab === id ? "var(--brand-deep)" : "inherit", fontWeight: tab === id ? 600 : 500, fontSize: 14, textAlign: "left" }}>
                <Icon name={ic} size={16} />{l}
              </button>
            ))}
            <form action={signOut}>
              <button type="submit" style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, color: "var(--ink-mute)", fontSize: 14, textAlign: "left", marginTop: 12, background: "transparent" }}>
                <Icon name="logout" size={16} />Cerrar sesión
              </button>
            </form>
          </nav>
        </aside>

        <div>
          {tab === "orders" && <OrdersPanel orders={orders} />}
          {tab === "fav" && <WishlistPanel products={wishlist} />}
          {tab === "addr" && <AddressesPanel addresses={profile.addresses} />}
          {tab === "data" && <ProfilePanel email={email} profile={profile} />}
        </div>
      </div>
    </div>
  );
}

function OrdersPanel({ orders }: { orders: ClientOrder[] }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon="box"
        title="Aún no hiciste pedidos"
        body="Tus compras van a aparecer acá."
        cta={<Link href="/tienda" className="btn btn-primary">Ir a la tienda</Link>}
      />
    );
  }
  return (
    <>
      <h1 className="h2" style={{ marginBottom: 24 }}>Mis pedidos</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {orders.map((o) => {
          const [label, badge] = STATUS_LABELS[o.status];
          return (
            <div key={o.id} className="card cuenta-order-row" style={{ padding: 22 }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>Pedido</div>
                <div style={{ fontWeight: 700, fontFamily: "var(--font-display)" }}>{o.number}</div>
                <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{new Date(o.date).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}</div>
              </div>
              <div><span className={`badge ${badge}`}>{label}</span></div>
              <div>
                <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>{o.items} producto{o.items === 1 ? "" : "s"}</div>
                <div style={{ fontWeight: 700 }}>{fmt(o.total)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function WishlistPanel({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon="heart"
        title="Aún no tenés favoritos"
        body="Tocá el corazón en una prenda para guardarla."
        cta={<Link href="/tienda" className="btn btn-primary">Explorar</Link>}
      />
    );
  }
  return (
    <>
      <h1 className="h2" style={{ marginBottom: 24 }}>Favoritos</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="cuenta-fav-grid">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}

function AddressesPanel({ addresses }: { addresses: Address[] }) {
  const [adding, setAdding] = useState(false);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({ label: "", address: "", city: "", zip: "" });
  const [error, setError] = useState<string | null>(null);
  const labelId = useId();
  const addressId = useId();
  const cityId = useId();
  const zipId = useId();

  const onAdd = () => {
    if (!form.label || !form.address || !form.city || !form.zip) { setError("Completá todos los campos"); return; }
    setError(null);
    startTransition(async () => {
      try {
        await addMyAddress({ label: form.label, address: form.address, city: form.city, zip: form.zip });
        setForm({ label: "", address: "", city: "", zip: "" });
        setAdding(false);
      } catch {
        setError("No pudimos guardar la dirección. Intentá de nuevo.");
      }
    });
  };

  return (
    <>
      <h1 className="h2" style={{ marginBottom: 24 }}>Direcciones</h1>
      {addresses.length === 0 && !adding && (
        <p className="muted" style={{ fontSize: 14, marginBottom: 12 }}>No tenés direcciones guardadas.</p>
      )}
      {addresses.map((a) => (
        <div key={a.id} className="card" style={{ padding: 22, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <strong>{a.label}</strong>
                {a.isDefault && <span className="badge badge-soft">Principal</span>}
              </div>
              <div className="muted" style={{ fontSize: 14 }}>{a.address} · {a.city} · CP {a.zip}</div>
            </div>
            <form action={async () => { await removeMyAddress(a.id); }}>
              <button type="submit" className="btn-link" aria-label="Eliminar dirección"><Icon name="trash" size={14} /></button>
            </form>
          </div>
        </div>
      ))}
      {adding ? (
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field"><label htmlFor={labelId}>Etiqueta</label><input id={labelId} className="input" placeholder="Casa / Trabajo" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} /></div>
            <div className="field"><label htmlFor={addressId}>Dirección</label><input id={addressId} className="input" autoComplete="street-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="field"><label htmlFor={cityId}>Ciudad</label><input id={cityId} className="input" autoComplete="address-level2" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div className="field"><label htmlFor={zipId}>CP</label><input id={zipId} className="input" inputMode="numeric" autoComplete="postal-code" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} /></div>
          </div>
          {error && <p style={{ color: "#C97B85", fontSize: 13, margin: "8px 0 0" }}>{error}</p>}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn btn-ghost" onClick={() => setAdding(false)} disabled={pending}>Cancelar</button>
            <button className="btn btn-primary" onClick={onAdd} disabled={pending}>{pending ? "Guardando…" : "Guardar"}</button>
          </div>
        </div>
      ) : (
        <button className="btn btn-ghost" onClick={() => setAdding(true)}><Icon name="plus" size={14} /> Agregar dirección</button>
      )}
    </>
  );
}

function ProfilePanel({ email, profile }: { email: string; profile: { name: string; phone: string; dni: string } }) {
  const [form, setForm] = useState({ name: profile.name, phone: profile.phone, dni: profile.dni });
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const emailId = useId();
  const nameId = useId();
  const phoneId = useId();
  const dniId = useId();

  const onSave = () => {
    setMsg(null);
    startTransition(async () => {
      try {
        await updateMyProfile(form);
        setMsg("✓ Datos actualizados");
      } catch {
        setMsg("No pudimos guardar los cambios. Probá de nuevo.");
      }
    });
  };

  return (
    <>
      <h1 className="h2" style={{ marginBottom: 24 }}>Mis datos</h1>
      <div className="card cuenta-profile-card" style={{ padding: 28, maxWidth: 640 }}>
        <div className="field"><label htmlFor={emailId}>Email</label><input id={emailId} className="input" value={email} disabled /></div>
        <div className="field" style={{ marginTop: 14 }}><label htmlFor={nameId}>Nombre completo</label><input id={nameId} className="input" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
          <div className="field"><label htmlFor={phoneId}>Teléfono</label><input id={phoneId} className="input" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="field"><label htmlFor={dniId}>DNI</label><input id={dniId} className="input" inputMode="numeric" value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} /></div>
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 12, alignItems: "center" }}>
          <button className="btn btn-primary" onClick={onSave} disabled={pending}>{pending ? "Guardando…" : "Guardar cambios"}</button>
          {msg && <span style={{ fontSize: 13, color: msg.startsWith("✓") ? "var(--salvia-deep)" : "#C97B85" }}>{msg}</span>}
        </div>
      </div>
    </>
  );
}
