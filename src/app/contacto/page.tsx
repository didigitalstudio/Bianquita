"use client";

import { useId, useState } from "react";
import Icon from "@/components/ui/Icon";
import { useToast } from "@/context/ToastContext";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const SUBJECTS = ["Consulta general", "Estado de pedido", "Cambio o devolución", "Mayorista"] as const;

export default function ContactoPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();

  const validate = (): boolean => {
    const e: Partial<Record<keyof ContactForm, string>> = {};
    if (!form.name.trim()) e.name = "Requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
    if (form.message.trim().length < 5) e.message = "Contanos un poco más";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject,
          message: form.message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast(data.error ?? "No pudimos enviar tu mensaje");
        return;
      }
      showToast("¡Mensaje enviado! Te respondemos dentro de las 24hs.");
      setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
    } catch {
      showToast("Error de conexión. Probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

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
                { icon: "whatsapp", title: "WhatsApp", desc: "+54 11 5198-2734", sub: "Lun a vie 9 a 19hs", href: "https://wa.me/5491151982734" },
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
          <form className="card-soft" style={{ padding: 32 }} onSubmit={onSubmit} noValidate>
            <div className="h3" style={{ marginBottom: 18 }}>Mandanos un mensaje</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field">
                <label htmlFor={nameId}>Nombre</label>
                <input
                  id={nameId}
                  className="input"
                  style={{ background: "#fff" }}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="name"
                  required
                  maxLength={120}
                />
                {errors.name && <div style={{ color: "#C97B85", fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
              </div>
              <div className="field">
                <label htmlFor={emailId}>Email</label>
                <input
                  id={emailId}
                  className="input"
                  type="email"
                  style={{ background: "#fff" }}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                  required
                  maxLength={200}
                />
                {errors.email && <div style={{ color: "#C97B85", fontSize: 12, marginTop: 4 }}>{errors.email}</div>}
              </div>
              <div className="field" style={{ gridColumn: "span 2" }}>
                <label htmlFor={subjectId}>Asunto</label>
                <select
                  id={subjectId}
                  className="select"
                  style={{ background: "#fff" }}
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ gridColumn: "span 2" }}>
                <label htmlFor={messageId}>Mensaje</label>
                <textarea
                  id={messageId}
                  className="textarea"
                  style={{ background: "#fff", minHeight: 120 }}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  maxLength={4000}
                />
                {errors.message && <div style={{ color: "#C97B85", fontSize: 12, marginTop: 4 }}>{errors.message}</div>}
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting} style={{ marginTop: 20, width: "100%" }}>
              {submitting ? "Enviando…" : "Enviar →"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
