"use client";

import Icon from "@/components/ui/Icon";
import { useToast } from "@/context/ToastContext";

export default function ContactoPage() {
  const { showToast } = useToast();
  return (
    <div className="fade-in">
      <section style={{ padding: "64px 0 32px", background: "var(--cream)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>· Contacto ·</div>
          <h1 className="h1" style={{ fontSize: "clamp(36px, 5vw, 56px)", marginBottom: 16 }}>Hablemos</h1>
          <p className="soft" style={{ fontSize: 17 }}>Estamos para ayudarte. Elegí el canal que prefieras.</p>
        </div>
      </section>
      <section style={{ padding: "48px 0 80px" }}>
        <div className="container" style={{ maxWidth: 1000, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
              {[
                { icon: "whatsapp", title: "WhatsApp", desc: "+54 11 5119-8327", sub: "Lun a vie 9 a 19hs", href: "https://wa.me/5491151198327" },
                { icon: "mail", title: "Email", desc: "hola@unilubikids.com.ar", sub: "Respondemos en 24hs", href: "mailto:hola@unilubikids.com.ar" },
                { icon: "instagram", title: "Instagram", desc: "@unilubikids", sub: "DM o etiquetanos", href: "https://instagram.com/unilubikids" },
                { icon: "map", title: "Showroom", desc: "Palermo, Buenos Aires", sub: "Con cita previa", href: "#" },
              ].map((c) => (
                <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer" className="card" style={{ padding: 18, display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--brand-soft)", color: "var(--brand-deep)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={c.icon} size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{c.title}</div>
                    <div style={{ fontWeight: 600, marginTop: 2 }}>{c.desc}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{c.sub}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="card-soft" style={{ padding: 32 }}>
            <div className="h3" style={{ marginBottom: 18 }}>Mandanos un mensaje</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field"><label>Nombre</label><input className="input" style={{ background: "#fff" }} /></div>
              <div className="field"><label>Email</label><input className="input" style={{ background: "#fff" }} /></div>
              <div className="field" style={{ gridColumn: "span 2" }}><label>Asunto</label>
                <select className="select" style={{ background: "#fff" }}>
                  <option>Consulta general</option>
                  <option>Estado de pedido</option>
                  <option>Cambio o devolución</option>
                  <option>Mayorista</option>
                </select>
              </div>
              <div className="field" style={{ gridColumn: "span 2" }}><label>Mensaje</label><textarea className="textarea" style={{ background: "#fff", minHeight: 120 }} /></div>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 20, width: "100%" }} onClick={() => showToast("Mensaje enviado · te respondemos en 24hs")}>Enviar →</button>
          </div>
        </div>
      </section>
    </div>
  );
}
