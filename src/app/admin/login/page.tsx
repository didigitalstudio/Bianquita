"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const initialError = searchParams.get("error") === "not-admin"
    ? "Tu cuenta no tiene permisos de administrador."
    : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    // Middleware will verify the is_admin flag on the next request.
    router.replace(next);
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card" style={{ width: 420, maxWidth: "100%", padding: 32 }}>
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <Logo size="sm" />
          <div style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 8, letterSpacing: "0.15em", textTransform: "uppercase" }}>Admin Panel</div>
        </div>
        <h1 className="h3" style={{ marginBottom: 4 }}>Iniciá sesión</h1>
        <p className="muted" style={{ fontSize: 13, marginBottom: 24 }}>Acceso solo para administradores de Unilubi.</p>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ fontSize: 13, color: "#a55", margin: 0 }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Link href="/" className="btn-link" style={{ fontSize: 13 }}>← Volver a la tienda</Link>
        </div>
      </div>
    </div>
  );
}
