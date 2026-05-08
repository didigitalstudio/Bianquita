// === ADMIN PANEL ===
const Admin = ({ products, setProducts, orders, setOrders, navigate, route, showToast }) => {
  const view = route.adminView || "dashboard";
  const setView = (v, p={}) => navigate("admin", { adminView: v, ...p });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh", background: "#FAF6EE" }}>
      <AdminSidebar view={view} setView={setView} navigate={navigate}/>
      <div style={{ padding: "32px 40px" }}>
        {view === "dashboard" && <AdminDashboard products={products} orders={orders} setView={setView}/>}
        {view === "products" && <AdminProducts products={products} setProducts={setProducts} setView={setView} showToast={showToast}/>}
        {view === "edit" && <AdminEditProduct products={products} setProducts={setProducts} setView={setView} productId={route.productId} showToast={showToast}/>}
        {view === "orders" && <AdminOrders orders={orders} setOrders={setOrders} showToast={showToast}/>}
        {view === "stock" && <AdminStock products={products} setProducts={setProducts} showToast={showToast}/>}
      </div>
    </div>
  );
};

const AdminSidebar = ({ view, setView, navigate }) => (
  <aside style={{ background: "var(--ink)", color: "var(--paper)", padding: "24px 16px", display: "flex", flexDirection: "column" }}>
    <div style={{ padding: "8px 12px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 20 }}>
      <Logo size="sm" inverted/>
      <div style={{ fontSize: 11, color: "rgba(245, 239, 230, 0.5)", marginTop: 8, letterSpacing: "0.15em", textTransform: "uppercase" }}>Admin Panel</div>
    </div>
    <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {[
        ["dashboard", "Dashboard", "trend"],
        ["products", "Productos", "tag"],
        ["stock", "Stock", "box"],
        ["orders", "Pedidos", "truck"],
      ].map(([id, l, ic]) => (
        <button key={id} onClick={()=>setView(id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: view===id?"var(--brand)":"transparent", color: view===id?"#fff":"rgba(245, 239, 230, 0.75)", fontSize: 14, fontWeight: 500, textAlign: "left", transition: "all .15s" }}>
          <Icon name={ic} size={16}/>{l}
        </button>
      ))}
    </nav>
    <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 12px" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>UK</div>
        <div style={{ fontSize: 13 }}>
          <div>Admin Unilubi</div>
          <div style={{ fontSize: 11, color: "rgba(245, 239, 230, 0.5)" }}>Propietaria</div>
        </div>
      </div>
      <button onClick={()=>navigate("home")} style={{ width: "100%", marginTop: 8, padding: "10px 14px", borderRadius: 10, color: "rgba(245, 239, 230, 0.6)", fontSize: 13, textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
        <Icon name="logout" size={14}/>Volver a la tienda
      </button>
    </div>
  </aside>
);

// === DASHBOARD ===
const AdminDashboard = ({ products, orders, setView }) => {
  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter(p => Object.values(p.stock).some(v => v <= 2 && v > 0)).length;
  const outStock = products.filter(p => Object.values(p.stock).every(v => v === 0)).length;
  const pending = orders.filter(o => o.status === "preparando" || o.status === "pendiente-pago").length;

  const STATUS_COLORS = { "pendiente-pago": "badge-warn", "preparando": "badge-soft", "enviado": "badge-salvia", "entregado": "badge-ok" };
  const STATUS_LABELS = { "pendiente-pago": "Pendiente pago", "preparando": "Preparando", "enviado": "En camino", "entregado": "Entregado" };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 className="h2" style={{ marginBottom: 4 }}>Hola, Unilubi ✦</h1>
          <p className="muted">Esto es lo que pasó hoy en tu tienda</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select className="select" style={{ width: "auto", background: "#fff" }}>
            <option>Hoy</option><option>Esta semana</option><option>Este mes</option>
          </select>
          <button className="btn btn-primary"><Icon name="plus" size={14}/> Nuevo producto</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Ventas del mes", value: fmt(totalSales), trend: "+12.4%", icon: "trend", color: "var(--brand)" },
          { label: "Pedidos activos", value: pending, trend: `${pending} por preparar`, icon: "box", color: "var(--salvia-deep)" },
          { label: "Productos activos", value: products.length, trend: `${lowStock} con stock bajo`, icon: "tag", color: "var(--ink)" },
          { label: "Sin stock", value: outStock, trend: outStock > 0 ? "Requiere atención" : "Todo bien", icon: "shield", color: outStock > 0 ? "#a55" : "var(--salvia-deep)" },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <span style={{ fontSize: 12, color: "var(--ink-mute)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{k.label}</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", color: k.color }}><Icon name={k.icon} size={18}/></div>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 8 }}>{k.trend}</div>
          </div>
        ))}
      </div>

      {/* Chart + Top products */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, marginBottom: 32 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>Ventas últimos 14 días</div>
              <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>Comparado con período anterior</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26 }}>{fmt(totalSales)}</div>
              <div style={{ fontSize: 12, color: "var(--salvia-deep)", fontWeight: 600 }}>↑ 12.4%</div>
            </div>
          </div>
          <Sparkline values={[12,18,15,22,28,24,32,30,38,35,42,48,45,52]} />
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 18 }}>Más vendidos</div>
          {products.slice(0, 4).map((p, i) => (
            <div key={p.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: i<3?"1px solid var(--line-soft)":"none" }}>
              <div style={{ width: 12, color: "var(--ink-mute)", fontSize: 12, fontWeight: 700 }}>{i+1}</div>
              <div style={{ width: 40, height: 48, borderRadius: 8, overflow: "hidden", background: "var(--cream)" }}>
                <ProductImage src={p.img} alt={p.name} label="img"/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "var(--ink-mute)" }}>{Math.round(50-i*8)} ventas</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{fmt(p.price)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontWeight: 700 }}>Pedidos recientes</div>
          <button className="btn-link" onClick={()=>setView("orders")}>Ver todos →</button>
        </div>
        <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
          <thead style={{ color: "var(--ink-mute)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <tr><th style={{ textAlign: "left", padding: "10px 0", fontWeight: 600 }}>Pedido</th><th style={{ textAlign: "left", padding: "10px 0", fontWeight: 600 }}>Cliente</th><th style={{ textAlign: "left", padding: "10px 0", fontWeight: 600 }}>Estado</th><th style={{ textAlign: "right", padding: "10px 0", fontWeight: 600 }}>Total</th></tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map(o => (
              <tr key={o.id} style={{ borderTop: "1px solid var(--line-soft)" }}>
                <td style={{ padding: "12px 0", fontFamily: "var(--font-display)", fontWeight: 600 }}>{o.id}</td>
                <td style={{ padding: "12px 0" }}>{o.customer}</td>
                <td style={{ padding: "12px 0" }}><span className={`badge ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</span></td>
                <td style={{ padding: "12px 0", textAlign: "right", fontWeight: 700 }}>{fmt(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Sparkline = ({ values }) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const w = 600, h = 140, p = 8;
  const pts = values.map((v, i) => `${p + (i / (values.length-1)) * (w-2*p)},${h - p - ((v - min) / (max - min)) * (h-2*p)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 140 }}>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`${p},${h-p} ${pts} ${w-p},${h-p}`} fill="url(#grad)"/>
      <polyline points={pts} fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {values.map((v, i) => {
        const x = p + (i / (values.length-1)) * (w-2*p);
        const y = h - p - ((v - min) / (max - min)) * (h-2*p);
        return <circle key={i} cx={x} cy={y} r="2.5" fill="#fff" stroke="var(--brand)" strokeWidth="2"/>;
      })}
    </svg>
  );
};

window.Admin = Admin;
window.AdminDashboard = AdminDashboard;
window.AdminSidebar = AdminSidebar;
window.Sparkline = Sparkline;
