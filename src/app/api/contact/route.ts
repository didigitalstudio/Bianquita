import { NextResponse } from "next/server";
import { sendContactMessageEmail } from "@/lib/email";

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const subject = body.subject?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || name.length > 120) {
    return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }
  if (!subject || subject.length > 200) {
    return NextResponse.json({ error: "Asunto inválido" }, { status: 400 });
  }
  if (!message || message.length < 5 || message.length > 4000) {
    return NextResponse.json({ error: "Mensaje muy corto o muy largo" }, { status: 400 });
  }

  try {
    await sendContactMessageEmail({ name, email, subject, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json(
      { error: "No pudimos enviar tu mensaje. Probá por WhatsApp." },
      { status: 500 },
    );
  }
}
