// === APP ROOT ===
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "brandPalette": "terracota",
  "fontFamily": "nunito"
}/*EDITMODE-END*/;

const PALETTES = {
  terracota: { brand: "#B5663D", brandDeep: "#8E4C28", brandSoft: "#E9D4C2" },
  salvia:    { brand: "#7B8E5E", brandDeep: "#5A6E3F", brandSoft: "#D6DDC8" },
  rose:      { brand: "#B47A6F", brandDeep: "#8E5953", brandSoft: "#EAD2CC" },
};

const FONTS = {
  nunito:    { sans: "'Nunito', system-ui, sans-serif", display: "'Fraunces', serif" },
  quicksand: { sans: "'Quicksand', system-ui, sans-serif", display: "'DM Serif Display', serif" },
  poppins:   { sans: "'Poppins', system-ui, sans-serif", display: "'Cormorant Garamond', serif" },
};

const App = () => {
  const [route, setRoute] = useState({ name: "home" });
  const [products, setProducts] = useState(window.INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(window.INITIAL_ORDERS);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const navigate = (name, params = {}) => {
    setRoute({ name, ...params });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.findIndex(p => p.id === item.id && p.size === item.size && p.color === item.color);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], qty: next[existing].qty + (item.qty || 1) };
        return next;
      }
      return [...prev, { ...item, qty: item.qty || 1 }];
    });
  };
  const updateQty = (idx, qty) => {
    if (qty <= 0) return removeFromCart(idx);
    setCart(prev => prev.map((it, i) => i===idx ? { ...it, qty } : it));
  };
  const removeFromCart = (idx) => setCart(prev => prev.filter((_, i) => i !== idx));
  const clearCart = () => setCart([]);

  // Apply palette + font tweaks
  useEffect(() => {
    const p = PALETTES[t.brandPalette] || PALETTES.terracota;
    const f = FONTS[t.fontFamily] || FONTS.nunito;
    const r = document.documentElement.style;
    r.setProperty("--brand", p.brand);
    r.setProperty("--brand-deep", p.brandDeep);
    r.setProperty("--brand-soft", p.brandSoft);
    r.setProperty("--font-sans", f.sans);
    r.setProperty("--font-display", f.display);
  }, [t.brandPalette, t.fontFamily]);

  const isAdminView = route.name === "admin";

  return (
    <>
      {!isAdminView && (
        <Navbar route={route} navigate={navigate} cart={cart} openCart={()=>setCartOpen(true)} openMenu={()=>setMenuOpen(true)} openSearch={()=>setSearchOpen(true)} isAdmin={false}/>
      )}

      <main>
        {route.name === "home" && <Home navigate={navigate} products={products} addToCart={addToCart}/>}
        {route.name === "shop" && <Shop navigate={navigate} products={products} addToCart={addToCart} route={route}/>}
        {route.name === "product" && <Product navigate={navigate} products={products} addToCart={addToCart} route={route} showToast={showToast}/>}
        {route.name === "checkout" && <Checkout navigate={navigate} cart={cart} clearCart={clearCart} showToast={showToast}/>}
        {route.name === "faq" && <FAQ navigate={navigate}/>}
        {route.name === "shipping" && <Shipping navigate={navigate}/>}
        {route.name === "contact" && <Contact navigate={navigate} showToast={showToast}/>}
        {route.name === "login" && <Login navigate={navigate} setUser={setUser}/>}
        {route.name === "account" && <Account navigate={navigate} user={user} setUser={setUser}/>}
        {route.name === "admin" && <Admin products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} navigate={navigate} route={route} showToast={showToast}/>}
      </main>

      {!isAdminView && <Footer navigate={navigate}/>}

      <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} cart={cart} updateQty={updateQty} removeFromCart={removeFromCart} navigate={navigate}/>
      <SideMenu open={menuOpen} onClose={()=>setMenuOpen(false)} navigate={navigate}/>
      <SearchOverlay open={searchOpen} onClose={()=>setSearchOpen(false)} products={products} navigate={navigate}/>
      <Toast msg={toast}/>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Color de marca">
          <TweakRadio
            value={t.brandPalette}
            onChange={(v) => setTweak("brandPalette", v)}
            options={[
              { value: "terracota", label: "Terracota" },
              { value: "salvia", label: "Salvia" },
              { value: "rose", label: "Rosa viejo" },
            ]}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {Object.entries(PALETTES).map(([id, p]) => (
              <div key={id} style={{ flex: 1, height: 8, borderRadius: 4, background: p.brand, opacity: t.brandPalette===id?1:0.3 }}/>
            ))}
          </div>
        </TweakSection>
        <TweakSection title="Tipografía">
          <TweakRadio
            value={t.fontFamily}
            onChange={(v) => setTweak("fontFamily", v)}
            options={[
              { value: "nunito", label: "Nunito" },
              { value: "quicksand", label: "Quicksand" },
              { value: "poppins", label: "Poppins" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

// === SEARCH OVERLAY ===
const SearchOverlay = ({ open, onClose, products, navigate }) => {
  const [q, setQ] = useState("");
  if (!open) return null;
  const results = q ? products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.includes(q.toLowerCase())).slice(0, 6) : [];
  const trending = products.filter(p => p.tags.includes("best-seller")).slice(0, 4);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(43,35,29,0.55)", zIndex: 100, animation: "fadeIn .2s", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: 80 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background: "var(--paper)", borderRadius: 22, width: 720, maxWidth: "90vw", padding: 28, animation: "slideUp .3s ease-out" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
          <Icon name="search" size={20}/>
          <input autoFocus className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="¿Qué estás buscando?" style={{ border: "none", padding: 0, fontSize: 18, background: "transparent" }}/>
          <button className="btn-icon" onClick={onClose}><Icon name="x"/></button>
        </div>
        <div style={{ paddingTop: 20 }}>
          {q ? (
            results.length === 0 ? <p className="muted" style={{ padding: 20, textAlign: "center" }}>Sin resultados para "{q}"</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {results.map(p => (
                  <button key={p.id} onClick={() => { navigate("product", { id: p.id }); onClose(); }} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, padding: 10, borderRadius: 12, textAlign: "left" }} onMouseOver={e=>e.currentTarget.style.background="var(--cream)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{ width: 48, height: 56, borderRadius: 8, overflow: "hidden", background: "var(--cream)" }}><ProductImage src={p.img} alt="" label="img"/></div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-mute)", textTransform: "capitalize" }}>{p.category}</div>
                    </div>
                    <div style={{ fontWeight: 700, alignSelf: "center" }}>{fmt(p.price)}</div>
                  </button>
                ))}
              </div>
            )
          ) : (
            <>
              <div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Más buscados</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {["Bodies", "Recién nacido", "Conjuntos", "Pijamas", "Vestidos"].map(s => (
                  <button key={s} onClick={() => setQ(s.toLowerCase())} className="badge badge-cream" style={{ padding: "8px 14px", cursor: "pointer", fontSize: 13, textTransform: "none", letterSpacing: 0 }}>{s}</button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Trending</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {trending.map(p => (
                  <button key={p.id} onClick={() => { navigate("product", { id: p.id }); onClose(); }} style={{ textAlign: "left" }}>
                    <div style={{ aspectRatio: "1/1", borderRadius: 12, overflow: "hidden", background: "var(--cream)", marginBottom: 8 }}><ProductImage src={p.img} alt="" label="img"/></div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--brand)" }}>{fmt(p.price)}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
