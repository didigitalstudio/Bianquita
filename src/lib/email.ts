import "server-only";

import { Resend } from "resend";
import type { OrderRow } from "@/lib/data/orders";
import type { Database } from "@/lib/supabase/database.types";
import { fmt } from "@/lib/format";
import { BRAND } from "@/lib/constants";

type OrderStatus = Database["public"]["Enums"]["order_status"];

const FROM_NAME = BRAND.name;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Unilubi Kids <hola@unilubikids.com.ar>";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const STATUS_COPY: Record<OrderStatus, { subject: string; heading: string; body: string }> = {
  "pendiente-pago": {
    subject: "Tu pedido está pendiente de pago",
    heading: "Estamos esperando tu pago",
    body: "Cuando confirmemos el pago vamos a empezar a preparar tus prendas.",
  },
  preparando: {
    subject: "Estamos preparando tu pedido",
    heading: "¡Empezamos a preparar tu pedido!",
    body: "En las próximas 48 hs hábiles te avisamos cuando esté en camino.",
  },
  enviado: {
    subject: "Tu pedido ya está en camino 🚚",
    heading: "¡En camino!",
    body: "Tu pedido salió hacia tu domicilio. Te llega en los próximos días.",
  },
  entregado: {
    subject: "Tu pedido fue entregado 💌",
    heading: "¡Recibiste tu pedido!",
    body: "Esperamos que disfruten cada prenda. Si tenés un minuto, contanos qué te pareció.",
  },
  cancelado: {
    subject: "Tu pedido fue cancelado",
    heading: "Pedido cancelado",
    body: "Si esto fue un error o necesitás ayuda, escribinos por WhatsApp y lo solucionamos.",
  },
};

function htmlShell(heading: string, content: string): string {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#FAF6EE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#2B231D;">
  <div style="max-width:540px;margin:0 auto;padding:32px 24px;">
    <div style="background:#fff;border-radius:18px;padding:32px;border:1px solid #ECE3D2;">
      <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#B5663D;margin-bottom:8px;">${BRAND.name}</div>
      <h1 style="font-size:22px;margin:0 0 20px;font-weight:600;">${heading}</h1>
      ${content}
      <div style="margin-top:32px;padding-top:18px;border-top:1px solid #ECE3D2;font-size:12px;color:#9A8E81;">
        ¿Necesitás ayuda? Escribinos por WhatsApp o respondé este email.
      </div>
    </div>
  </div>
</body></html>`;
}

function orderTable(order: OrderRow): string {
  const items = Array.isArray(order.items) ? (order.items as Array<{ name?: string; qty?: number; size?: string; color?: string; price?: number }>) : [];
  const rows = items.map((it) => `<tr>
      <td style="padding:8px 0;">${(it.name ?? "Producto")}${it.size ? ` · ${it.size}` : ""}${it.color ? ` · ${it.color}` : ""}</td>
      <td style="padding:8px 0;text-align:center;">x${it.qty ?? 1}</td>
      <td style="padding:8px 0;text-align:right;font-weight:600;">${fmt((it.price ?? 0) * (it.qty ?? 1))}</td>
    </tr>`).join("");
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px;">
      <tbody>${rows}</tbody>
      <tfoot>
        <tr><td colspan="3" style="border-top:1px solid #ECE3D2;padding-top:8px;"></td></tr>
        <tr><td colspan="2" style="padding:4px 0;color:#6B5E50;">Subtotal</td><td style="text-align:right;padding:4px 0;">${fmt(order.subtotal)}</td></tr>
        <tr><td colspan="2" style="padding:4px 0;color:#6B5E50;">Envío</td><td style="text-align:right;padding:4px 0;">${order.shipping_cost === 0 ? "Gratis" : fmt(order.shipping_cost)}</td></tr>
        <tr><td colspan="2" style="padding:8px 0;font-weight:700;">Total</td><td style="text-align:right;padding:8px 0;font-weight:700;color:#B5663D;">${fmt(order.total)}</td></tr>
      </tfoot>
    </table>`;
}

export async function sendOrderConfirmationEmail(order: OrderRow): Promise<void> {
  const resend = getResend();
  if (!resend) return;
  const content = `
    <p style="font-size:15px;line-height:1.6;color:#4A4138;">
      ¡Gracias por tu compra! Recibimos tu pedido <strong style="color:#B5663D;">${order.order_number}</strong>.
    </p>
    ${orderTable(order)}
    <p style="font-size:14px;color:#6B5E50;">
      Te vamos a avisar cuando empecemos a preparar tu pedido y cuando salga hacia tu domicilio.
    </p>
  `;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.customer_email,
    subject: `${FROM_NAME} — Pedido ${order.order_number} confirmado`,
    html: htmlShell("Recibimos tu pedido", content),
  });
}

interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactMessageEmail(msg: ContactMessage): Promise<void> {
  const resend = getResend();
  const inbox = process.env.CONTACT_INBOX ?? "hola@unilubikids.com.ar";
  if (!resend) return;
  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const content = `
    <p style="font-size:14px;color:#6B5E50;margin:0 0 4px;">De</p>
    <p style="font-size:15px;margin:0 0 16px;"><strong>${escapeHtml(msg.name)}</strong> · <a href="mailto:${escapeHtml(msg.email)}" style="color:#B5663D;">${escapeHtml(msg.email)}</a></p>
    <p style="font-size:14px;color:#6B5E50;margin:0 0 4px;">Asunto</p>
    <p style="font-size:15px;margin:0 0 16px;">${escapeHtml(msg.subject)}</p>
    <p style="font-size:14px;color:#6B5E50;margin:0 0 4px;">Mensaje</p>
    <p style="font-size:15px;line-height:1.6;white-space:pre-wrap;margin:0;">${escapeHtml(msg.message)}</p>
  `;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: inbox,
    replyTo: msg.email,
    subject: `[Contacto] ${msg.subject} — ${msg.name}`,
    html: htmlShell("Nuevo mensaje desde la web", content),
  });
}

export async function sendOrderStatusEmail(order: OrderRow): Promise<void> {
  const resend = getResend();
  if (!resend) return;
  const copy = STATUS_COPY[order.status];
  const content = `
    <p style="font-size:15px;line-height:1.6;color:#4A4138;">
      Pedido <strong style="color:#B5663D;">${order.order_number}</strong>.
    </p>
    <p style="font-size:15px;color:#4A4138;">${copy.body}</p>
    ${orderTable(order)}
  `;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.customer_email,
    subject: `${FROM_NAME} — ${copy.subject}`,
    html: htmlShell(copy.heading, content),
  });
}
