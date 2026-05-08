// === DETALLE DE PRODUCTO ===
const Product = ({ navigate, products, addToCart, route, showToast }) => {
  const product = products.find(p => p.id === route.id) || products[0];
  const sizes = Object.keys(product.stock);
  const [size, setSize] = useState(sizes.find(s => product.stock[s] > 0) || sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const inStock = product.stock[size] > 0;

  const COLORS = {
    crema: "#F5EFE6", salvia: "#9CA888", terracota: "#B5663D", "rosa-viejo": "#D9B3A2",
    beige: "#D6C5AE", "celeste-suave": "#C5D4DA", "crema-mix": "#E9D4C2",
  };

  const onAdd = () => {
    addToCart({ ...product, size, color, qty });
    showToast(`${product.name} agregado al carrito`);
  };

  const related = products.filter(p => p.id !== product.id && (p.category === product.category || p.audience === product.audience)).slice(0, 4);

  return (
    <div className="fade-in">
      <section style={{ padding: "32px 0" }}>
        <div className="container-wide" style={{ fontSize: 12, color: "var(--ink-mute)" }}>
          <button onClick={()=>navigate("home")}>Inicio</button> / <button onClick={()=>navigate("shop")}>Tienda</button> / <span style={{ color: "var(--ink)" }}>{product.name}</span>
        </div>
      </section>

      <section style={{ padding: "0 0 64px" }}>
        <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64 }}>
          {/* GALLERY */}
          <div>
            <div style={{ aspectRatio: "4/5", background: "var(--cream)", borderRadius: 22, overflow: "hidden", marginBottom: 12 }}>
              <ProductImage src={product.img} alt={product.name} label={product.name}/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ aspectRatio: "1/1", background: i===0?"var(--brand-soft)":"var(--cream)", borderRadius: 14, overflow: "hidden", border: i===0?"2px solid var(--brand)":"1px solid var(--line)", cursor: "pointer" }}>
                  <ProductImage src={product.img} alt="" label="vista"/>
                </div>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {product.tags.includes("nuevo") && <span className="badge badge-brand">Nuevo</span>}
              {product.compareAt && <span className="badge badge-salvia">Oferta</span>}
              <span className="badge badge-cream">{AUDIENCES.find(a=>a.id===product.audience)?.label}</span>
            </div>
            <h1 className="h2" style={{ marginBottom: 8 }}>{product.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 2, color: "var(--brand)" }}>{[1,2,3,4,5].map(i=><Icon key={i} name="star" size={14}/>)}</div>
              <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>4.9 · 128 opiniones</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--brand)" }}>{fmt(product.price)}</span>
              {product.compareAt && <span style={{ fontSize: 18, color: "var(--ink-mute)", textDecoration: "line-through" }}>{fmt(product.compareAt)}</span>}
            </div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 28 }}>O 3 cuotas sin interés de {fmt(Math.round(product.price/3))}</p>

            {/* COLOR */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Color: <span style={{ color: "var(--ink-soft)", fontWeight: 400, textTransform: "capitalize" }}>{color.replace("-"," ")}</span></div>
              <div style={{ display: "flex", gap: 10 }}>
                {product.colors.map(c => (
                  <button key={c} onClick={()=>setColor(c)} style={{ width: 36, height: 36, borderRadius: "50%", border: color===c?"2px solid var(--ink)":"1px solid var(--line)", padding: 3 }}>
                    <span style={{ display: "block", width: "100%", height: "100%", borderRadius: "50%", background: COLORS[c] || "#ccc", border: "1px solid rgba(0,0,0,0.05)" }}/>
                  </button>
                ))}
              </div>
            </div>

            {/* SIZE */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Talle: <span style={{ color: "var(--ink-soft)", fontWeight: 400 }}>{size}</span></span>
                <button className="btn-link" style={{ fontSize: 12 }}>Guía de talles</button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {sizes.map(s => {
                  const out = product.stock[s] === 0;
                  return (
                    <button key={s} disabled={out} onClick={()=>setSize(s)} style={{ padding: "10px 18px", border: size===s?"2px solid var(--ink)":"1px solid var(--line)", borderRadius: 10, background: "#fff", fontWeight: 600, fontSize: 13, opacity: out?0.4:1, textDecoration: out?"line-through":"none", cursor: out?"not-allowed":"pointer" }}>{s}</button>
                  );
                })}
              </div>
              {inStock && product.stock[size] <= 3 && <p style={{ fontSize: 12, color: "var(--brand)", marginTop: 10 }}>⚡ Quedan solo {product.stock[size]} unidades</p>}
            </div>

            {/* QTY + ADD */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)", borderRadius: 999, background: "#fff" }}>
                <button onClick={()=>setQty(Math.max(1,qty-1))} style={{ padding: "12px 16px" }}><Icon name="minus" size={14}/></button>
                <span style={{ minWidth: 30, textAlign: "center", fontWeight: 600 }}>{qty}</span>
                <button onClick={()=>setQty(qty+1)} style={{ padding: "12px 16px" }}><Icon name="plus" size={14}/></button>
              </div>
              <button className="btn btn-primary btn-lg" disabled={!inStock} onClick={onAdd} style={{ flex: 1 }}>
                {inStock ? <>Agregar al carrito · {fmt(product.price * qty)}</> : "Sin stock en este talle"}
              </button>
              <button className="btn btn-ghost btn-lg btn-icon" style={{ width: 52, height: 52 }}><Icon name="heart"/></button>
            </div>
            <button className="btn btn-dark btn-lg" style={{ width: "100%", marginBottom: 28 }} disabled={!inStock} onClick={()=>{onAdd(); navigate("checkout");}}>
              Comprar ahora →
            </button>

            {/* MINI VALUES */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="card-soft" style={{ padding: 14, display: "flex", gap: 10, alignItems: "center" }}>
                <Icon name="truck" size={20}/>
                <div style={{ fontSize: 12 }}><strong>Envío gratis</strong><br/><span className="muted">desde $35.000</span></div>
              </div>
              <div className="card-soft" style={{ padding: 14, display: "flex", gap: 10, alignItems: "center" }}>
                <Icon name="shield" size={20}/>
                <div style={{ fontSize: 12 }}><strong>Cambios gratis</strong><br/><span className="muted">15 días</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TABS */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <div style={{ display: "flex", gap: 32, borderBottom: "1px solid var(--line)", marginBottom: 24 }}>
            {[["desc","Descripción"],["mat","Materiales y cuidado"],["env","Envíos"]].map(([id,l]) => (
              <button key={id} onClick={()=>setTab(id)} style={{ padding: "16px 0", fontSize: 14, fontWeight: 600, borderBottom: tab===id?"2px solid var(--brand)":"2px solid transparent", color: tab===id?"var(--brand)":"var(--ink-soft)", marginBottom: -1 }}>{l}</button>
            ))}
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ink-soft)" }}>
            {tab==="desc" && <p>{product.description}</p>}
            {tab==="mat" && (<><p><strong>Composición:</strong> {product.materials}</p><p><strong>Cuidado:</strong> {product.care}</p></>)}
            {tab==="env" && <p>Despachamos dentro de las 48 hs hábiles. Envíos a todo el país por Andreani o Correo Argentino. Cadetería local en CABA y GBA.</p>}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="container-wide">
          <h2 className="h2" style={{ marginBottom: 24 }}>Te puede gustar</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {related.map(p => <ProductCard key={p.id} product={p} navigate={navigate} addToCart={addToCart}/>)}
          </div>
        </div>
      </section>
    </div>
  );
};

window.Product = Product;
