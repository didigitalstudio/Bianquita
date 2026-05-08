"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

const FAQS = [
  { q: "¿Cuánto tarda en llegar mi pedido?", a: "Despachamos dentro de las 48 hs hábiles. Andreani a domicilio tarda 3-5 días, sucursal 2-4 días, y la cadetería local llega el mismo día o al día siguiente." },
  { q: "¿Hacen envíos a todo el país?", a: "Sí, despachamos a todo el territorio argentino con Andreani y Correo Argentino. En CABA y GBA también ofrecemos cadetería propia." },
  { q: "¿Puedo cambiar la prenda si no le queda?", a: "¡Por supuesto! Tenés 15 días desde que recibís tu pedido para cambiar la prenda por otro talle o un crédito en tu cuenta. La prenda debe estar sin uso y con sus etiquetas." },
  { q: "¿Cómo elijo el talle correcto?", a: "Cada producto tiene su guía de talles. Si tenés dudas escribinos por WhatsApp y te ayudamos a elegir. Igualmente, los cambios son sin costo." },
  { q: "¿Cuáles son los medios de pago?", a: "Aceptamos tarjetas de crédito y débito (hasta 12 cuotas), y transferencia bancaria con 10% de descuento adicional." },
  { q: "¿Puedo comprar al por mayor?", a: "Sí, hacemos venta mayorista a tiendas y emprendimientos. Escribinos a mayorista@unilubikids.com.ar para recibir nuestro catálogo." },
  { q: "¿Cómo lavo las prendas?", a: "La mayoría se lavan a máquina con agua fría y del revés. Cada prenda incluye etiqueta con instrucciones específicas." },
  { q: "¿Puedo agregar packaging de regalo?", a: "Sí, por $1.500 sumamos un envoltorio especial con papel de seda, tarjeta personalizada y lazo." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number>(0);
  return (
    <div className="fade-in">
      <section style={{ padding: "64px 0 32px", background: "var(--cream)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>· Ayuda ·</div>
          <h1 className="h1" style={{ fontSize: "clamp(36px, 5vw, 56px)", marginBottom: 16 }}>Preguntas frecuentes</h1>
          <p className="soft" style={{ fontSize: 17 }}>Todo lo que necesitás saber para comprar tranquila.</p>
        </div>
      </section>
      <section style={{ padding: "48px 0 80px" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          {FAQS.map((f, i) => (
            <div key={i} style={{ borderBottom: "1px solid var(--line)" }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 19 }}>{f.q}</span>
                <span style={{ width: 32, height: 32, borderRadius: "50%", background: open === i ? "var(--brand)" : "var(--cream)", color: open === i ? "#fff" : "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s" }}>
                  <Icon name={open === i ? "minus" : "plus"} size={14} />
                </span>
              </button>
              {open === i && <div style={{ paddingBottom: 20, color: "var(--ink-soft)", lineHeight: 1.7, animation: "fadeIn .25s" }}>{f.a}</div>}
            </div>
          ))}
          <div className="card-soft" style={{ padding: 28, marginTop: 48, textAlign: "center" }}>
            <div className="h3" style={{ marginBottom: 8 }}>¿No encontraste tu respuesta?</div>
            <p className="muted" style={{ marginBottom: 20 }}>Escribinos por WhatsApp y te respondemos en minutos.</p>
            <Link href="/contacto" className="btn btn-primary">Contactarnos →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
