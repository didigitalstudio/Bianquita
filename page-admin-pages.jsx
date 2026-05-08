// === ADMIN: PRODUCTS LIST + EDIT + STOCK + ORDERS ===
const AdminProducts = ({ products, setProducts, setView, showToast }) => {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [selected, setSelected] = useState(new Set());

  const filtered = products.filter(p => {
    if (filterCat !== "all" && p.category !== filterCat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalStock = (p) => Object.values(p.stock).reduce((s,v)=>s+v, 0);

  const remove = (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    setProducts(products.filter(p => p.id !== id));
    showToast("Producto eliminado");
  };

  const duplicate = (p) => {
    const newP = { ...p, id: "p" + Date.now(), name: p.name + " (copia)" };
    setProducts([newP, ...products]);
    showToast("Producto duplicado");
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 className="h2" style={{ marginBottom: 4 }}>Productos</h1>
          <p className="muted">{products.length} productos en el catálogo</p>
        </div>
        <button className="btn btn-primary" onClick={()=>setView("edit", { productId: "new" })}><Icon name="plus" size={14}/> Nuevo producto</button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <Icon name="search" size={16} style={{ position: "absolute", left: 14, top: 12, color: "var(--ink-mute)" }}/>
          <input className="input" placeholder="Buscar producto…" value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft: 38 }}/>
        </div>
        <select className="select" value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{ width: "auto" }}>
          <option value="all">Todas las categorías</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <button className="btn btn-ghost"><Icon name="filter" size={14}/> Más filtros</button>
        {selected.size > 0 && <button className="btn btn-ghost" style={{ color: "#a55" }}>{selected.size} seleccionados <Icon name="trash" size={14}/></button>}
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "40px 80px 2fr 1fr 1fr 1fr 1fr 100px", padding: "14px 20px", background: "var(--cream)", fontSize: 11, color: "var(--ink-mute)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          <span><input type="checkbox" onChange={e => setSelected(e.target.checked ? new Set(filtered.map(p=>p.id)) : new Set())}/></span>
          <span>Imagen</span>
          <span>Producto</span>
          <span>Categoría</span>
          <span>Precio</span>
          <span>Stock</span>
          <span>Estado</span>
          <span style={{ textAlign: "right" }}>Acciones</span>
        </div>
        {filtered.map(p => {
          const stock = totalStock(p);
          const out = stock === 0;
          const low = stock > 0 && stock < 5;
          return (
            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "40px 80px 2fr 1fr 1fr 1fr 1fr 100px", padding: "14px 20px", borderTop: "1px solid var(--line-soft)", alignItems: "center", fontSize: 14 }}>
              <span><input type="checkbox" checked={selected.has(p.id)} onChange={e => { const s = new Set(selected); e.target.checked ? s.add(p.id) : s.delete(p.id); setSelected(s); }}/></span>
              <div style={{ width: 56, height: 64, borderRadius: 8, overflow: "hidden", background: "var(--cream)" }}><ProductImage src={p.img} alt={p.name} label="img"/></div>
              <div>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>{p.id} · {AUDIENCES.find(a=>a.id===p.audience)?.label}</div>
              </div>
              <div style={{ textTransform: "capitalize" }}>{p.category}</div>
              <div>
                <div style={{ fontWeight: 700 }}>{fmt(p.price)}</div>
                {p.compareAt && <div style={{ fontSize: 11, color: "var(--ink-mute)", textDecoration: "line-through" }}>{fmt(p.compareAt)}</div>}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: out?"#a55":low?"#b87":"var(--ink)" }}>{stock} u.</div>
                <div style={{ fontSize: 11, color: "var(--ink-mute)" }}>{Object.keys(p.stock).length} talles</div>
              </div>
              <div><span className={`badge ${out?"badge-err":low?"badge-warn":"badge-ok"}`}>{out?"Sin stock":low?"Stock bajo":"Activo"}</span></div>
              <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                <button className="btn-icon" style={{ width: 32, height: 32 }} onClick={()=>setView("edit", { productId: p.id })} title="Editar"><Icon name="edit" size={14}/></button>
                <button className="btn-icon" style={{ width: 32, height: 32 }} onClick={()=>duplicate(p)} title="Duplicar"><Icon name="plus" size={14}/></button>
                <button className="btn-icon" style={{ width: 32, height: 32, color: "#a55" }} onClick={()=>remove(p.id)} title="Eliminar"><Icon name="trash" size={14}/></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// === EDIT PRODUCT ===
const AdminEditProduct = ({ products, setProducts, setView, productId, showToast }) => {
  const isNew = productId === "new";
  const existing = products.find(p => p.id === productId);
  const blank = { id: "p" + Date.now(), name: "", category: "bodies", audience: "bebe", price: 0, compareAt: null, stock: {}, colors: [], description: "", materials: "", care: "", tags: [], img: "" };
  const [form, setForm] = useState(existing ? JSON.parse(JSON.stringify(existing)) : blank);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updStock = (size, val) => setForm(f => ({ ...f, stock: { ...f.stock, [size]: Math.max(0, +val || 0) } }));
  const addSize = () => {
    const s = prompt("Nombre del talle (ej: 6, 12-18M)");
    if (s) updStock(s, 0);
  };
  const removeSize = (s) => {
    const ns = { ...form.stock };
    delete ns[s];
    upd("stock", ns);
  };
  const toggleTag = (t) => upd("tags", form.tags.includes(t) ? form.tags.filter(x=>x!==t) : [...form.tags, t]);
  const toggleColor = (c) => upd("colors", form.colors.includes(c) ? form.colors.filter(x=>x!==c) : [...form.colors, c]);

  const save = () => {
    if (!form.name) { showToast("Falta el nombre"); return; }
    if (isNew) setProducts([form, ...products]);
    else setProducts(products.map(p => p.id === productId ? form : p));
    showToast(isNew ? "Producto creado" : "Cambios guardados");
    setView("products");
  };

  const ALL_COLORS = ["crema", "salvia", "terracota", "rosa-viejo", "beige", "celeste-suave"];
  const COLOR_HEX = { crema: "#F5EFE6", salvia: "#9CA888", terracota: "#B5663D", "rosa-viejo": "#D9B3A2", beige: "#D6C5AE", "celeste-suave": "#C5D4DA" };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <button className="btn-link" onClick={()=>setView("products")} style={{ fontSize: 13, marginBottom: 8 }}>← Volver a productos</button>
          <h1 className="h2">{isNew ? "Nuevo producto" : form.name}</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={()=>setView("products")}>Cancelar</button>
          <button className="btn btn-primary" onClick={save}>{isNew ? "Crear producto" : "Guardar cambios"}</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Basic info */}
          <div className="card" style={{ padding: 24 }}>
            <div className="h3" style={{ marginBottom: 18 }}>Información general</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="field"><label>Nombre del producto</label><input className="input" value={form.name} onChange={e=>upd("name", e.target.value)} placeholder="Ej: Body manga larga rayado"/></div>
              <div className="field"><label>Descripción</label><textarea className="textarea" value={form.description} onChange={e=>upd("description", e.target.value)} placeholder="Describí el producto…"/></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="field"><label>Categoría</label>
                  <select className="select" value={form.category} onChange={e=>upd("category", e.target.value)}>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div className="field"><label>Edad</label>
                  <select className="select" value={form.audience} onChange={e=>upd("audience", e.target.value)}>
                    {AUDIENCES.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="field"><label>Materiales</label><input className="input" value={form.materials} onChange={e=>upd("materials", e.target.value)} placeholder="Ej: Algodón pima 100%"/></div>
                <div className="field"><label>Cuidado</label><input className="input" value={form.care} onChange={e=>upd("care", e.target.value)} placeholder="Ej: Lavar a máquina"/></div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card" style={{ padding: 24 }}>
            <div className="h3" style={{ marginBottom: 18 }}>Precio</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field"><label>Precio de venta</label><input className="input" type="number" value={form.price} onChange={e=>upd("price", +e.target.value)}/></div>
              <div className="field"><label>Precio anterior (oferta)</label><input className="input" type="number" value={form.compareAt || ""} onChange={e=>upd("compareAt", e.target.value ? +e.target.value : null)} placeholder="Opcional"/></div>
            </div>
            {form.compareAt && form.price < form.compareAt && (
              <div style={{ marginTop: 12, padding: 12, background: "var(--brand-soft)", borderRadius: 10, fontSize: 13, color: "var(--brand-deep)" }}>
                ✦ Descuento del {Math.round((1 - form.price/form.compareAt) * 100)}% sobre el precio anterior
              </div>
            )}
          </div>

          {/* Stock por talle */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div className="h3">Talles y stock</div>
              <button className="btn btn-ghost btn-sm" onClick={addSize}><Icon name="plus" size={14}/> Agregar talle</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {Object.entries(form.stock).map(([s, v]) => (
                <div key={s} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 6, padding: 12, border: "1px solid var(--line)", borderRadius: 12, background: "#fff" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>Talle {s}</div>
                    <input type="number" value={v} onChange={e=>updStock(s, e.target.value)} style={{ width: "100%", border: "none", fontSize: 18, fontWeight: 700, color: v===0?"#a55":"var(--ink)", padding: 0 }}/>
                  </div>
                  <button onClick={()=>removeSize(s)} style={{ color: "var(--ink-mute)", padding: 4, alignSelf: "flex-start" }}><Icon name="x" size={14}/></button>
                </div>
              ))}
              {Object.keys(form.stock).length === 0 && <div className="muted" style={{ gridColumn: "span 3", padding: 20, textAlign: "center", fontSize: 13 }}>Agregá al menos un talle</div>}
            </div>
          </div>
        </div>

        {/* Side */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="h3" style={{ marginBottom: 18 }}>Imagen del producto</div>
            <div style={{ aspectRatio: "1/1", borderRadius: 14, overflow: "hidden", background: "var(--cream)", marginBottom: 12 }}>
              <ProductImage src={form.img} alt="" label="vista"/>
            </div>
            <div className="field"><label>URL de imagen</label><input className="input" value={form.img} onChange={e=>upd("img", e.target.value)} placeholder="https://…"/></div>
            <button className="btn btn-ghost" style={{ width: "100%", marginTop: 10 }}><Icon name="plus" size={14}/> Subir imagen</button>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="h3" style={{ marginBottom: 14 }}>Colores disponibles</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ALL_COLORS.map(c => (
                <button key={c} onClick={()=>toggleColor(c)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: form.colors.includes(c)?"2px solid var(--brand)":"1px solid var(--line)", borderRadius: 999, background: "#fff", fontSize: 13, textTransform: "capitalize" }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", background: COLOR_HEX[c], border: "1px solid rgba(0,0,0,0.05)" }}/>
                  {c.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="h3" style={{ marginBottom: 14 }}>Etiquetas</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[["nuevo","Nuevo"],["best-seller","Más vendido"],["oferta","En oferta"],["regalo","Para regalar"]].map(([id,l]) => (
                <button key={id} onClick={()=>toggleTag(id)} className={`badge ${form.tags.includes(id)?"badge-brand":"badge-cream"}`} style={{ cursor: "pointer", padding: "8px 14px" }}>
                  {form.tags.includes(id) && "✓ "}{l}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 24, background: "var(--cream)" }}>
            <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--ink)" }}>💡 Tip:</strong> los productos con etiqueta "Nuevo" aparecen primero en la home. Recordá actualizar las imágenes cuando recibís nuevas piezas.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// === STOCK ===
const AdminStock = ({ products, setProducts, showToast }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const list = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    const total = Object.values(p.stock).reduce((s,v)=>s+v,0);
    if (filter === "low" && (total >= 5 || total === 0)) return false;
    if (filter === "out" && total > 0) return false;
    return true;
  });

  const updStock = (pid, size, val) => {
    setProducts(products.map(p => p.id === pid ? { ...p, stock: { ...p.stock, [size]: Math.max(0, +val || 0) } } : p));
  };
  const adjustStock = (pid, size, delta) => {
    const p = products.find(x => x.id === pid);
    updStock(pid, size, (p.stock[size] || 0) + delta);
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 className="h2" style={{ marginBottom: 4 }}>Stock</h1>
          <p className="muted">Controlá las unidades de cada talle. Los cambios se aplican en vivo.</p>
        </div>
        <button className="btn btn-ghost"><Icon name="box" size={14}/> Exportar inventario</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <Icon name="search" size={16} style={{ position: "absolute", left: 14, top: 12, color: "var(--ink-mute)" }}/>
          <input className="input" placeholder="Buscar producto…" value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft: 38 }}/>
        </div>
        <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 999, padding: 3, background: "#fff" }}>
          {[["all","Todos"],["low","Stock bajo"],["out","Sin stock"]].map(([id,l]) => (
            <button key={id} onClick={()=>setFilter(id)} style={{ padding: "8px 16px", borderRadius: 999, background: filter===id?"var(--ink)":"transparent", color: filter===id?"#fff":"inherit", fontSize: 13, fontWeight: 600 }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {list.map(p => {
          const total = Object.values(p.stock).reduce((s,v)=>s+v,0);
          return (
            <div key={p.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center", marginBottom: 14 }}>
                <div style={{ width: 56, height: 64, borderRadius: 8, overflow: "hidden", background: "var(--cream)" }}>
                  <ProductImage src={p.img} alt={p.name} label="img"/>
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>{p.id} · {fmt(p.price)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: total===0?"#a55":total<5?"#b87":"var(--ink)" }}>{total}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Total</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
                {Object.entries(p.stock).map(([s, v]) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: v===0?"rgba(170,80,80,0.08)":"var(--cream)", borderRadius: 10 }}>
                    <div style={{ flex: 1, fontSize: 12 }}>
                      <div style={{ color: "var(--ink-mute)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600, fontSize: 10 }}>Talle {s}</div>
                    </div>
                    <button onClick={()=>adjustStock(p.id, s, -1)} style={{ width: 26, height: 26, borderRadius: 6, background: "#fff", border: "1px solid var(--line)" }}><Icon name="minus" size={12}/></button>
                    <input type="number" value={v} onChange={e=>updStock(p.id, s, e.target.value)} style={{ width: 36, textAlign: "center", border: "none", background: "transparent", fontWeight: 700, fontSize: 14, color: v===0?"#a55":"var(--ink)" }}/>
                    <button onClick={()=>adjustStock(p.id, s, 1)} style={{ width: 26, height: 26, borderRadius: 6, background: "#fff", border: "1px solid var(--line)" }}><Icon name="plus" size={12}/></button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// === ORDERS ===
const AdminOrders = ({ orders, setOrders, showToast }) => {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const STATUS = {
    "pendiente-pago": { label: "Pendiente pago", cls: "badge-warn" },
    "preparando": { label: "Preparando", cls: "badge-soft" },
    "enviado": { label: "En camino", cls: "badge-salvia" },
    "entregado": { label: "Entregado", cls: "badge-ok" },
  };

  const list = orders.filter(o => filter === "all" || o.status === filter);

  const updateStatus = (id, status) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    showToast(`Pedido ${id} actualizado`);
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 className="h2" style={{ marginBottom: 4 }}>Pedidos</h1>
          <p className="muted">{orders.length} pedidos · {orders.filter(o=>o.status==="preparando").length} esperando despacho</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={()=>setFilter("all")} className={`badge ${filter==="all"?"badge-brand":"badge-cream"}`} style={{ padding: "8px 14px", cursor: "pointer" }}>Todos ({orders.length})</button>
        {Object.entries(STATUS).map(([id, s]) => {
          const count = orders.filter(o => o.status === id).length;
          return <button key={id} onClick={()=>setFilter(id)} className={`badge ${filter===id?"badge-brand":"badge-cream"}`} style={{ padding: "8px 14px", cursor: "pointer" }}>{s.label} ({count})</button>;
        })}
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr 1fr 1fr", padding: "14px 20px", background: "var(--cream)", fontSize: 11, color: "var(--ink-mute)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          <span>Pedido</span><span>Cliente</span><span>Fecha</span><span>Items</span><span>Total</span><span>Estado</span><span style={{ textAlign: "right" }}>Acciones</span>
        </div>
        {list.map(o => (
          <div key={o.id} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr 1fr 1fr", padding: "14px 20px", borderTop: "1px solid var(--line-soft)", alignItems: "center", fontSize: 14 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{o.id}</span>
            <div>
              <div style={{ fontWeight: 600 }}>{o.customer}</div>
              <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>{o.email}</div>
            </div>
            <span style={{ color: "var(--ink-soft)" }}>{new Date(o.date).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}</span>
            <span>{o.items} prendas</span>
            <span style={{ fontWeight: 700 }}>{fmt(o.total)}</span>
            <span><span className={`badge ${STATUS[o.status].cls}`}>{STATUS[o.status].label}</span></span>
            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
              <button className="btn-icon" style={{ width: 32, height: 32 }} onClick={()=>setSelected(o)}><Icon name="eye" size={14}/></button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <OrderDetailModal order={selected} onClose={()=>setSelected(null)} updateStatus={updateStatus} STATUS={STATUS}/>
      )}
    </div>
  );
};

const OrderDetailModal = ({ order, onClose, updateStatus, STATUS }) => (
  <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(43,35,29,0.45)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: 24, animation: "fadeIn .2s" }}>
    <div onClick={e=>e.stopPropagation()} style={{ background: "var(--paper)", borderRadius: 22, width: 640, maxHeight: "90vh", overflowY: "auto", animation: "slideUp .3s" }}>
      <div style={{ padding: "24px 28px", borderBottom: "1px solid var(--line-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>Pedido</div>
          <div className="h3">{order.id}</div>
        </div>
        <button className="btn-icon" onClick={onClose}><Icon name="x"/></button>
      </div>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>Estado</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(STATUS).map(([id, s]) => (
              <button key={id} onClick={()=>updateStatus(order.id, id)} style={{ padding: "8px 14px", borderRadius: 999, border: order.status===id?"2px solid var(--brand)":"1px solid var(--line)", background: order.status===id?"var(--brand-soft)":"#fff", fontSize: 13, fontWeight: 600 }}>
                {order.status===id && "✓ "}{s.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 22 }}>
          <Section label="Cliente"><strong>{order.customer}</strong><br/><span className="muted" style={{ fontSize: 13 }}>{order.email}</span></Section>
          <Section label="Fecha"><strong>{new Date(order.date).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}</strong></Section>
          <Section label="Pago"><strong>{order.payment}</strong></Section>
          <Section label="Items"><strong>{order.items} prendas</strong></Section>
          <Section label="Envío" wide><strong>{order.shipping}</strong><br/><span className="muted" style={{ fontSize: 13 }}>{order.address}</span></Section>
        </div>
        <div className="card-soft" style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>Total del pedido</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--brand)" }}>{fmt(order.total)}</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }}><Icon name="mail" size={14}/> Email cliente</button>
          <button className="btn btn-primary" style={{ flex: 1 }}><Icon name="truck" size={14}/> Generar etiqueta</button>
        </div>
      </div>
    </div>
  </div>
);

const Section = ({ label, children, wide }) => (
  <div style={{ gridColumn: wide ? "span 2" : "auto" }}>
    <div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>{label}</div>
    <div>{children}</div>
  </div>
);

window.AdminProducts = AdminProducts;
window.AdminEditProduct = AdminEditProduct;
window.AdminStock = AdminStock;
window.AdminOrders = AdminOrders;
