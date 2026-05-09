"use client";

import { useEffect, useId, useState, cloneElement, isValidElement } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ProductImage from "@/components/ui/ProductImage";
import EmptyState from "@/components/ui/EmptyState";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { fmt } from "@/lib/format";
import { FREE_SHIP_THRESHOLD, TRANSFER_DISCOUNT } from "@/lib/constants";

interface BankInfo { bank: string; cbu: string; alias: string; holder: string }

interface CustomerForm {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  phone: string;
}

interface ShippingForm {
  address: string;
  city: string;
  zip: string;
}

const SHIPPING_OPTIONS = [
  { id: "andreani-domicilio", label: "Andreani a domicilio", sub: "3-5 días hábiles", price: 5400 },
  { id: "andreani-sucursal", label: "Andreani sucursal", sub: "Retiro en sucursal · 2-4 días", price: 3800 },
  { id: "cadeteria", label: "Cadetería local CABA/GBA", sub: "Hoy mismo o mañana", price: 2500 },
  { id: "retiro", label: "Retiro en showroom", sub: "Palermo · cita previa", price: 0 },
] as const;

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState<typeof SHIPPING_OPTIONS[number]["id"]>("andreani-domicilio");
  const [payment, setPayment] = useState<"card" | "transfer">("card");
  const [done, setDone] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
  const [bankInfoError, setBankInfoError] = useState(false);
  const [customer, setCustomer] = useState<CustomerForm>({ firstName: "", lastName: "", email: "", dni: "", phone: "" });
  const [shipForm, setShipForm] = useState<ShippingForm>({ address: "", city: "", zip: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingOpt = SHIPPING_OPTIONS.find((o) => o.id === shipping)!;
  const shippingCost = subtotal >= FREE_SHIP_THRESHOLD ? 0 : shippingOpt.price;
  const transferDiscount = payment === "transfer" ? Math.round(subtotal * TRANSFER_DISCOUNT) : 0;
  const total = subtotal + shippingCost - transferDiscount;

  useEffect(() => {
    if (payment !== "transfer" || bankInfo) return;
    setBankInfoError(false);
    fetch("/api/payment/bank-info")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bank-info"))))
      .then(setBankInfo)
      .catch(() => setBankInfoError(true));
  }, [payment, bankInfo]);

  const validateCustomer = (): boolean => {
    const e: Record<string, string> = {};
    if (!customer.firstName.trim()) e.firstName = "Requerido";
    if (!customer.lastName.trim()) e.lastName = "Requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) e.email = "Email inválido";
    if (!/^\d{7,8}$/.test(customer.dni.replace(/\D/g, ""))) e.dni = "DNI debe tener 7-8 dígitos";
    if (customer.phone.replace(/\D/g, "").length < 8) e.phone = "Teléfono inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateShipping = (): boolean => {
    if (shipping === "retiro") return true;
    const e: Record<string, string> = {};
    if (!shipForm.address.trim()) e.address = "Requerido";
    if (!shipForm.city.trim()) e.city = "Requerido";
    if (!/^\d{4,5}$/.test(shipForm.zip.replace(/\D/g, ""))) e.zip = "CP inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitOrder = async () => {
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: `${customer.firstName} ${customer.lastName}`.trim(),
            email: customer.email,
            phone: customer.phone,
            dni: customer.dni,
          },
          shipping: {
            method: shipping,
            address: shipForm.address,
            city: shipForm.city,
            zip: shipForm.zip,
          },
          payment: { method: payment },
          items: cart,
          shippingCost,
          subtotal,
          total,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "No pudimos crear el pedido");
        setSubmitting(false);
        return;
      }
      clearCart();
      if (data.paymentRedirectUrl) {
        window.location.href = data.paymentRedirectUrl as string;
        return;
      }
      setOrderNumber(data.orderNumber);
      setDone(true);
      showToast("¡Pedido confirmado!");
    } catch {
      showToast("Error de conexión. Probá de nuevo.");
      setSubmitting(false);
    }
  };

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
          <p className="muted" style={{ marginBottom: 8 }}>Pedido <strong style={{ color: "var(--brand)" }}>{orderNumber}</strong></p>
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
      <div className="container-wide checkout-grid">
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
                <Field label="Nombre" error={errors.firstName}>
                  <input className="input" value={customer.firstName} onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })} autoComplete="given-name" />
                </Field>
                <Field label="Apellido" error={errors.lastName}>
                  <input className="input" value={customer.lastName} onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })} autoComplete="family-name" />
                </Field>
                <Field label="Email" error={errors.email} span={2}>
                  <input className="input" type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} autoComplete="email" />
                </Field>
                <Field label="DNI" error={errors.dni}>
                  <input className="input" inputMode="numeric" value={customer.dni} onChange={(e) => setCustomer({ ...customer, dni: e.target.value })} maxLength={9} />
                </Field>
                <Field label="Teléfono" error={errors.phone}>
                  <input className="input" type="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} autoComplete="tel" />
                </Field>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => { if (validateCustomer()) setStep(2); }}>Continuar →</button>
            </div>
          )}

          {step === 2 && (
            <div className="card" style={{ padding: 28 }}>
              <div className="h3" style={{ marginBottom: 20 }}>¿Cómo querés recibirlo?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {SHIPPING_OPTIONS.map((opt) => (
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
                  <Field label="Dirección" error={errors.address}>
                    <input className="input" value={shipForm.address} onChange={(e) => setShipForm({ ...shipForm, address: e.target.value })} autoComplete="street-address" />
                  </Field>
                  <Field label="Ciudad" error={errors.city}>
                    <input className="input" value={shipForm.city} onChange={(e) => setShipForm({ ...shipForm, city: e.target.value })} autoComplete="address-level2" />
                  </Field>
                  <Field label="CP" error={errors.zip}>
                    <input className="input" inputMode="numeric" value={shipForm.zip} onChange={(e) => setShipForm({ ...shipForm, zip: e.target.value })} autoComplete="postal-code" maxLength={5} />
                  </Field>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Atrás</button>
                <button className="btn btn-primary" onClick={() => { if (validateShipping()) setStep(3); }}>Continuar →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card" style={{ padding: 28 }}>
              <div className="h3" style={{ marginBottom: 20 }}>Método de pago</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {([
                  { id: "card", label: "Tarjeta de crédito o débito", sub: "Visa, Mastercard, Amex · Hasta 12 cuotas", icon: "card" },
                  { id: "transfer", label: "Transferencia bancaria", sub: "10% de descuento adicional", icon: "bank" },
                ] as const).map((opt) => (
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
                <div className="card-soft" style={{ padding: 18, fontSize: 13, color: "var(--ink-soft)" }}>
                  El pago con tarjeta se procesará vía MercadoPago. (Integración pendiente — al confirmar, el pedido queda en estado &quot;pendiente de pago&quot; y nos comunicamos con vos.)
                </div>
              )}
              {payment === "transfer" && (
                <div className="card-soft" style={{ padding: 18, fontSize: 14 }}>
                  <p style={{ margin: 0, marginBottom: 8 }}><strong>Datos para transferir:</strong></p>
                  {bankInfo ? (
                    <p style={{ margin: 0, color: "var(--ink-soft)" }}>
                      {bankInfo.bank}{bankInfo.cbu ? ` · CBU ${bankInfo.cbu}` : ""}{bankInfo.alias ? ` · Alias ${bankInfo.alias}` : ""}{bankInfo.holder ? ` · Titular: ${bankInfo.holder}` : ""}
                    </p>
                  ) : bankInfoError ? (
                    <p style={{ margin: 0, color: "#a55" }}>
                      No pudimos cargar los datos. Te los enviamos por email cuando confirmes el pedido.
                    </p>
                  ) : (
                    <p style={{ margin: 0, color: "var(--ink-mute)" }}>Cargando datos bancarios…</p>
                  )}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
                <button className="btn btn-ghost" onClick={() => setStep(2)} disabled={submitting}>← Atrás</button>
                <button className="btn btn-primary" disabled={submitting} onClick={submitOrder}>
                  {submitting ? "Procesando…" : `Confirmar pedido · ${fmt(total)}`}
                </button>
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
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span>Envío</span><span>{shippingCost === 0 ? "Gratis" : fmt(shippingCost)}</span></div>
              {transferDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "var(--salvia-deep)" }}><span>Descuento transferencia (10%)</span><span>−{fmt(transferDiscount)}</span></div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "var(--font-display)", fontSize: 22, color: "var(--ink)" }}><span>Total</span><span style={{ color: "var(--brand)" }}>{fmt(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, error, span = 1 }: { label: string; children: React.ReactNode; error?: string; span?: number }) {
  const id = useId();
  const child = isValidElement<{ id?: string }>(children) ? cloneElement(children, { id }) : children;
  return (
    <div className="field" style={{ gridColumn: span === 2 ? "span 2" : undefined }}>
      <label htmlFor={id}>{label}</label>
      {child}
      {error && <div style={{ color: "#a55", fontSize: 12, marginTop: 4 }}>{error}</div>}
    </div>
  );
}
