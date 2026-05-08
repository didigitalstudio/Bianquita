// Componentes compartidos
const { useState, useEffect, useRef, useMemo } = React;

const fmt = (n) => "$" + Number(n).toLocaleString("es-AR", { maximumFractionDigits: 0 });

// === Iconos minimalistas ===
const Icon = ({ name, size = 20, stroke = 1.6 }) => {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "search": return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "bag": return <svg {...props}><path d="M5 7h14l-1 13H6L5 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>;
    case "user": return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>;
    case "heart": return <svg {...props}><path d="M12 20s-7-4.5-9.5-9A5 5 0 0 1 12 6.5 5 5 0 0 1 21.5 11C19 15.5 12 20 12 20Z"/></svg>;
    case "menu": return <svg {...props}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case "x": return <svg {...props}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "plus": return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "minus": return <svg {...props}><path d="M5 12h14"/></svg>;
    case "arrow-right": return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "arrow-left": return <svg {...props}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>;
    case "chevron-down": return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case "chevron-right": return <svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case "check": return <svg {...props}><path d="m5 12 5 5 9-11"/></svg>;
    case "filter": return <svg {...props}><path d="M3 6h18M6 12h12M10 18h4"/></svg>;
    case "truck": return <svg {...props}><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>;
    case "shield": return <svg {...props}><path d="M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6l-8-3Z"/></svg>;
    case "gift": return <svg {...props}><path d="M3 11h18v10H3zM12 11v10M3 7h18v4H3zM12 7s-3-4-5-3-1 3 1 3M12 7s3-4 5-3 1 3-1 3"/></svg>;
    case "sparkle": return <svg {...props}><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></svg>;
    case "trash": return <svg {...props}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>;
    case "edit": return <svg {...props}><path d="M4 20h4l10-10-4-4L4 16v4Z"/><path d="m13 6 4 4"/></svg>;
    case "eye": return <svg {...props}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "box": return <svg {...props}><path d="M3 7l9-4 9 4-9 4-9-4ZM3 7v10l9 4 9-4V7M12 11v10"/></svg>;
    case "mail": return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
    case "phone": return <svg {...props}><path d="M5 4h4l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>;
    case "instagram": return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>;
    case "whatsapp": return <svg {...props}><path d="M3 21l1.6-5A8 8 0 1 1 8 19l-5 2Z"/><path d="M9 10c0 4 3 6 5 6l1-2-2-1-1 1c-1 0-2-1-2-2l1-1-1-2-2 1Z"/></svg>;
    case "map": return <svg {...props}><path d="M12 22s-7-7-7-13a7 7 0 0 1 14 0c0 6-7 13-7 13Z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case "home": return <svg {...props}><path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9Z"/></svg>;
    case "grid": return <svg {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
    case "list": return <svg {...props}><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>;
    case "trend": return <svg {...props}><path d="M3 17l6-6 4 4 8-8M14 7h7v7"/></svg>;
    case "card": return <svg {...props}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 11h18"/></svg>;
    case "bank": return <svg {...props}><path d="M3 9l9-5 9 5M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18"/></svg>;
    case "clock": return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "star": return <svg {...props}><path d="M12 4l2.5 5.2 5.5.8-4 4 1 5.5L12 17l-5 2.5 1-5.5-4-4 5.5-.8L12 4Z"/></svg>;
    case "logout": return <svg {...props}><path d="M9 4H5v16h4M16 12H9M14 8l4 4-4 4"/></svg>;
    case "tag": return <svg {...props}><path d="M3 12V3h9l9 9-9 9-9-9Z"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/></svg>;
    default: return null;
  }
};

// === Logo ===
const Logo = ({ size = "md", inverted = false }) => {
  const cls = size === "lg" ? "logo-img-lg" : size === "sm" ? "logo-img-sm" : "logo-img";
  return <img src="assets/logo.png" alt="Unilubi Kids" className={cls} style={{ filter: inverted ? "brightness(0) invert(1)" : "none" }} />;
};

