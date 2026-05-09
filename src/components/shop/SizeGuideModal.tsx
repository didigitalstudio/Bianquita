"use client";

import { useEffect } from "react";
import Icon from "@/components/ui/Icon";

interface Props {
  open: boolean;
  onClose: () => void;
  audience: string; // Product audience id ("bebe", "recien-nacido", "nino", …)
}

const BEBE_TABLE: Array<{ size: string; weight: string; height: string }> = [
  { size: "RN",     weight: "2.5 - 3.5 kg", height: "Hasta 50 cm" },
  { size: "0-3M",   weight: "3.5 - 6 kg",   height: "50 - 62 cm" },
  { size: "3-6M",   weight: "6 - 8 kg",     height: "62 - 68 cm" },
  { size: "6-9M",   weight: "8 - 9 kg",     height: "68 - 74 cm" },
  { size: "9-12M",  weight: "9 - 10 kg",    height: "74 - 80 cm" },
  { size: "12-18M", weight: "10 - 11 kg",   height: "80 - 86 cm" },
  { size: "18-24M", weight: "11 - 12 kg",   height: "86 - 92 cm" },
];

const NINO_TABLE: Array<{ size: string; age: string; height: string }> = [
  { size: "2",  age: "2 años",  height: "86 - 92 cm" },
  { size: "4",  age: "3-4 años", height: "98 - 104 cm" },
  { size: "6",  age: "5-6 años", height: "110 - 116 cm" },
  { size: "8",  age: "7-8 años", height: "122 - 128 cm" },
  { size: "10", age: "9-10 años", height: "134 - 140 cm" },
  { size: "12", age: "11-12 años", height: "146 - 152 cm" },
];

export default function SizeGuideModal({ open, onClose, audience }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const showNino = audience === "nino";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(43, 35, 29, 0.45)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn .2s" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 560, maxHeight: "calc(100vh - 48px)", overflowY: "auto", background: "var(--paper)", borderRadius: 18, padding: 28, position: "relative" }}
      >
        <button
          className="btn-icon"
          onClick={onClose}
          aria-label="Cerrar guía de talles"
          style={{ position: "absolute", top: 14, right: 14 }}
        >
          <Icon name="x" />
        </button>
        <h2 id="size-guide-title" className="h3" style={{ marginBottom: 6 }}>Guía de talles</h2>
        <p className="muted" style={{ fontSize: 13, marginBottom: 20 }}>
          Las medidas son orientativas. Si tu peque está entre dos talles, recomendamos elegir el más grande.
        </p>

        {showNino ? (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)", textAlign: "left" }}>
                <th style={{ padding: "10px 8px", fontSize: 12, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Talle</th>
                <th style={{ padding: "10px 8px", fontSize: 12, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Edad</th>
                <th style={{ padding: "10px 8px", fontSize: 12, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Altura</th>
              </tr>
            </thead>
            <tbody>
              {NINO_TABLE.map((row) => (
                <tr key={row.size} style={{ borderBottom: "1px solid var(--line-soft)" }}>
                  <td style={{ padding: "10px 8px", fontWeight: 700, color: "var(--brand)" }}>{row.size}</td>
                  <td style={{ padding: "10px 8px" }}>{row.age}</td>
                  <td style={{ padding: "10px 8px" }}>{row.height}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)", textAlign: "left" }}>
                <th style={{ padding: "10px 8px", fontSize: 12, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Talle</th>
                <th style={{ padding: "10px 8px", fontSize: 12, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Peso</th>
                <th style={{ padding: "10px 8px", fontSize: 12, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Altura</th>
              </tr>
            </thead>
            <tbody>
              {BEBE_TABLE.map((row) => (
                <tr key={row.size} style={{ borderBottom: "1px solid var(--line-soft)" }}>
                  <td style={{ padding: "10px 8px", fontWeight: 700, color: "var(--brand)" }}>{row.size}</td>
                  <td style={{ padding: "10px 8px" }}>{row.weight}</td>
                  <td style={{ padding: "10px 8px" }}>{row.height}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p className="muted" style={{ fontSize: 12, marginTop: 20 }}>
          ¿Dudas? Escribinos por WhatsApp y te ayudamos a elegir.
        </p>
      </div>
    </div>
  );
}
