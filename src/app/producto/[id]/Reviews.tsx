"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import type { ReviewsSummary } from "@/lib/data/reviews";

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2, color: "var(--brand)" }} aria-label={`${value.toFixed(1)} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name="star" size={size} className={value >= n ? "" : "muted"} />
      ))}
    </span>
  );
}

export default function Reviews({ productId, summary, isLoggedIn }: { productId: string; summary: ReviewsSummary; isLoggedIn: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/cuenta/login?next=" + encodeURIComponent(`/producto/${productId}`));
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No pudimos guardar tu reseña");
        setPending(false);
        return;
      }
      router.refresh();
      setOpen(false);
      setTitle("");
      setText("");
    } catch {
      setError("Error de conexión");
      setPending(false);
    }
  };

  const heading = summary.count === 0
    ? "Aún no hay reseñas"
    : `${summary.average.toFixed(1)} · ${summary.count} ${summary.count === 1 ? "reseña" : "reseñas"}`;

  return (
    <section style={{ padding: "0 0 80px" }}>
      <div className="container" style={{ maxWidth: 880 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h2 className="h3" style={{ marginBottom: 4 }}>{heading}</h2>
            {summary.count > 0 && <Stars value={summary.average} />}
          </div>
          <button className="btn btn-ghost" onClick={() => setOpen((v) => !v)}>
            {open ? "Cancelar" : isLoggedIn ? "Dejar reseña" : "Iniciá sesión para reseñar"}
          </button>
        </div>

        {open && (
          <form onSubmit={submit} className="card" style={{ padding: 20, marginBottom: 20 }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Tu puntaje</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} estrellas`} style={{ padding: 4, color: rating >= n ? "var(--brand)" : "var(--ink-mute)" }}>
                    <Icon name="star" size={22} />
                  </button>
                ))}
              </div>
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label htmlFor="r-title">Título (opcional)</label>
              <input id="r-title" className="input" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label htmlFor="r-text">Tu reseña</label>
              <textarea id="r-text" className="textarea" maxLength={2000} value={text} onChange={(e) => setText(e.target.value)} rows={4} />
            </div>
            {error && <p style={{ color: "#a55", fontSize: 13, margin: "0 0 12px" }}>{error}</p>}
            <button className="btn btn-primary" disabled={pending}>{pending ? "Guardando…" : "Publicar reseña"}</button>
          </form>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {summary.reviews.map((r) => (
            <article key={r.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.author_name}</div>
                  <Stars value={r.rating} />
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>
                  {new Date(r.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
              </div>
              {r.title && <div style={{ fontWeight: 600, marginBottom: 4 }}>{r.title}</div>}
              {r.body && <p style={{ color: "var(--ink-soft)", margin: 0 }}>{r.body}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
