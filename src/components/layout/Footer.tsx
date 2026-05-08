import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer style={{ background: "var(--ink)", color: "var(--paper)", marginTop: 80 }}>
      <div className="container-wide" style={{ padding: "64px 24px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <Logo inverted />
            <p style={{ marginTop: 20, color: "rgba(245, 239, 230, 0.65)", fontSize: 14, lineHeight: 1.6, maxWidth: 320 }}>
              Indumentaria infantil de diseño argentino. Materiales de calidad, colecciones de temporada y envíos a todo el país.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <a href="https://instagram.com/unilubikids" target="_blank" rel="noopener noreferrer" className="btn-icon" style={{ background: "rgba(255,255,255,0.06)", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%" }}><Icon name="instagram" size={18} /></a>
              <a href="https://wa.me/5491151198327" target="_blank" rel="noopener noreferrer" className="btn-icon" style={{ background: "rgba(255,255,255,0.06)", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%" }}><Icon name="whatsapp" size={18} /></a>
              <a href="mailto:hola@unilubikids.com.ar" className="btn-icon" style={{ background: "rgba(255,255,255,0.06)", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%" }}><Icon name="mail" size={18} /></a>
            </div>
          </div>
          <FooterCol title="Tienda" items={[
            ["Recién nacido", "/tienda?audience=recien-nacido"],
            ["Bebé", "/tienda?audience=bebe"],
            ["Niño/a", "/tienda?audience=nino"],
            ["Ofertas", "/tienda?tag=oferta"],
          ]} />
          <FooterCol title="Ayuda" items={[
            ["Envíos", "/envios"],
            ["Preguntas frecuentes", "/faq"],
            ["Contacto", "/contacto"],
            ["Mi cuenta", "/cuenta"],
          ]} />
          <FooterCol title="Empresa" items={[
            ["Mayorista", "/contacto"],
          ]} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "rgba(245, 239, 230, 0.5)" }}>
          <div>© 2026 Unilubi Kids · Buenos Aires, Argentina</div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span>Pagos seguros</span>
            <div style={{ display: "flex", gap: 6 }}>
              {["Visa", "Mastercard", "Amex", "Naranja"].map((p) => (
                <span key={p} style={{ padding: "4px 10px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, fontSize: 10, letterSpacing: "0.04em" }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245, 239, 230, 0.5)", marginBottom: 18, fontWeight: 600 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map(([label, href]) => (
          <Link key={label} href={href} style={{ color: "rgba(245, 239, 230, 0.85)", fontSize: 14 }}>{label}</Link>
        ))}
      </div>
    </div>
  );
}
