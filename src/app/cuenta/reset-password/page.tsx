"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  );
}

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialError = searchParams.get("error");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(
    initialError === "invalid-link"
      ? "El link de recuperación es inválido o ya expiró. Pedí uno nuevo."
      : initialError === "missing-code"
        ? "Faltan datos en el link. Pedí un nuevo email de recuperación."
        : null,
  );
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  // Confirm there's an active session (the auth callback should have set it).
  // Without a session, updateUser() will fail with "Auth session missing".
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (authError) {
      setError(translateAuthError(authError.message));
      return;
    }
    setDone(true);
    // Give the user a moment to read the success message, then send them in.
    setTimeout(() => {
      router.replace("/cuenta");
      router.refresh();
    }, 1500);
  }

  if (done) {
    return (
      <div style={{ minHeight: "calc(100vh - 200px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
        <div className="card" style={{ width: 460, maxWidth: "100%", padding: 32, textAlign: "center" }}>
          <h1 className="h3" style={{ marginBottom: 12 }}>¡Contraseña actualizada! ✓</h1>
          <p className="muted" style={{ fontSize: 14 }}>Te llevamos a tu cuenta…</p>
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
        <h1 className="h3" style={{ marginBottom: 4 }}>Nueva contraseña</h1>
        <p className="muted" style={{ fontSize: 13, marginBottom: 24 }}>
          Elegí una contraseña nueva para tu cuenta.
        </p>

        {hasSession === false && (
          <div className="card-soft" style={{ padding: 14, marginBottom: 16, fontSize: 13, color: "#C97B85" }}>
            El link expiró o ya fue usado.{" "}
            <Link href="/cuenta/olvide-password" className="btn-link">Pedí uno nuevo</Link>.
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="field">
            <label htmlFor="password">Contraseña nueva</label>
            <input
              id="password"
              type="password"
              className="input"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={hasSession === false}
            />
            <div style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 4 }}>Mínimo 8 caracteres.</div>
          </div>
          <div className="field">
            <label htmlFor="confirm">Repetí la contraseña</label>
            <input
              id="confirm"
              type="password"
              className="input"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={hasSession === false}
            />
          </div>
          {error && <p style={{ fontSize: 13, color: "#C97B85", margin: 0 }}>{error}</p>}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || hasSession === false}
          >
            {loading ? "Guardando…" : "Guardar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
