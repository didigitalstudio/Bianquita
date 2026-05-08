// === HOME PAGE ===

const Home = ({ navigate, products, addToCart }) => {
  const featured = products.filter(p => p.tags.includes("best-seller")).slice(0, 4);
  const fresh = products.filter(p => p.tags.includes("nuevo")).slice(0, 4);

  return (
    <div className="fade-in">
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--cream)", padding: "80px 0 100px" }}>
        <div style={{ position: "absolute", top: 80, right: -60, width: 260, height: 260, borderRadius: "50%", background: "var(--brand-soft)", opacity: 0.5, filter: "blur(40px)" }}/>
        <div style={{ position: "absolute", bottom: 40, left: -80, width: 220, height: 220, borderRadius: "50%", background: "rgba(156, 168, 136, 0.3)", filter: "blur(50px)" }}/>
        <div className="container-wide" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ marginBottom: 24 }}>
              <LogoDots>Otoño / Invierno 26 ya en la web</LogoDots>
            </div>
            <h1 className="h1" style={{ marginBottom: 24 }}>
              Mimos<br/>
              <span style={{ fontStyle: "italic", color: "var(--brand)" }}>en cada</span> puntada,<br/>
              ternura en cada talle.
            </h1>
            <p style={{ fontSize: 18, color: "var(--ink-soft)", maxWidth: 480, marginBottom: 36, lineHeight: 1.6 }}>
              Ropita rica, suavecita y con onda para tus chiquitos. Seleccionamos las mejores marcas para que vistan suavecitos y a la moda. 🤍
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate("shop")}>
                Quiero verla toda <Icon name="arrow-right" size={18}/>
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => navigate("shop", { tag: "nuevo" })}>
                Nuevos ingresos
              </button>
            </div>
            <div style={{ marginTop: 48, display: "flex", gap: 32, color: "var(--ink-soft)", fontSize: 13, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="truck" size={18}/> Envío gratis +$35.000</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="card" size={18}/> 6 cuotas sin interés</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="bank" size={18}/> 20% off por transferencia</div>
            </div>
          </div>
          <div style={{ position: "relative", aspectRatio: "4/5", borderRadius: 28, overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=900&q=80" alt="Hero" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, background: "rgba(251, 248, 242, 0.94)", backdropFilter: "blur(8px)", borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--brand)", fontWeight: 700, letterSpacing: "0.15em" }}>EL FAVORITO DEL FRÍO</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, marginTop: 2 }}>Mameluco abrigadito</div>
              </div>
              <button className="btn btn-dark btn-sm" onClick={() => navigate("product", { id: "p9" })}>Ver →</button>
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
        <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", padding: "20px 24px" }}>
          {[
            { icon: "truck", title: "Envío gratis", sub: "Superando los $35.000" },
            { icon: "bank", title: "20% off transferencia", sub: "Descuento automático" },
            { icon: "card", title: "6 cuotas sin interés", sub: "Con todas las tarjetas" },
            { icon: "gift", title: "Cambios sin drama", sub: "Tenés 30 días" },
          ].map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 16px", borderRight: i < 3 ? "1px solid var(--line-soft)" : "none" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand)", flexShrink: 0 }}>
                <Icon name={it.icon} size={18}/>
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
            <button className="btn-link" onClick={() => navigate("shop")}>Ver todo →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { id: "recien-nacido", title: "Recién nacido", sub: "0 a 3 meses", img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80", color: "var(--brand-soft)" },
              { id: "bebe", title: "Bebé", sub: "3 a 24 meses", img: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80", color: "var(--cream-2)" },
              { id: "nino", title: "Niño/a", sub: "2 a 6 años", img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80", color: "rgba(156, 168, 136, 0.3)" },
              { id: "regalo", title: "Para regalar", sub: "Sets listos para envolver", img: "https://images.unsplash.com/photo-1544487102-26142b0e4f63?w=600&q=80", color: "rgba(217, 179, 162, 0.4)" },
            ].map((c, i) => (
              <button key={c.id} onClick={() => navigate("shop", c.id === "regalo" ? { tag: "regalo" } : { audience: c.id })} style={{ display: "block", borderRadius: 22, overflow: "hidden", background: c.color, position: "relative", aspectRatio: "3/4", textAlign: "left" }}>
                <img src={c.img} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply", opacity: 0.85 }}/>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(43,35,29,0.5))" }}/>
                <div style={{ position: "absolute", bottom: 18, left: 18, right: 18, color: "#fff" }}>
                  <div className="h3" style={{ color: "#fff" }}>{c.title}</div>
                  <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{c.sub}</div>
                </div>
              </button>
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
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 16, gridAutoRows: "minmax(220px, auto)" }}>
            <button onClick={() => navigate("shop", { audience: "recien-nacido" })} style={{ borderRadius: 22, overflow: "hidden", position: "relative", textAlign: "left", gridRow: "span 2", aspectRatio: "auto" }}>
              <img src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=900&q=80" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}/>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(43,35,29,0.1) 30%, rgba(43,35,29,0.7))" }}/>
              <div style={{ position: "absolute", bottom: 28, left: 28, right: 28, color: "#fff" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", marginBottom: 8, opacity: 0.8 }}>CÁPSULA</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 38, lineHeight: 1.1, marginBottom: 8 }}>Bienvenida<br/><i>al mundo</i> 🍼</div>
                <p style={{ fontSize: 14, opacity: 0.85, maxWidth: 280, marginBottom: 14 }}>Ajuares, gorritos y todo lo que necesitás para los primeros días.</p>
                <span style={{ fontSize: 13, fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.5)", paddingBottom: 2 }}>Explorar cápsula →</span>
              </div>
            </button>
            {[
              { title: "Mundial 26", emoji: "⚽", desc: "Para que alienten desde la cuna", img: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&q=80", route: { tag: "best-seller" } },
              { title: "Outlet", emoji: "💸", desc: "Hasta 40% off en talles seleccionados", img: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80", route: { tag: "oferta" } },
              { title: "Para regalar", emoji: "🎁", desc: "Sets envueltos, listos para sorprender", img: "https://images.unsplash.com/photo-1544487102-26142b0e4f63?w=600&q=80", route: { tag: "regalo" } },
              { title: "Pijama party", emoji: "☾", desc: "Modal suavecito para dormir rico", img: "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600&q=80", route: { audience: "nino" } },
            ].map((c, i) => (
              <button key={i} onClick={() => navigate("shop", c.route)} style={{ borderRadius: 22, overflow: "hidden", position: "relative", textAlign: "left" }}>
                <img src={c.img} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}/>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(43,35,29,0.05) 40%, rgba(43,35,29,0.75))" }}/>
                <div style={{ position: "absolute", bottom: 18, left: 18, right: 18, color: "#fff" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.1 }}>{c.title} <span style={{ fontStyle: "normal" }}>{c.emoji}</span></div>
                  <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{c.desc}</div>
                </div>
              </button>
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
            <button className="btn-link" onClick={() => navigate("shop")}>Ver todo →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {featured.map(p => <ProductCard key={p.id} product={p} navigate={navigate} addToCart={addToCart}/>)}
          </div>
        </div>
      </section>

      {/* MARQUEE / VALUES */}
      <section style={{ padding: "32px 0", background: "var(--ink)", color: "var(--paper)", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 64, animation: "marquee 30s linear infinite", whiteSpace: "nowrap" }}>
          {[1,2,3,4].map(i => (
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
        <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div style={{ aspectRatio: "1/1", borderRadius: 22, overflow: "hidden", background: "var(--cream)" }}>
            <img src="https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=900&q=80" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
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
            <button className="btn btn-ghost">Conocenos →</button>
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
            <button className="btn-link" onClick={() => navigate("shop", { tag: "nuevo" })}>Ver todo →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {fresh.map(p => <ProductCard key={p.id} product={p} navigate={navigate} addToCart={addToCart} bg="#fff"/>)}
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4 }}>
          {[
            "https://images.unsplash.com/photo-1503944168849-8bf86875b08e?w=400&q=80",
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80",
            "https://images.unsplash.com/photo-1544487102-26142b0e4f63?w=400&q=80",
            "https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=400&q=80",
            "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&q=80",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80",
          ].map((src, i) => (
            <div key={i} style={{ aspectRatio: "1/1", overflow: "hidden", position: "relative", cursor: "pointer" }}>
              <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }} onMouseOver={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}/>
              <Icon name="instagram" size={20} style={{ position: "absolute", top: 12, right: 12, color: "#fff", opacity: 0.7 }}/>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding: "0 24px 80px" }}>
        <div className="container" style={{ background: "var(--brand-soft)", borderRadius: 28, padding: "64px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(181, 102, 61, 0.2)" }}/>
          <div style={{ position: "absolute", bottom: -60, left: -40, width: 240, height: 240, borderRadius: "50%", background: "rgba(156, 168, 136, 0.25)" }}/>
          <div style={{ position: "relative", maxWidth: 540, margin: "0 auto" }}>
            <div className="eyebrow" style={{ color: "var(--brand-deep)", marginBottom: 12 }}>· Newsletter ·</div>
            <h2 className="h2" style={{ marginBottom: 16 }}>Llevate 10% off en tu primera compra 🎁</h2>
            <p className="soft" style={{ marginBottom: 28 }}>Suscribite y enterate primero de novedades, drops y descuentos exclusivos.</p>
            <div style={{ display: "flex", gap: 8, maxWidth: 460, margin: "0 auto" }}>
              <input className="input" placeholder="tu@email.com" style={{ flex: 1, background: "rgba(255,255,255,0.8)" }}/>
              <button className="btn btn-dark">Sumarme</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// === PRODUCT CARD con compra rápida ===
const ProductCard = ({ product, navigate, addToCart, bg }) => {
  const onSale = !!product.compareAt;
  const [hovering, setHovering] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const sizes = Object.keys(product.stock || {}).filter(s => product.stock[s] > 0);
  const transferPrice = Math.round(product.price * 0.8);
  const cuotaPrice = Math.round(product.price / 6);

  const quickAdd = (e, size) => {
    e.stopPropagation();
    addToCart({ id: product.id, name: product.name, price: product.price, img: product.img, size, color: product.colors[0] });
    setShowSizes(false);
  };

  return (
    <div className="product-card" style={bg ? { background: bg } : {}} onClick={() => navigate("product", { id: product.id })} onMouseEnter={() => setHovering(true)} onMouseLeave={() => { setHovering(false); setShowSizes(false); }}>
      <div className="img-wrap">
        <ProductImage src={product.img} alt={product.name} label={product.category}/>
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
          {product.tags.includes("nuevo") && <span className="badge badge-brand">Nuevo</span>}
          {onSale && <span className="badge badge-salvia">Oferta</span>}
        </div>
        <button onClick={(e) => { e.stopPropagation(); }} style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="heart" size={16}/>
        </button>

        {/* Quick add overlay */}
        {hovering && sizes.length > 0 && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 10, background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.05))", animation: "fadeIn .2s" }}>
            {!showSizes ? (
              <button onClick={(e) => { e.stopPropagation(); setShowSizes(true); }} style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.96)", backdropFilter: "blur(8px)", borderRadius: 10, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--ink)" }}>
                <Icon name="plus" size={14}/> Compra rápida
              </button>
            ) : (
              <div style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(8px)", borderRadius: 10, padding: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-mute)", marginBottom: 8, textTransform: "uppercase" }}>Elegí talle</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {sizes.map(s => (
                    <button key={s} onClick={(e) => quickAdd(e, s)} style={{ flex: "1 1 auto", minWidth: 36, padding: "6px 8px", border: "1px solid var(--line)", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "#fff" }} onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = ""; }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="body">
        <div style={{ fontSize: 11, color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{product.category}</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 8, lineHeight: 1.2 }}>{product.name}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>{fmt(product.price)}</span>
          {onSale && <span style={{ fontSize: 13, color: "var(--ink-mute)", textDecoration: "line-through" }}>{fmt(product.compareAt)}</span>}
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.5 }}>
          <div><b style={{ color: "var(--brand-deep)" }}>{fmt(transferPrice)}</b> con transferencia</div>
          <div style={{ color: "var(--ink-mute)" }}>ó 6 x {fmt(cuotaPrice)} sin interés</div>
        </div>
      </div>
    </div>
  );
};

window.Home = Home;
window.ProductCard = ProductCard;