// === Decorative dots like logo === 
const LogoDots = ({ children, color = "var(--brand)" }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 12, color }}>
    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }}/>
    <span>{children}</span>
    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }}/>
  </span>
);

// === NAVBAR ===
const Navbar = ({ route, navigate, cart, openCart, openMenu, openSearch, isAdmin }) => {
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(251, 248, 242, 0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--line-soft)" }}>
      <div style={{ background: "var(--ink)", color: "var(--paper)", padding: "8px 0", fontSize: 12, textAlign: "center", letterSpacing: "0.04em" }}>
        <span style={{ opacity: 0.85 }}>✦ Envío gratis a todo el país en compras superiores a $35.000 ✦</span>
      </div>
      <div className="container-wide" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flex: 1 }}>
          <button className="btn-icon" onClick={openMenu} aria-label="Menú" style={{ marginLeft: -8 }}>
            <Icon name="menu" size={22} />
          </button>
          <nav style={{ display: "flex", gap: 22, fontSize: 14, fontWeight: 500 }}>
            <button onClick={() => navigate("shop", { audience: "recien-nacido" })} style={{ color: route.audience === "recien-nacido" ? "var(--brand)" : "inherit" }}>Recién nacido</button>
            <button onClick={() => navigate("shop", { audience: "bebe" })} style={{ color: route.audience === "bebe" ? "var(--brand)" : "inherit" }}>Bebé</button>
            <button onClick={() => navigate("shop", { audience: "nino" })} style={{ color: route.audience === "nino" ? "var(--brand)" : "inherit" }}>Niño/a</button>
            <button onClick={() => navigate("shop", { tag: "oferta" })} style={{ color: "var(--brand)" }}>Ofertas</button>
          </nav>
        </div>
        <button onClick={() => navigate("home")} style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <Logo />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", flex: 1 }}>
          <button className="btn-icon" onClick={openSearch} aria-label="Buscar"><Icon name="search" size={20}/></button>
          <button className="btn-icon" onClick={() => navigate(isAdmin ? "admin" : "account")} aria-label="Cuenta"><Icon name="user" size={20}/></button>
          <button className="btn-icon" onClick={openCart} aria-label="Carrito" style={{ position: "relative" }}>
            <Icon name="bag" size={20}/>
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: 4, right: 4, background: "var(--brand)", color: "#fff", fontSize: 10, fontWeight: 700, minWidth: 16, height: 16, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

