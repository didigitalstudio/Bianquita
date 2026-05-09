"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ProductImage from "@/components/ui/ProductImage";
import EmptyState from "@/components/ui/EmptyState";
import { useCart } from "@/context/CartContext";
import { fmt } from "@/lib/format";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, updateQty, removeFromCart } = useCart();

  if (!open) return null;

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const freeShip = subtotal >= 35000;
  const remaining = 35000 - subtotal;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(43, 35, 29, 0.45)", zIndex: 100, animation: "fadeIn .2s" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", right: 0, top: 0, height: "100%", width: 460, maxWidth: "94vw", background: "var(--paper)", display: "flex", flexDirection: "column", animation: "slideLeft .3s ease-out" }}>
        <div style={{ padding: "24px 28px", borderBottom: "1px solid var(--line-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="h3" style={{ fontFamily: "var(--font-display)" }}>Tu carrito ({cart.reduce((s, i) => s + i.qty, 0)})</div>
          <button className="btn-icon" onClick={onClose}><Icon name="x" /></button>
        </div>

        {cart.length === 0 ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <EmptyState icon="bag" title="Tu carrito está vacío" body="Agregá prendas para empezar tu compra." cta={
              <Link href="/tienda" onClick={onClose} className="btn btn-primary">Ver productos</Link>
            } />
          </div>
        ) : (
          <>
            {!freeShip && (
              <div style={{ padding: "12px 28px", background: "var(--brand-soft)", fontSize: 13, color: "var(--brand-deep)" }}>
                Te faltan <strong>{fmt(remaining)}</strong> para envío gratis ✦
                <div style={{ height: 4, background: "rgba(255,255,255,0.5)", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(subtotal / 35000) * 100}%`, background: "var(--brand)", transition: "width .4s" }} />
                </div>
              </div>
            )}
            {freeShip && <div style={{ padding: "12px 28px", background: "rgba(156, 168, 136, 0.25)", fontSize: 13, color: "var(--salvia-deep)", fontWeight: 600 }}>✓ Tenés envío gratis</div>}

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 28px" }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div style={{ width: 80, height: 96, borderRadius: 10, overflow: "hidden", background: "var(--cream)", position: "relative" }}>
                    <ProductImage src={item.img} alt={item.name} label="img" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 15, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-mute)", marginBottom: 8, textTransform: "capitalize" }}>{item.color.replace("-", " ")} · Talle {item.size}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)", borderRadius: 999 }}>
                        <button onClick={() => updateQty(idx, Math.max(1, item.qty - 1))} disabled={item.qty <= 1} aria-label="Disminuir cantidad" style={{ padding: "4px 8px", opacity: item.qty <= 1 ? 0.3 : 1, cursor: item.qty <= 1 ? "not-allowed" : "pointer" }}><Icon name="minus" size={12} /></button>
                        <span style={{ fontSize: 13, minWidth: 22, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => updateQty(idx, item.qty + 1)} aria-label="Aumentar cantidad" style={{ padding: "4px 8px" }}><Icon name="plus" size={12} /></button>
                      </div>
                      <button onClick={() => removeFromCart(idx)} style={{ color: "var(--ink-mute)", padding: 4 }}><Icon name="trash" size={14} /></button>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, textAlign: "right" }}>{fmt(item.price * item.qty)}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: "20px 28px 28px", borderTop: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, color: "var(--ink-soft)" }}>
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 13, color: "var(--ink-soft)" }}>
                <span>Envío</span><span>{freeShip ? "Gratis" : "Calcular en checkout"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>Total</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--brand)" }}>{fmt(subtotal)}</span>
              </div>
              <Link href="/checkout" onClick={onClose} className="btn btn-primary btn-lg" style={{ width: "100%", marginBottom: 8, display: "flex", justifyContent: "center" }}>Finalizar compra →</Link>
              <Link href="/tienda" onClick={onClose} className="btn btn-ghost" style={{ width: "100%", display: "flex", justifyContent: "center" }}>Seguir comprando</Link>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
}
