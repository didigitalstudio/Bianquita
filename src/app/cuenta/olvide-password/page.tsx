"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";

export default function OlvidePasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    // The redirectTo MUST be the auth callback so we can exchange the code
    // for a session before landing on /cuenta/reset-password.
    const redirectTo = `${window.location.origin}/api/auth/callback?next=/cuenta/reset-password`;
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    setLoading(false);
    if (authError) {
      setError(translateAuthError(authError.message));
      return;
    }
    // We always show success even if the email doesn't exist — avoid leaking
    // which addresses are registered (account-enumeration protection).
    setSent(true);
  }

  if (sent) {
    return (
      <div style={{ minHeight: "calc(100vh - 200px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
        <div className="card" style={{ width: 460, maxWidth: "100%", padding: 32, textAlign: "center" }}>
          <h1 className="h3" style={{ marginBottom: 12 }}>Revisá tu email ✉️</h1>
          <p className="muted" style={{ fontSize: 14, marginBottom: 8 }}>
            Si <strong>{email}</strong> está registrado, te enviamos un link para reestablecer tu contraseña.
          </p>
          <p className="muted" style={{ fontSize: 13, marginBottom: 24 }}>
            El link expira en 1 hora. Si no lo encontrás, mirá la carpeta de spam.
          </p>
          <Link href="/cuenta/login" className="btn btn-primary">Volver a iniciar sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 200px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
      <div className="card" style={{ width: 420, maxWidth: "100%", padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Logo size="sm" />
        </div>
        <h1 className="h3" style={{ marginBottom: 4 }}>Recuperar contraseña</h1>
        <p className="muted" style={{ fontSize: 13, marginBottom: 24 }}>
          Ingresá tu email y te mandamos un link para crear una contraseña nueva.
        </p>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <p style={{ fontSize: 13, color: "#C97B85", margin: 0 }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Enviando…" : "Enviar link de recuperación"}
          </button>
        </form>
        <div style={{ marginTop: 20, textAlign: "center", fontSize: 13 }}>
          <Link href="/cuenta/login" className="btn-link">← Volver a iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}
