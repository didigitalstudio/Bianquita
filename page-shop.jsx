// === SHOP / LISTADO ===
const Shop = ({ navigate, products, addToCart, route }) => {
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("recommended");
  const [filterCat, setFilterCat] = useState(null);
  const [filterAud, setFilterAud] = useState(route.audience || null);
  const [filterTag, setFilterTag] = useState(route.tag || null);
  const [priceMax, setPriceMax] = useState(35000);

  useEffect(() => {
    setFilterAud(route.audience || null);
    setFilterTag(route.tag || null);
  }, [route.audience, route.tag]);

  const filtered = useMemo(() => {
    let r = products.filter(p => {
      if (filterCat && p.category !== filterCat) return false;
      if (filterAud && p.audience !== filterAud) return false;
      if (filterTag && !p.tags.includes(filterTag)) return false;
      if (p.price > priceMax) return false;
      return true;
    });
    if (sort === "low") r = r.slice().sort((a,b) => a.price - b.price);
    else if (sort === "high") r = r.slice().sort((a,b) => b.price - a.price);
    else if (sort === "new") r = r.slice().sort((a,b) => (b.tags.includes("nuevo")?1:0) - (a.tags.includes("nuevo")?1:0));
    return r;
  }, [products, filterCat, filterAud, filterTag, priceMax, sort]);

  const audLabel = AUDIENCES.find(a => a.id === filterAud)?.label;
  const title = filterTag === "oferta" ? "Ofertas" : filterTag === "nuevo" ? "Lo nuevo" : filterTag === "regalo" ? "Para regalar" : audLabel || "Toda la colección";

  return (
    <div className="fade-in">
      {/* HEADER */}
      <section style={{ padding: "48px 0 32px", background: "var(--cream)" }}>
        <div className="container-wide">
          <div style={{ fontSize: 12, color: "var(--ink-mute)", marginBottom: 12, display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={() => navigate("home")}>Inicio</button> <span>/</span> <span>Tienda</span>
            {filterAud && <><span>/</span> <span>{audLabel}</span></>}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 className="h1" style={{ fontSize: "clamp(36px, 5vw, 60px)", marginBottom: 8 }}>{title}</h1>
              <p className="muted" style={{ fontSize: 15 }}>{filtered.length} productos · prendas suaves para vestir momentos cotidianos</p>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <select className="select" value={sort} onChange={e=>setSort(e.target.value)} style={{ width: "auto", padding: "10px 14px", background: "rgba(255,255,255,0.7)" }}>
                <option value="recommended">Recomendados</option>
                <option value="new">Nuevos primero</option>
                <option value="low">Precio: menor a mayor</option>
                <option value="high">Precio: mayor a menor</option>
              </select>
              <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 999, padding: 3, background: "#fff" }}>
                <button onClick={()=>setView("grid")} style={{ padding: "6px 10px", borderRadius: 999, background: view==="grid"?"var(--ink)":"transparent", color: view==="grid"?"#fff":"inherit" }}><Icon name="grid" size={14}/></button>
                <button onClick={()=>setView("list")} style={{ padding: "6px 10px", borderRadius: 999, background: view==="list"?"var(--ink)":"transparent", color: view==="list"?"#fff":"inherit" }}><Icon name="list" size={14}/></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section style={{ padding: "32px 0 80px" }}>
        <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 40 }}>
          {/* SIDEBAR */}
          <aside style={{ position: "sticky", top: 100, alignSelf: "start", maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
            <FilterBlock title="Edad">
              {AUDIENCES.map(a => (
                <FilterRow key={a.id} active={filterAud===a.id} onClick={() => setFilterAud(filterAud===a.id?null:a.id)}>
                  <span>{a.label}</span><span className="muted" style={{ fontSize: 12 }}>{a.range}</span>
                </FilterRow>
              ))}
            </FilterBlock>
            <FilterBlock title="Categoría">
              {CATEGORIES.map(c => {
                const count = products.filter(p => p.category===c.id).length;
                return (
                  <FilterRow key={c.id} active={filterCat===c.id} onClick={() => setFilterCat(filterCat===c.id?null:c.id)}>
                    <span>{c.label}</span><span className="muted" style={{ fontSize: 12 }}>{count}</span>
                  </FilterRow>
                );
              })}
            </FilterBlock>
            <FilterBlock title="Precio">
              <div style={{ padding: "8px 0" }}>
                <input type="range" min="5000" max="35000" step="1000" value={priceMax} onChange={e=>setPriceMax(+e.target.value)} style={{ width: "100%", accentColor: "var(--brand)" }}/>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--ink-soft)" }}>
                  <span>$5.000</span><span style={{ fontWeight: 700, color: "var(--brand)" }}>{fmt(priceMax)}</span>
                </div>
              </div>
            </FilterBlock>
            <FilterBlock title="Tags">
              {[["nuevo","Nuevo"],["best-seller","Más vendido"],["oferta","En oferta"],["regalo","Para regalar"]].map(([id,l]) => (
                <FilterRow key={id} active={filterTag===id} onClick={() => setFilterTag(filterTag===id?null:id)}>
                  <span>{l}</span>
                </FilterRow>
              ))}
            </FilterBlock>
            {(filterCat||filterAud||filterTag) && (
              <button className="btn btn-ghost btn-sm" onClick={()=>{setFilterCat(null);setFilterAud(null);setFilterTag(null);}} style={{ width: "100%", marginTop: 16 }}>Limpiar filtros</button>
            )}
          </aside>

          <div>
            {filtered.length === 0 ? (
              <EmptyState icon="search" title="No encontramos prendas" body="Probá ajustando los filtros." cta={<button className="btn btn-ghost" onClick={()=>{setFilterCat(null);setFilterAud(null);setFilterTag(null);}}>Limpiar filtros</button>}/>
            ) : view === "grid" ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                {filtered.map(p => <ProductCard key={p.id} product={p} navigate={navigate} addToCart={addToCart}/>)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filtered.map(p => <ProductRow key={p.id} product={p} navigate={navigate} addToCart={addToCart}/>)}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const FilterBlock = ({ title, children }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: "var(--ink-soft)", marginBottom: 12 }}>{title}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{children}</div>
  </div>
);