// === SIDE MENU ===
const SideMenu = ({ open, onClose, navigate }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(43, 35, 29, 0.4)", zIndex: 100, animation: "fadeIn .2s" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 380, maxWidth: "90vw", height: "100%", background: "var(--paper)", padding: "32px 32px 24px", display: "flex", flexDirection: "column", animation: "slideRight .3s ease-out" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <Logo size="sm"/>
          <button className="btn-icon" onClick={onClose}><Icon name="x"/></button>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {[
            { l: "Inicio", to: "home" },
            { l: "Recién nacido", to: "shop", p: { audience: "recien-nacido" } },
            { l: "Bebé", to: "shop", p: { audience: "bebe" } },
            { l: "Niño/a", to: "shop", p: { audience: "nino" } },
            { l: "Todos los productos", to: "shop" },
            { l: "Ofertas", to: "shop", p: { tag: "oferta" } },
          ].map((it) => (
            <button key={it.l} onClick={() => { navigate(it.to, it.p); onClose(); }} style={{ textAlign: "left", padding: "14px 0", fontSize: 22, fontFamily: "var(--font-display)", borderBottom: "1px solid var(--line-soft)" }}>
              {it.l}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
          {[
            { l: "Mi cuenta", to: "account" },
            { l: "Envíos", to: "shipping" },
            { l: "Preguntas frecuentes", to: "faq" },
            { l: "Contacto", to: "contact" },
            { l: "Admin", to: "admin" },
          ].map((it) => (
            <button key={it.l} onClick={() => { navigate(it.to); onClose(); }} style={{ textAlign: "left", padding: "6px 0", color: "var(--ink-soft)", fontSize: 14 }}>
              {it.l} →
            </button>
          ))}
        </div>
      </div>
      <style>{`@keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
};

// === FOOTER ===
const Footer = ({ navigate }) => (
  <footer style={{ background: "var(--ink)", color: "var(--paper)", marginTop: 80 }}>
    <div className="container-wide" style={{ padding: "64px 24px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
        <div>
          <Logo inverted/>
          <p style={{ marginTop: 20, color: "rgba(245, 239, 230, 0.65)", fontSize: 14, lineHeight: 1.6, maxWidth: 320 }}>
            Indumentaria infantil pensada con ternura y materiales nobles. Diseñamos para que las infancias sean libres, suaves y memorables.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <a href="#" className="btn-icon" style={{ background: "rgba(255,255,255,0.06)" }}><Icon name="instagram" size={18}/></a>
            <a href="#" className="btn-icon" style={{ background: "rgba(255,255,255,0.06)" }}><Icon name="whatsapp" size={18}/></a>
            <a href="#" className="btn-icon" style={{ background: "rgba(255,255,255,0.06)" }}><Icon name="mail" size={18}/></a>
          </div>
        </div>
        <FooterCol title="Tienda" items={[
          ["Recién nacido", () => navigate("shop", { audience: "recien-nacido" })],
          ["Bebé", () => navigate("shop", { audience: "bebe" })],
          ["Niño/a", () => navigate("shop", { audience: "nino" })],
          ["Ofertas", () => navigate("shop", { tag: "oferta" })],
        ]}/>
        <FooterCol title="Ayuda" items={[
          ["Envíos", () => navigate("shipping")],
          ["Preguntas frecuentes", () => navigate("faq")],
          ["Contacto", () => navigate("contact")],
          ["Mi cuenta", () => navigate("account")],
        ]}/>
        <FooterCol title="Empresa" items={[
          ["Sobre nosotros", () => navigate("home")],
          ["Mayorista", () => navigate("contact")],
          ["Términos", () => {}],
          ["Privacidad", () => {}],
        ]}/>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "rgba(245, 239, 230, 0.5)" }}>
        <div>© 2026 Unilubi Kids · Buenos Aires, Argentina</div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span>Pagos seguros</span>
          <div style={{ display: "flex", gap: 6 }}>
            {["Visa", "Mastercard", "Amex", "Naranja"].map(p => (
              <span key={p} style={{ padding: "4px 10px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, fontSize: 10, letterSpacing: "0.04em" }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

const FooterCol = ({ title, items }) => (
  <div>
    <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245, 239, 230, 0.5)", marginBottom: 18, fontWeight: 600 }}>{title}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map(([label, action]) => (
        <button key={label} onClick={action} style={{ textAlign: "left", color: "rgba(245, 239, 230, 0.85)", fontSize: 14 }}>{label}</button>
      ))}
    </div>
  </div>
);

// === Toast ===
const Toast = ({ msg }) => msg ? <div className="toast">{msg}</div> : null;

// === Empty state ===
const EmptyState = ({ icon, title, body, cta }) => (
  <div style={{ textAlign: "center", padding: "64px 24px", maxWidth: 420, margin: "0 auto" }}>
    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "var(--brand)" }}>
      <Icon name={icon} size={28}/>
    </div>
    <div className="h3" style={{ marginBottom: 8 }}>{title}</div>
    <p className="muted" style={{ fontSize: 14, marginBottom: 20 }}>{body}</p>
    {cta}
  </div>
);

// Helper SVG image with brand-tinted gradient as fallback
const ProductImage = ({ src, alt, label }) => {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--brand-soft), var(--cream-2))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-deep)", fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label || "imagen"}
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setErrored(true)}/>;
};

Object.assign(window, { Icon, Logo, LogoDots, Navbar, SideMenu, Footer, FooterCol, Toast, EmptyState, ProductImage, fmt });
