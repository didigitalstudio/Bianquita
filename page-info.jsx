// === FAQ / SHIPPING / CONTACT / LOGIN / ACCOUNT ===
const FAQ = ({ navigate }) => {
  const [open, setOpen] = useState(0);
  const faqs = [
    { q: "¿Cuánto tarda en llegar mi pedido?", a: "Despachamos dentro de las 48 hs hábiles. Andreani a domicilio tarda 3-5 días, sucursal 2-4 días, y la cadetería local llega el mismo día o al día siguiente." },
    { q: "¿Hacen envíos a todo el país?", a: "Sí, despachamos a todo el territorio argentino con Andreani y Correo Argentino. En CABA y GBA también ofrecemos cadetería propia." },
    { q: "¿Puedo cambiar la prenda si no le queda?", a: "¡Por supuesto! Tenés 15 días desde que recibís tu pedido para cambiar la prenda por otro talle o un crédito en tu cuenta. La prenda debe estar sin uso y con sus etiquetas." },
    { q: "¿Cómo elijo el talle correcto?", a: "Cada producto tiene su guía de talles. Si tenés dudas escribinos por WhatsApp y te ayudamos a elegir. Igualmente, los cambios son sin costo." },
    { q: "¿Cuáles son los medios de pago?", a: "Aceptamos tarjetas de crédito y débito (hasta 12 cuotas), y transferencia bancaria con 10% de descuento adicional." },
    { q: "¿Puedo comprar al por mayor?", a: "Sí, hacemos venta mayorista a tiendas y emprendimientos. Escribinos a mayorista@unilubikids.com.ar para recibir nuestro catálogo." },
    { q: "¿Cómo lavo las prendas?", a: "La mayoría se lavan a máquina con agua fría y del revés. Cada prenda incluye etiqueta con instrucciones específicas." },
    { q: "¿Puedo agregar packaging de regalo?", a: "Sí, por $1.500 sumamos un envoltorio especial con papel de seda, tarjeta personalizada y lazo." },
  ];
  return (
    <div className="fade-in">
      <section style={{ padding: "64px 0 32px", background: "var(--cream)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>· Ayuda ·</div>
          <h1 className="h1" style={{ fontSize: "clamp(36px, 5vw, 56px)", marginBottom: 16 }}>Preguntas frecuentes</h1>
          <p className="soft" style={{ fontSize: 17 }}>Todo lo que necesitás saber para comprar tranquila.</p>
        </div>
      </section>
      <section style={{ padding: "48px 0 80px" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderBottom: "1px solid var(--line)" }}>
              <button onClick={()=>setOpen(open===i?-1:i)} style={{ width: "100%", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 19 }}>{f.q}</span>
                <span style={{ width: 32, height: 32, borderRadius: "50%", background: open===i?"var(--brand)":"var(--cream)", color: open===i?"#fff":"var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s" }}>
                  <Icon name={open===i?"minus":"plus"} size={14}/>
                </span>
              </button>
              {open===i && <div style={{ paddingBottom: 20, color: "var(--ink-soft)", lineHeight: 1.7, animation: "fadeIn .25s" }}>{f.a}</div>}
            </div>
          ))}
          <div className="card-soft" style={{ padding: 28, marginTop: 48, textAlign: "center" }}>
            <div className="h3" style={{ marginBottom: 8 }}>¿No encontraste tu respuesta?</div>
            <p className="muted" style={{ marginBottom: 20 }}>Escribinos por WhatsApp y te respondemos en minutos.</p>
            <button className="btn btn-primary" onClick={()=>navigate("contact")}>Contactarnos →</button>
          </div>
        </div>
      </section>
    </div>
  );
};

