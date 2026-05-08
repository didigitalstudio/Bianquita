"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import EmptyState from "@/components/ui/EmptyState";
import { fmt } from "@/lib/data";

type User = { name: string; email: string } | null;

export default function CuentaPage() {
  const [user, setUser] = useState<User>({ name: "María Fernández", email: "maria@email.com" });
  const [tab, setTab] = useState("orders");

  if (!user) {
    return (
      <div style={{ padding: "80px 24px", textAlign: "center" }}>
        <EmptyState icon="user" title="Iniciá sesión" body="Ingresá para ver tus pedidos y datos." cta={<Link href="/login" className="btn btn-primary">Iniciar sesión</Link>} />
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ padding: "32px 0 80px" }}>
      <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 40 }}>
        <aside>
          <div style={{ padding: 18, background: "var(--cream)", borderRadius: 16, marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--brand)", color: "#fff", fontFamily: "var(--font-display)", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{user.name[0]}</div>
            <div style={{ fontWeight: 700 }}>{user.name}</div>
            <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{user.email}</div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {([["orders", "Mis pedidos", "box"], ["fav", "Favoritos", "heart"], ["addr", "Direcciones", "map"], ["data", "Mis datos", "user"]] as [string, string, string][]).map(([id, l, ic]) => (
              <button key={id} onClick={() => setTab(id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: tab === id ? "var(--brand-soft)" : "transparent", color: tab === id ? "var(--brand-deep)" : "inherit", fontWeight: tab === id ? 600 : 500, fontSize: 14, textAlign: "left" }}>
                <Icon name={ic} size={16} />{l}
              </button>
            ))}
            <button onClick={() => setUser(null)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, color: "var(--ink-mute)", fontSize: 14, textAlign: "left", marginTop: 12 }}>
              <Icon name="logout" size={16} />Cerrar sesión
            </button>
          </nav>
        </aside>
        <div>
          {tab === "orders" && (
            <>
              <h1 className="h2" style={{ marginBottom: 24 }}>Mis pedidos</h1>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { id: "ULB-2841", date: "4 May 2026", status: "preparando", items: 3, total: 42700 },
                  { id: "ULB-2820", date: "12 Abr 2026", status: "entregado", items: 2, total: 27400 },
                  { id: "ULB-2790", date: "28 Mar 2026", status: "entregado", items: 5, total: 86200 },
                ].map((o) => {
                  const STATUS: Record<string, [string, string]> = { preparando: ["Preparando", "badge-warn"], entregado: ["Entregado", "badge-ok"], enviado: ["En camino", "badge-soft"] };
                  return (
                    <div key={o.id} className="card" style={{ padding: 22, display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 20, alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>Pedido</div>
                        <div style={{ fontWeight: 700, fontFamily: "var(--font-display)" }}>{o.id}</div>
                        <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{o.date}</div>
                      </div>
                      <div><span className={`badge ${STATUS[o.status][1]}`}>{STATUS[o.status][0]}</span></div>
                      <div>
                        <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>{o.items} productos</div>
                        <div style={{ fontWeight: 700 }}>{fmt(o.total)}</div>
                      </div>
                      <button className="btn btn-ghost btn-sm">Ver detalle →</button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {tab === "fav" && <EmptyState icon="heart" title="Aún no tenés favoritos" body="Tocá el corazón en una prenda para guardarla." cta={<Link href="/tienda" className="btn btn-primary">Explorar</Link>} />}
          {tab === "addr" && (
            <>
              <h1 className="h2" style={{ marginBottom: 24 }}>Direcciones</h1>
              <div className="card" style={{ padding: 22, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><strong>Casa</strong><span className="badge badge-soft">Principal</span></div>
                    <div className="muted" style={{ fontSize: 14 }}>Av. Cabildo 2840 · CABA · CP 1428</div>
                  </div>
                  <button className="btn-link"><Icon name="edit" size={14} /></button>
                </div>
              </div>
              <button className="btn btn-ghost"><Icon name="plus" size={14} /> Agregar dirección</button>
            </>
          )}
          {tab === "data" && (
            <>
              <h1 className="h2" style={{ marginBottom: 24 }}>Mis datos</h1>
              <div className="card" style={{ padding: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 640 }}>
                <div className="field"><label>Nombre</label><input className="input" defaultValue="María" /></div>
                <div className="field"><label>Apellido</label><input className="input" defaultValue="Fernández" /></div>
                <div className="field" style={{ gridColumn: "span 2" }}><label>Email</label><input className="input" defaultValue="maria@email.com" /></div>
                <div className="field"><label>Teléfono</label><input className="input" defaultValue="+54 11 5198-2734" /></div>
                <div className="field"><label>DNI</label><input className="input" defaultValue="32145678" /></div>
                <div style={{ gridColumn: "span 2", marginTop: 8 }}><button className="btn btn-primary">Guardar cambios</button></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
