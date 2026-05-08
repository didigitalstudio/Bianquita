import Icon from "@/components/ui/Icon";

export default function EnviosPage() {
  return (
    <div className="fade-in">
      <section style={{ padding: "64px 0 32px", background: "var(--cream)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>· Envíos ·</div>
          <h1 className="h1" style={{ fontSize: "clamp(36px, 5vw, 56px)", marginBottom: 16 }}>Llegamos a tu puerta</h1>
          <p className="soft" style={{ fontSize: 17 }}>Despachos a todo el país en 24-48hs hábiles.</p>
        </div>
      </section>
      <section style={{ padding: "48px 0 32px" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { icon: "truck", title: "Andreani a domicilio", desc: "Llega a tu casa en 3 a 5 días hábiles. Recibís un código de seguimiento por mail.", price: "Desde $5.400" },
              { icon: "box", title: "Andreani sucursal", desc: "Retirá en la sucursal más cercana en 2 a 4 días hábiles.", price: "Desde $3.800" },
              { icon: "map", title: "Cadetería local", desc: "Solo CABA y GBA. Hoy mismo o al día siguiente, según horario.", price: "$2.500" },
            ].map((o) => (
              <div key={o.title} className="card" style={{ padding: 28 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--brand-soft)", color: "var(--brand-deep)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon name={o.icon} size={26} />
                </div>
                <div className="h3" style={{ marginBottom: 8 }}>{o.title}</div>
                <p style={{ color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{o.desc}</p>
                <div style={{ fontWeight: 700, color: "var(--brand)" }}>{o.price}</div>
              </div>
            ))}
          </div>
          <div className="card-soft" style={{ padding: 32, marginTop: 32, display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="gift" size={28} />
            </div>
            <div>
              <div className="h3" style={{ marginBottom: 4 }}>Envío gratis desde $35.000</div>
              <p className="muted" style={{ margin: 0 }}>Aplicado automáticamente al checkout · Envíos por Andreani estándar.</p>
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: "48px 0 80px" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 className="h2" style={{ marginBottom: 20 }}>Tiempos por zona</h2>
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden" }}>
            {[
              ["CABA y GBA", "Hoy o 24-48 hs", "$2.500 - $4.200"],
              ["Buenos Aires (interior)", "2-4 días hábiles", "$3.800 - $5.400"],
              ["Centro y Cuyo", "3-5 días hábiles", "$4.800 - $6.200"],
              ["Norte y Patagonia", "5-7 días hábiles", "$5.800 - $7.400"],
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", padding: "16px 24px", borderTop: i ? "1px solid var(--line-soft)" : "none", fontSize: 14 }}>
                <span style={{ fontWeight: 600 }}>{row[0]}</span>
                <span style={{ color: "var(--ink-soft)" }}>{row[1]}</span>
                <span style={{ textAlign: "right", fontWeight: 600, color: "var(--brand)" }}>{row[2]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