const FilterRow = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 10, background: active ? "var(--brand-soft)" : "transparent", color: active ? "var(--brand-deep)" : "var(--ink)", fontWeight: active ? 600 : 500, fontSize: 14, textAlign: "left" }}>{children}</button>
);

const ProductRow = ({ product, navigate, addToCart }) => (
  <div onClick={() => navigate("product", { id: product.id })} style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 20, padding: 16, background: "#fff", border: "1px solid var(--line)", borderRadius: 16, cursor: "pointer", alignItems: "center" }}>
    <div style={{ aspectRatio: "1/1", borderRadius: 10, overflow: "hidden", background: "var(--cream)" }}>
      <ProductImage src={product.img} alt={product.name} label={product.category}/>
    </div>
    <div>
      <div style={{ fontSize: 11, color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{product.category}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 20, marginTop: 2, marginBottom: 4 }}>{product.name}</div>
      <p className="muted" style={{ fontSize: 13, margin: 0 }}>{product.description.slice(0, 90)}…</p>
    </div>
    <div style={{ textAlign: "right" }}>
      <div style={{ fontWeight: 700, fontSize: 18 }}>{fmt(product.price)}</div>
      {product.compareAt && <div style={{ fontSize: 12, color: "var(--ink-mute)", textDecoration: "line-through" }}>{fmt(product.compareAt)}</div>}
      <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={(e) => { e.stopPropagation(); navigate("product", { id: product.id }); }}>Ver →</button>
    </div>
  </div>
);

window.Shop = Shop;