const Shipping = ({ navigate }) => (
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
          ].map(o => (
            <div key={o.title} className="card" style={{ padding: 28 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--brand-soft)", color: "var(--brand-deep)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon name={o.icon} size={26}/>
              </div>
              <div className="h3" style={{ marginBottom: 8 }}>{o.title}</div>
              <p style={{ color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{o.desc}</p>
              <div style={{ fontWeight: 700, color: "var(--brand)" }}>{o.price}</div>
            </div>
          ))}
        </div>
        <div className="card-soft" style={{ padding: 32, marginTop: 32, display: "flex", gap: 24, alignItems: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="gift" size={28}/>
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
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", padding: "16px 24px", borderTop: i?"1px solid var(--line-soft)":"none", fontSize: 14 }}>
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

const Contact = ({ navigate, showToast }) => (
  <div className="fade-in">
    <section style={{ padding: "64px 0 32px", background: "var(--cream)", textAlign: "center" }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>· Contacto ·</div>
        <h1 className="h1" style={{ fontSize: "clamp(36px, 5vw, 56px)", marginBottom: 16 }}>Hablemos</h1>
        <p className="soft" style={{ fontSize: 17 }}>Estamos para ayudarte. Elegí el canal que prefieras.</p>
      </div>
    </section>
    <section style={{ padding: "48px 0 80px" }}>
      <div className="container" style={{ maxWidth: 1000, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
            {[
              { icon: "whatsapp", title: "WhatsApp", desc: "+54 11 5119-8327", sub: "Lun a vie 9 a 19hs" },
              { icon: "mail", title: "Email", desc: "hola@unilubikids.com.ar", sub: "Respondemos en 24hs" },
              { icon: "instagram", title: "Instagram", desc: "@unilubikids", sub: "DM o etiquetanos" },
              { icon: "map", title: "Showroom", desc: "Palermo, Buenos Aires", sub: "Con cita previa" },
            ].map(c => (
              <div key={c.title} className="card" style={{ padding: 18, display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--brand-soft)", color: "var(--brand-deep)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={c.icon} size={20}/>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--ink-mute)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{c.title}</div>
                  <div style={{ fontWeight: 600, marginTop: 2 }}>{c.desc}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card-soft" style={{ padding: 32 }}>
          <div className="h3" style={{ marginBottom: 18 }}>Mandanos un mensaje</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="field"><label>Nombre</label><input className="input" style={{ background: "#fff" }}/></div>
            <div className="field"><label>Email</label><input className="input" style={{ background: "#fff" }}/></div>
            <div className="field" style={{ gridColumn: "span 2" }}><label>Asunto</label><select className="select" style={{ background: "#fff" }}><option>Consulta general</option><option>Estado de pedido</option><option>Cambio o devolución</option><option>Mayorista</option></select></div>
            <div className="field" style={{ gridColumn: "span 2" }}><label>Mensaje</label><textarea className="textarea" style={{ background: "#fff", minHeight: 120 }}/></div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 20, width: "100%" }} onClick={()=>showToast("Mensaje enviado · te respondemos en 24hs")}>Enviar →</button>
        </div>
      </div>
    </section>
  </div>
);

const Login = ({ navigate, setUser }) => {
  const [mode, setMode] = useState("login");
  return (
    <div className="fade-in" style={{ padding: "64px 0 80px", background: "var(--cream)", minHeight: "calc(100vh - 200px)" }}>
      <div className="container" style={{ maxWidth: 460 }}>
        <div style={{ background: "#fff", padding: 36, borderRadius: 22, border: "1px solid var(--line)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <Logo size="md"/>
            <div className="h3" style={{ marginTop: 16 }}>{mode==="login"?"Iniciar sesión":"Crear cuenta"}</div>
            <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>{mode==="login"?"Bienvenida de nuevo a Unilubi":"Sumate a la familia Unilubi"}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mode==="register" && <div className="field"><label>Nombre completo</label><input className="input"/></div>}
            <div className="field"><label>Email</label><input className="input" defaultValue={mode==="login"?"maria@email.com":""}/></div>
            <div className="field"><label>Contraseña</label><input className="input" type="password" defaultValue={mode==="login"?"••••••••":""}/></div>
            {mode==="login" && <button className="btn-link" style={{ alignSelf: "flex-end", fontSize: 12 }}>¿Olvidaste tu contraseña?</button>}
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 20 }} onClick={()=>{setUser({ name: "María Fernández", email: "maria@email.com" }); navigate("account");}}>
            {mode==="login"?"Ingresar":"Crear cuenta"}
          </button>
          <div style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "var(--ink-soft)" }}>
            {mode==="login" ? <>¿Sos nueva? <button className="btn-link" onClick={()=>setMode("register")}>Crear cuenta</button></> : <>¿Ya tenés cuenta? <button className="btn-link" onClick={()=>setMode("login")}>Iniciar sesión</button></>}
          </div>
        </div>
      </div>
    </div>
  );
};

const Account = ({ navigate, user, setUser }) => {
  const [tab, setTab] = useState("orders");
  if (!user) {
    return (
      <div style={{ padding: "80px 24px", textAlign: "center" }}>
        <EmptyState icon="user" title="Iniciá sesión" body="Ingresá para ver tus pedidos y datos." cta={<button className="btn btn-primary" onClick={()=>navigate("login")}>Iniciar sesión</button>}/>
      </div>
    );
  }
  return (
    <div className="fade-in" style={{ padding: "32px 0 80px" }}>
      <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 40 }}>
        <aside>
          <div style={{ padding: 18, background: "var(--cream)", borderRadius: 16, marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--brand)", color: "#fff", fontFamily: "var(--font-display)", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{user.name[0]}</div>
            <div style={{ fontWeight: 700 }}>{user.name}</div>
            <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{user.email}</div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[["orders","Mis pedidos","box"],["fav","Favoritos","heart"],["addr","Direcciones","map"],["data","Mis datos","user"]].map(([id,l,ic]) => (
              <button key={id} onClick={()=>setTab(id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: tab===id?"var(--brand-soft)":"transparent", color: tab===id?"var(--brand-deep)":"inherit", fontWeight: tab===id?600:500, fontSize: 14, textAlign: "left" }}>
                <Icon name={ic} size={16}/>{l}
              </button>
            ))}
            <button onClick={()=>{setUser(null);navigate("home");}} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, color: "var(--ink-mute)", fontSize: 14, textAlign: "left", marginTop: 12 }}>
              <Icon name="logout" size={16}/>Cerrar sesión
            </button>
          </nav>
        </aside>
        <div>
          {tab==="orders" && (
            <>
              <h1 className="h2" style={{ marginBottom: 24 }}>Mis pedidos</h1>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { id: "ULB-2841", date: "4 May 2026", status: "preparando", items: 3, total: 42700 },
                  { id: "ULB-2820", date: "12 Abr 2026", status: "entregado", items: 2, total: 27400 },
                  { id: "ULB-2790", date: "28 Mar 2026", status: "entregado", items: 5, total: 86200 },
                ].map(o => {
                  const STATUS = { preparando: ["Preparando", "badge-warn"], entregado: ["Entregado", "badge-ok"], enviado: ["En camino", "badge-soft"] };
                  return (
                    <div key={o.id} className="card" style={{ padding: 22, display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 20, alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>Pedido</div>
                        <div style={{ fontWeight: 700, fontFamily: "var(--font-display)" }}>{o.id}</div>
                        <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{o.date}</div>
                      </div>
                      <div><span className={`badge ${STATUS[o.status][1]}`}>{STATUS[o.status][0]}</span></div>
                      <div>
                        <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>{o.items} productos</div>
                        <div style={{ fontWeight: 700 }}>{fmt(o.total)}</div>
                      </div>
                      <button className="btn btn-ghost btn-sm">Ver detalle →</button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {tab==="fav" && <EmptyState icon="heart" title="Aún no tenés favoritos" body="Tocá el corazón en una prenda para guardarla." cta={<button className="btn btn-primary" onClick={()=>navigate("shop")}>Explorar</button>}/>}
          {tab==="addr" && (
            <>
              <h1 className="h2" style={{ marginBottom: 24 }}>Direcciones</h1>
              <div className="card" style={{ padding: 22, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><strong>Casa</strong><span className="badge badge-soft">Principal</span></div>
                    <div className="muted" style={{ fontSize: 14 }}>Av. Cabildo 2840 · CABA · CP 1428</div>
                  </div>
                  <button className="btn-link"><Icon name="edit" size={14}/></button>
                </div>
              </div>
              <button className="btn btn-ghost"><Icon name="plus" size={14}/> Agregar dirección</button>
            </>
          )}
          {tab==="data" && (
            <>
              <h1 className="h2" style={{ marginBottom: 24 }}>Mis datos</h1>
              <div className="card" style={{ padding: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 640 }}>
                <div className="field"><label>Nombre</label><input className="input" defaultValue="María"/></div>
                <div className="field"><label>Apellido</label><input className="input" defaultValue="Fernández"/></div>
                <div className="field" style={{ gridColumn: "span 2" }}><label>Email</label><input className="input" defaultValue="maria@email.com"/></div>
                <div className="field"><label>Teléfono</label><input className="input" defaultValue="+54 11 5198-2734"/></div>
                <div className="field"><label>DNI</label><input className="input" defaultValue="32145678"/></div>
                <div style={{ gridColumn: "span 2", marginTop: 8 }}><button className="btn btn-primary">Guardar cambios</button></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

window.FAQ = FAQ;
window.Shipping = Shipping;
window.Contact = Contact;
window.Login = Login;
window.Account = Account;
