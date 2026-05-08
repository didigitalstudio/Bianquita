import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import ProductCard from "@/components/shop/ProductCard";
import { listProducts } from "@/lib/data/products";

export default async function HomePage() {
  const products = await listProducts();
  const featured = products.filter((p) => p.tags.includes("best-seller")).slice(0, 4);
  const fresh = products.filter((p) => p.tags.includes("nuevo")).slice(0, 4);

  return (
    <div className="fade-in">
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--cream)", padding: "80px 0 100px" }}>
        <div style={{ position: "absolute", top: 80, right: -60, width: 260, height: 260, borderRadius: "50%", background: "var(--brand-soft)", opacity: 0.5, filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: 40, left: -80, width: 220, height: 220, borderRadius: "50%", background: "rgba(156, 168, 136, 0.3)", filter: "blur(50px)" }} />
        <div className="container-wide hero-grid" style={{ position: "relative" }}>
          <div>
            <div style={{ marginBottom: 24 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 12, color: "var(--brand)" }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }} />
                <span>Otoño / Invierno 26 ya en la web</span>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }} />
              </span>
            </div>
            <h1 className="h1" style={{ marginBottom: 24 }}>
              Diseño para<br />
              <span style={{ fontStyle: "italic", color: "var(--brand)" }}>chicos que</span><br />
              ya tienen onda.
            </h1>
            <p style={{ fontSize: 18, color: "var(--ink-soft)", maxWidth: 480, marginBottom: 36, lineHeight: 1.6 }}>
              Indumentaria infantil de diseño argentino. Materiales cuidados, cortes que duran y una colección que cambia cada temporada.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/tienda" className="btn btn-primary btn-lg">
                Quiero verla toda <Icon name="arrow-right" size={18} />
              </Link>
              <Link href="/tienda?tag=nuevo" className="btn btn-ghost btn-lg">Nuevos ingresos</Link>
            </div>
            <div style={{ marginTop: 48, display: "flex", gap: 32, color: "var(--ink-soft)", fontSize: 13, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="truck" size={18} /> Envío gratis +$35.000</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="card" size={18} /> 6 cuotas sin interés</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="bank" size={18} /> 20% off por transferencia</div>
            </div>
          </div>
          <div style={{ position: "relative", aspectRatio: "4/5", borderRadius: 28, overflow: "hidden" }}>
            <Image src="https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=900&q=80" alt="Hero Unilubi Kids" fill style={{ objectFit: "cover" }} sizes="50vw" priority />
            <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, background: "rgba(251, 248, 242, 0.94)", backdropFilter: "blur(8px)", borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--brand)", fontWeight: 700, letterSpacing: "0.15em" }}>EL FAVORITO DEL FRÍO</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, marginTop: 2 }}>Mameluco abrigadito</div>
              </div>
              <Link href="/producto/p9" className="btn btn-dark btn-sm">Ver →</Link>
            </div>
            <div style={{ position: "absolute", top: 20, right: 20, width: 76, height: 76, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", fontFamily: "var(--font-display)" }}>
              <div style={{ fontSize: 22 }}>-15%</div>
              <div style={{ fontSize: 9, letterSpacing: "0.1em" }}>OFERTA</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMO STRIP */}
      <section style={{ background: "var(--paper)", borderTop: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)" }}>
        <div className="container-wide promo-grid">
          {[
            { icon: "truck", title: "Envío gratis", sub: "Superando los $35.000" },
            { icon: "bank", title: "20% off transferencia", sub: "Descuento automático" },
            { icon: "card", title: "6 cuotas sin interés", sub: "Con todas las tarjetas" },
            { icon: "gift", title: "Cambios sin drama", sub: "Tenés 30 días" },
          ].map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 16px", borderRight: i < 3 ? "1px solid var(--line-soft)" : "none" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)", flexShrink: 0 }}>
                <Icon name={it.icon} size={18} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{it.title}</div>
                <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>{it.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES BANNER */}
      <section style={{ padding: "72px 0 24px" }}>
        <div className="container-wide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>· Por edad ·</div>
              <h2 className="h2">Comprá por etapa</h2>
            </div>
            <Link href="/tienda" className="btn-link">Ver todo →</Link>
          </div>
          <div className="cat-grid-4">
            {[
              { id: "recien-nacido", title: "Recién nacido", sub: "0 a 3 meses", img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80", href: "/tienda?audience=recien-nacido" },
              { id: "bebe", title: "Bebé", sub: "3 a 24 meses", img: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80", href: "/tienda?audience=bebe" },
              { id: "nino", title: "Niño/a", sub: "2 a 6 años", img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80", href: "/tienda?audience=nino" },
              { id: "regalo", title: "Para regalar", sub: "Sets listos para envolver", img: "https://images.unsplash.com/photo-1544487102-26142b0e4f63?w=600&q=80", href: "/tienda?tag=regalo" },
            ].map((c) => (
              <Link key={c.id} href={c.href} style={{ display: "block", borderRadius: 22, overflow: "hidden", position: "relative", aspectRatio: "3/4" }}>
                <Image src={c.img} alt={c.title} fill style={{ objectFit: "cover", mixBlendMode: "multiply", opacity: 0.85 }} sizes="25vw" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(43,35,29,0.5))" }} />
                <div style={{ position: "absolute", bottom: 18, left: 18, right: 18, color: "#fff" }}>
                  <div className="h3" style={{ color: "#fff" }}>{c.title}</div>
                  <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{c.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CÁPSULAS */}
      <section style={{ padding: "48px 0 32px" }}>
        <div className="container-wide">
          <div style={{ marginBottom: 32 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>· Cápsulas ·</div>
            <h2 className="h2">Colecciones que vas a amar</h2>
          </div>
          <div className="capsule-grid">
            <Link href="/tienda?audience=recien-nacido" style={{ borderRadius: 22, overflow: "hidden", position: "relative", textAlign: "left", gridRow: "span 2", display: "block" }}>
              <Image src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=900&q=80" alt="Cápsula recién nacido" fill style={{ objectFit: "cover" }} sizes="40vw" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(43,35,29,0.1) 30%, rgba(43,35,29,0.7))" }} />
              <div style={{ position: "absolute", bottom: 28, left: 28, right: 28, color: "#fff" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", marginBottom: 8, opacity: 0.8 }}>CÁPSULA</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 38, lineHeight: 1.1, marginBottom: 8 }}>Bienvenida<br /><i>al mundo</i> 🍼</div>
                <p style={{ fontSize: 14, opacity: 0.85, maxWidth: 280, marginBottom: 14 }}>Ajuares, gorritos y todo lo que necesitás para los primeros días.</p>
                <span style={{ fontSize: 13, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.5)", paddingBottom: 2 }}>Explorar cápsula →</span>
              </div>
            </Link>
            {[
              { title: "Mundial 26", emoji: "⚽", desc: "Para que alienten desde la cuna", img: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&q=80", href: "/tienda?tag=best-seller" },
              { title: "Outlet", emoji: "💸", desc: "Hasta 40% off en talles seleccionados", img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80", href: "/tienda?tag=oferta" },
              { title: "Para regalar", emoji: "🎁", desc: "Sets envueltos, listos para sorprender", img: "https://images.unsplash.com/photo-1544487102-26142b0e4f63?w=600&q=80", href: "/tienda?tag=regalo" },
              { title: "Pijama party", emoji: "☾", desc: "Modal premium para una buena noche", img: "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600&q=80", href: "/tienda?audience=nino" },
            ].map((c, i) => (
              <Link key={i} href={c.href} style={{ borderRadius: 22, overflow: "hidden", position: "relative", textAlign: "left", display: "block", minHeight: 220 }}>
                <Image src={c.img} alt={c.title} fill style={{ objectFit: "cover" }} sizes="30vw" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(43,35,29,0.05) 40%, rgba(43,35,29,0.75))" }} />
                <div style={{ position: "absolute", bottom: 18, left: 18, right: 18, color: "#fff" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.1 }}>{c.title} <span style={{ fontStyle: "normal" }}>{c.emoji}</span></div>
                  <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{c.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section style={{ padding: "64px 0" }}>
        <div className="container-wide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>· Las mamás los aman ·</div>
              <h2 className="h2">Más vendidos</h2>
            </div>
            <Link href="/tienda" className="btn-link">Ver todo →</Link>
          </div>
          <div className="product-grid-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section style={{ padding: "32px 0", background: "var(--ink)", color: "var(--paper)", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 64, animation: "marquee 30s linear infinite", whiteSpace: "nowrap" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: "flex", gap: 64, fontFamily: "var(--font-display)", fontSize: 28, fontStyle: "italic", alignItems: "center" }}>
              <span>Curaduría con amor</span><span style={{ opacity: 0.4 }}>✦</span>
              <span>Marcas de confianza</span><span style={{ opacity: 0.4 }}>✦</span>
              <span>Atención cercana</span><span style={{ opacity: 0.4 }}>✦</span>
              <span>Envíos a todo el país</span><span style={{ opacity: 0.4 }}>✦</span>
            </div>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </section>

      {/* EDITORIAL SPLIT */}
      <section style={{ padding: "96px 0" }}>
        <div className="container-wide editorial-split">
          <div style={{ aspectRatio: "1/1", borderRadius: 22, overflow: "hidden", background: "var(--cream)", position: "relative" }}>
            <Image src="https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=900&q=80" alt="Nosotros" fill style={{ objectFit: "cover" }} sizes="50vw" />
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>· Quiénes somos ·</div>
            <h2 className="h2" style={{ marginBottom: 24 }}>Mamás eligiendo para mamás.</h2>
            <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 16 }}>
              Unilubi nació de las ganas de tener un lugar donde encontrar ropita linda, rica al tacto y bien hecha, sin recorrer mil tiendas. Probamos cada prenda antes de subirla: si no nos la pondríamos a nuestros hijos, no entra.
            </p>
            <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 32 }}>
              Trabajamos con marcas argentinas que cuidan los materiales y los detalles. Te armamos una selección curada para que elegir sea fácil, y estamos del otro lado para ayudarte con cualquier duda. 🤍
            </p>
            <Link href="/contacto" className="btn btn-ghost">Conocenos →</Link>
          </div>
        </div>
      </section>

      {/* NEW IN */}
      <section style={{ padding: "32px 0 96px", background: "var(--cream)" }}>
        <div className="container-wide" style={{ paddingTop: 64 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>· Recién bajado del taller ·</div>
              <h2 className="h2">Nuevos ingresos</h2>
            </div>
            <Link href="/tienda?tag=nuevo" className="btn-link">Ver todo →</Link>
          </div>
          <div className="product-grid-4">
            {fresh.map((p) => <ProductCard key={p.id} product={p} bg="#fff" />)}
          </div>
        </div>
      </section>

      {/* INSTAGRAM STRIP */}
      <section style={{ padding: "80px 0" }}>
        <div className="container-wide" style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>· Comunidad ·</div>
          <h2 className="h2" style={{ marginBottom: 8 }}>@unilubikids</h2>
          <p className="muted">Etiquetanos y mostranos cómo viven nuestras prendas. ¡Nos encanta verlos!</p>
        </div>
        <div className="insta-grid">
          {[
            "https://images.unsplash.com/photo-1503944168849-8bf86875b08e?w=400&q=80",
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80",
            "https://images.unsplash.com/photo-1544487102-26142b0e4f63?w=400&q=80",
            "https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=400&q=80",
            "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&q=80",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80",
          ].map((src, i) => (
            <a key={i} href="https://instagram.com/unilubikids" target="_blank" rel="noopener noreferrer" style={{ aspectRatio: "1/1", overflow: "hidden", position: "relative", display: "block" }}>
              <Image src={src} alt="Instagram Unilubi Kids" fill style={{ objectFit: "cover", transition: "transform .4s" }} sizes="17vw" />
              <Icon name="instagram" size={20} className="insta-icon" />
            </a>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding: "0 24px 80px" }}>
        <div className="container" style={{ background: "var(--brand-soft)", borderRadius: 28, padding: "64px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(181, 102, 61, 0.2)" }} />
          <div style={{ position: "absolute", bottom: -60, left: -40, width: 240, height: 240, borderRadius: "50%", background: "rgba(156, 168, 136, 0.25)" }} />
          <div style={{ position: "relative", maxWidth: 540, margin: "0 auto" }}>
            <div className="eyebrow" style={{ color: "var(--brand-deep)", marginBottom: 12 }}>· Newsletter ·</div>
            <h2 className="h2" style={{ marginBottom: 16 }}>Llevate 10% off en tu primera compra 🎁</h2>
            <p className="soft" style={{ marginBottom: 28 }}>Suscribite y enterate primero de novedades, drops y descuentos exclusivos.</p>
            <div style={{ display: "flex", gap: 8, maxWidth: 460, margin: "0 auto" }}>
              <input className="input" placeholder="tu@email.com" style={{ flex: 1, background: "rgba(255,255,255,0.8)" }} />
              <button className="btn btn-dark">Sumarme</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
