"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ProductImage from "@/components/ui/ProductImage";
import EmptyState from "@/components/ui/EmptyState";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { fmt } from "@/lib/data";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState("andreani-domicilio");
  const [payment, setPayment] = useState("card");
  const [done, setDone] = useState(false);
  const [orderId] = useState(() => `ULB-${Math.floor(Math.random() * 9000 + 1000)}`);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingCost = subtotal >= 35000 ? 0 : shipping === "cadeteria" ? 2500 : shipping === "andreani-sucursal" ? 3800 : shipping === "retiro" ? 0 : 5400;
  const total = subtotal + shippingCost;

  if (cart.length === 0 && !done) {
    return (
      <div className="container" style={{ padding: "120px 24px" }}>
        <EmptyState icon="bag" title="Tu carrito está vacío" body="Agregá productos antes de pagar." cta={<Link href="/tienda" className="btn btn-primary">Ir a la tienda</Link>} />
      </div>
    );
  }

  if (done) {
    return (
      <div className="container" style={{ padding: "80px 24px", maxWidth: 640 }}>
        <div style={{ textAlign: "center", padding: "48px 32px", background: "var(--cream)", borderRadius: 22 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--salvia)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Icon name="check" size={36} />
          </div>
          <h1 className="h2" style={{ marginBottom: 12 }}>¡Gracias por tu compra!</h1>
          <p className="muted" style={{ marginBottom: 8 }}>Pedido <strong style={{ color: "var(--brand)" }}>{orderId}</strong></p>
          <p className="soft" style={{ marginBottom: 32 }}>Te enviamos un mail de confirmación. Tu pedido se despacha en las próximas 48 hs hábiles.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/cuenta" className="btn btn-primary">Ver mis pedidos</Link>
            <Link href="/" className="btn btn-ghost">Volver al inicio</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ padding: "32px 0 80px" }}>
      <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 60 }}>
        <div>
          <h1 className="h2" style={{ marginBottom: 8 }}>Finalizar compra</h1>
          <div style={{ display: "flex", gap: 8, marginBottom: 32, fontSize: 13 }}>
            {["Datos", "Envío", "Pago"].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: i + 1 <= step ? "var(--brand)" : "var(--ink-mute)" }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: i + 1 <= step ? "var(--brand)" : "var(--cream)", color: i + 1 <= step ? "#fff" : "var(--ink-mute)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 }}>{i + 1}</span>
                <span style={{ fontWeight: 600 }}>{s}</span>
                {i < 2 && <span style={{ width: 32, height: 1, background: "var(--line)" }} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="card" style={{ padding: 28 }}>
              <div className="h3" style={{ marginBottom: 20 }}>Tus datos</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="field"><label>Nombre</label><input className="input" defaultValue="María" /></div>
                <div className="field"><label>Apellido</label><input className="input" defaultValue="Fernández" /></div>
                <div className="field" style={{ gridColumn: "span 2" }}><label>Email</label><input className="input" defaultValue="maria@email.com" /></div>
                <div className="field"><label>DNI</label><input className="input" defaultValue="32145678" /></div>
                <div className="field"><label>Teléfono</label><input className="input" defaultValue="+54 11 5198-2734" /></div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => setStep(2)}>Continuar →</button>
            </div>
          )}

          {step === 2 && (
            <div className="card" style={{ padding: 28 }}>
              <div className="h3" style={{ marginBottom: 20 }}>¿Cómo querés recibirlo?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {[
                  { id: "andreani-domicilio", label: "Andreani a domicilio", sub: "3-5 días hábiles", price: 5400 },
                  { id: "andreani-sucursal", label: "Andreani sucursal", sub: "Retiro en sucursal · 2-4 días", price: 3800 },
                  { id: "cadeteria", label: "Cadetería local CABA/GBA", sub: "Hoy mismo o mañana", price: 2500 },
                  { id: "retiro", label: "Retiro en showroom", sub: "Palermo · cita previa", price: 0 },
                ].map((opt) => (
                  <button key={opt.id} onClick={() => setShipping(opt.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, border: shipping === opt.id ? "2px solid var(--brand)" : "1px solid var(--line)", borderRadius: 14, textAlign: "left", background: shipping === opt.id ? "var(--brand-soft)" : "#fff" }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--brand)", background: shipping === opt.id ? "var(--brand)" : "transparent", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{opt.sub}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: opt.price === 0 ? "var(--salvia-deep)" : "inherit" }}>{opt.price === 0 ? "Gratis" : fmt(opt.price)}</div>
                  </button>
                ))}
              </div>
              {shipping !== "retiro" && (
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14 }}>
                  <div className="field"><label>Dirección</label><input className="input" defaultValue="Av. Cabildo 2840" /></div>
                  <div className="field"><label>Ciudad</label><input className="input" defaultValue="CABA" /></div>
                  <div className="field"><label>CP</label><input className="input" defaultValue="1428" /></div>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Atrás</button>
                <button className="btn btn-primary" onClick={() => setStep(3)}>Continuar →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card" style={{ padding: 28 }}>
              <div className="h3" style={{ marginBottom: 20 }}>Método de pago</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {[
                  { id: "card", label: "Tarjeta de crédito o débito", sub: "Visa, Mastercard, Amex · Hasta 12 cuotas", icon: "card" },
                  { id: "transfer", label: "Transferencia bancaria", sub: "10% de descuento adicional", icon: "bank" },
                ].map((opt) => (
                  <button key={opt.id} onClick={() => setPayment(opt.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, border: payment === opt.id ? "2px solid var(--brand)" : "1px solid var(--line)", borderRadius: 14, textAlign: "left", background: payment === opt.id ? "var(--brand-soft)" : "#fff" }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--brand)", background: payment === opt.id ? "var(--brand)" : "transparent", flexShrink: 0 }} />
                    <Icon name={opt.icon} size={22} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{opt.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
              {payment === "card" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="field" style={{ gridColumn: "span 2" }}><label>Número de tarjeta</label><input className="input" placeholder="•••• •••• •••• ••••" /></div>
                  <div className="field" style={{ gridColumn: "span 2" }}><label>Nombre en la tarjeta</label><input className="input" /></div>
                  <div className="field"><label>Vencimiento</label><input className="input" placeholder="MM/AA" /></div>
                  <div className="field"><label>CVV</label><input className="input" placeholder="123" /></div>
                  <div className="field" style={{ gridColumn: "span 2" }}>
                    <label>Cuotas</label>
                    <select className="select">
                      <option>1 cuota de {fmt(total)}</option>
                      <option>3 cuotas sin interés de {fmt(Math.round(total / 3))}</option>
                      <option>6 cuotas de {fmt(Math.round(total / 6))}</option>
                      <option>12 cuotas de {fmt(Math.round(total / 12))}</option>
                    </select>
                  </div>
                </div>
              )}
              {payment === "transfer" && (
                <div className="card-soft" style={{ padding: 18, fontSize: 14 }}>
                  <p style={{ margin: 0, marginBottom: 8 }}><strong>Datos para transferir:</strong></p>
                  <p style={{ margin: 0, color: "var(--ink-soft)" }}>Banco Galicia · CBU 0070123456789012345678 · Alias unilubi.kids · Titular: Unilubi SRL</p>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
                <button className="btn btn-ghost" onClick={() => setStep(2)}>← Atrás</button>
                <button className="btn btn-primary" onClick={() => { clearCart(); setDone(true); showToast("¡Pedido confirmado!"); }}>Pagar {fmt(total)}</button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="card-soft" style={{ padding: 24, position: "sticky", top: 100 }}>
            <div className="h3" style={{ marginBottom: 16 }}>Resumen</div>
            <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: 16 }}>
              {cart.map((it, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 56, height: 64, borderRadius: 8, overflow: "hidden", background: "#fff", flexShrink: 0, position: "relative" }}>
                    <ProductImage src={it.img} alt={it.name} label="img" />
                  </div>
                  <div style={{ flex: 1, fontSize: 13 }}>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{it.name}</div>
                    <div style={{ color: "var(--ink-soft)", fontSize: 12, textTransform: "capitalize" }}>{it.color.replace("-", " ")} · {it.size} · x{it.qty}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{fmt(it.price * it.qty)}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, fontSize: 14, color: "var(--ink-soft)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}><span>Envío</span><span>{shippingCost === 0 ? "Gratis" : fmt(shippingCost)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink)" }}><span>Total</span><span style={{ color: "var(--brand)" }}>{fmt(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
