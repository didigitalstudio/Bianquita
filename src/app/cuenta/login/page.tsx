"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";

export default function CuentaLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/cuenta";
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(translateAuthError(authError.message));
      setLoading(false);
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <div style={{ minHeight: "calc(100vh - 200px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
      <div className="card" style={{ width: 420, maxWidth: "100%", padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Logo size="sm" />
        </div>
        <h1 className="h3" style={{ marginBottom: 4 }}>Iniciá sesión</h1>
        <p className="muted" style={{ fontSize: 13, marginBottom: 24 }}>Accedé para ver tus pedidos y favoritos.</p>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" className="input" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" className="input" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p style={{ fontSize: 13, color: "#C97B85", margin: 0 }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Ingresando…" : "Ingresar"}</button>
        </form>
        <div style={{ marginTop: 16, textAlign: "center", fontSize: 13 }}>
          <Link href="/cuenta/olvide-password" className="btn-link">¿Olvidaste tu contraseña?</Link>
        </div>
        <div style={{ marginTop: 12, textAlign: "center", fontSize: 13 }}>
          ¿Todavía no tenés cuenta? <Link href="/cuenta/registro" className="btn-link">Registrate</Link>
        </div>
      </div>
    </div>
  );
}
