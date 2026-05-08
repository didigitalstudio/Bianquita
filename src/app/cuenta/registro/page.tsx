"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";

export default function CuentaRegistroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    if (data.session) {
      router.replace("/cuenta");
      router.refresh();
    } else {
      // Email confirmation required
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: "calc(100vh - 200px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
        <div className="card" style={{ width: 460, maxWidth: "100%", padding: 32, textAlign: "center" }}>
          <h1 className="h3" style={{ marginBottom: 12 }}>Te enviamos un email ✉️</h1>
          <p className="muted" style={{ fontSize: 14, marginBottom: 24 }}>
            Confirmá tu dirección desde el link que te llegó a <strong>{email}</strong> para activar tu cuenta.
          </p>
          <Link href="/cuenta/login" className="btn btn-primary">Ir a iniciar sesión</Link>
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
        <h1 className="h3" style={{ marginBottom: 4 }}>Creá tu cuenta</h1>
        <p className="muted" style={{ fontSize: 13, marginBottom: 24 }}>Guardá favoritos y seguí tus pedidos.</p>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="field">
            <label htmlFor="name">Nombre</label>
            <input id="name" className="input" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" className="input" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" className="input" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 4 }}>Mínimo 8 caracteres.</div>
          </div>
          {error && <p style={{ fontSize: 13, color: "#a55", margin: 0 }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Creando cuenta…" : "Crear cuenta"}</button>
        </form>
        <div style={{ marginTop: 20, textAlign: "center", fontSize: 13 }}>
          ¿Ya tenés cuenta? <Link href="/cuenta/login" className="btn-link">Iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}
