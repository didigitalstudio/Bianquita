# Pendientes — Unilubi Kids

Proyecto: E-commerce de indumentaria infantil argentina
Stack: Next.js 15 · App Router · TypeScript · CSS Variables · Vercel
Repo: github.com/didigitalstudio/Bianquita
Deploy: https://unilubi.vercel.app
Admin: https://unilubi.vercel.app/admin

> Este archivo concentra TODO lo que falta implementar para llevar el proyecto a producción real.
> Las secciones están ordenadas por prioridad. Arrancá desde arriba.

---

## 1. CRÍTICO — Sin esto no es producción

### 1.1 Autenticación del panel Admin
- [ ] El `/admin` está completamente expuesto. Cualquiera puede entrar y modificar productos/precios/pedidos.
- [ ] Implementar middleware de Next.js en `src/middleware.ts` que proteja todas las rutas `/admin/*`
- [ ] Opciones: Supabase Auth (recomendado, ya planificado), NextAuth.js, o Clerk
- [ ] Crear página `/admin/login` con form de email+password
- [ ] En Supabase: tabla `admin_users` o usar rol en Supabase Auth

### 1.2 Pasarela de pagos — MercadoPago
- [ ] Crear cuenta MercadoPago de Unilubi y obtener credenciales (PUBLIC_KEY + ACCESS_TOKEN)
- [ ] Guardar como variables de entorno en Vercel: `MP_PUBLIC_KEY`, `MP_ACCESS_TOKEN`
- [ ] Instalar SDK: `npm install mercadopago`
- [ ] Crear `src/app/api/create-preference/route.ts` — genera preferencia de pago con los items del carrito
- [ ] Reemplazar el checkout manual (paso 3 de tarjeta) por el Brick de MercadoPago o redirección a MP
- [ ] Crear webhook `src/app/api/webhooks/mp/route.ts` — recibe notificación de pago aprobado/rechazado
- [ ] Al recibir pago aprobado: crear orden en Supabase, vaciar carrito, enviar email
- [ ] Manejar estados: pendiente / aprobado / rechazado / en proceso

### 1.3 Remover datos sensibles del frontend
- [ ] `src/app/checkout/page.tsx:153` — CBU bancario hardcodeado en el cliente → moverlo a variable de entorno o endpoint protegido
- [ ] Datos de showroom (dirección Palermo) están bien en el frontend, pero centralizar en config

---

## 2. BASE DE DATOS — Supabase (Fase 2)

### 2.1 Setup inicial
- [ ] Crear proyecto Supabase (ya hay cuenta, org `gcdhiqhjbpwxfbtftklk`)
- [ ] Agregar variables de entorno: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Instalar: `npm install @supabase/supabase-js @supabase/ssr`

### 2.2 Tablas a crear
```sql
-- Productos
products (id, name, slug, price, compare_at, description, materials, care, img, colors[], tags[], audience, category, stock jsonb, created_at)

-- Categorías y audiencias
categories (id, label, slug)
audiences (id, label, range, slug)

-- Órdenes
orders (id, order_number, user_email, items jsonb, shipping jsonb, payment_method, status, total, created_at)

-- Usuarios (clientes)
profiles (id uuid → auth.users, name, email, phone, dni, addresses jsonb, created_at)
```

### 2.3 Migrar datos
- [ ] Migrar los 12 productos de `src/lib/data.ts` a la tabla `products` de Supabase
- [ ] Crear server actions o API routes para leer productos (`/api/products`)
- [ ] Reemplazar `PRODUCTS` importado de `data.ts` por fetch desde Supabase en Server Components

### 2.4 Row Level Security
- [ ] Productos: lectura pública, escritura solo admin
- [ ] Órdenes: lectura solo owner o admin, escritura solo sistema
- [ ] Profiles: lectura/escritura solo owner

---

## 3. AUTENTICACIÓN DE CLIENTES

- [ ] Crear página `/cuenta/login` con formulario email+password
- [ ] Crear página `/cuenta/registro` con nombre, email, password
- [ ] Usar Supabase Auth para manejar sesión
- [ ] Redirigir a `/cuenta` si ya está logueado, a `/cuenta/login` si no
- [ ] Proteger `/cuenta` (mis pedidos, favoritos, datos) con middleware
- [ ] "Continuar como invitado" en checkout → no requiere cuenta para comprar, pero invitar al registro al final
- [ ] Guardar órdenes asociadas al `user_id` si está logueado, o a `email` si es invitado

---

## 4. FUNCIONALIDADES FALTANTES — Frontend

### 4.1 Responsive / Mobile (URGENTE — el sitio se rompe en celular)
- [ ] El sitio entero usa grids fijos sin media queries. Agregar en `globals.css`:
  ```css
  @media (max-width: 768px) {
    .container-wide { padding: 0 16px; }
    /* Hero: de 2 columnas a 1 */
    /* Tienda: sidebar colapsable / drawer en mobile */
    /* Producto: de 2 columnas a 1 */
    /* Checkout: de 2 columnas a 1 */
    /* Admin: tablas scrolleables */
  }
  ```
- [ ] Home: hero `1.05fr 1fr` → `1fr` en mobile, imagen arriba o abajo
- [ ] Tienda: sidebar de filtros → botón "Filtros" que abre drawer en mobile
- [ ] Producto: galería thumbnails `repeat(4, 1fr)` → `repeat(4, 1fr)` horizontal scrolleable
- [ ] Checkout: `1.4fr 1fr` → 1 columna, resumen colapsa abajo
- [ ] Admin: scroll horizontal en tablas, menú lateral colapsable

### 4.2 Validación de formularios
- [ ] Checkout paso 1: validar email real, DNI numérico (7-8 dígitos), teléfono
- [ ] Checkout paso 3 (tarjeta): máscara de formato `XXXX XXXX XXXX XXXX`, validación Luhn, vencimiento no expirado
- [ ] Checkout: remover datos de "María Fernández" precargados (son placeholders de demo)
- [ ] Admin edit product: validar price > 0, URL de imagen válida, nombre no vacío
- [ ] Contact form (`/contacto`): ya tiene toast, conectar con email real (Resend o Nodemailer)
- [ ] Newsletter: el input de home no hace nada → integrar con lista de mails (Resend, Mailchimp)

### 4.3 Galería de producto
- [ ] En `/producto/[id]` los 4 thumbnails muestran la misma imagen
- [ ] Cuando haya imágenes reales: cada producto debería tener array de `images[]` en Supabase
- [ ] Thumbnail click → cambiar imagen principal con transición
- [ ] Opcional: zoom on hover en imagen principal

### 4.4 Wishlist / Favoritos
- [ ] El botón corazón en producto existe pero no hace nada
- [ ] La pestaña "Favoritos" en `/cuenta` existe pero no funciona
- [ ] Implementar: tabla `wishlists (user_id, product_id)` en Supabase o localStorage para invitados
- [ ] Toggle corazón → añadir/quitar de favoritos con feedback visual

### 4.5 Búsqueda
- [ ] `SearchOverlay` busca en `PRODUCTS` local (hardcodeado)
- [ ] Migrar a búsqueda en Supabase: `ILIKE` en name/description
- [ ] Opcional: Algolia o Supabase full-text search para resultados más ricos

### 4.6 Página Mi Cuenta — funcionalidad real
- [ ] "Ver detalle →" en tabla de pedidos → abrir modal o página `/cuenta/pedido/[id]` con detalles
- [ ] "Guardar cambios" en datos personales → UPDATE en `profiles` de Supabase
- [ ] "Agregar dirección" → guardar en `profiles.addresses` como JSON
- [ ] Contador de pedidos debe venir de Supabase, no hardcodeado

### 4.7 Tracking de pedido
- [ ] Mostrar estado del pedido (preparando / despachado / en camino / entregado)
- [ ] Cuando el admin cambia el estado en el panel → actualiza `orders.status` en Supabase
- [ ] Email automático al cliente cuando cambia el estado (Resend)

### 4.8 Reviews / Opiniones
- [ ] El rating "4.9 · 128 opiniones" está hardcodeado en todos los productos
- [ ] Tabla `reviews (id, product_id, user_id, rating, body, created_at)`
- [ ] Formulario en página de producto para dejar reseña (requiere compra previa o cuenta)
- [ ] Cálculo dinámico del promedio

---

## 5. PANEL ADMIN — Completar funcionalidades

### 5.1 Conectar a Supabase
- [ ] Productos: CREATE/UPDATE/DELETE reales contra tabla `products`
- [ ] Órdenes: listar desde `orders`, actualizar estado
- [ ] Stock: update campo `stock` en `products`
- [ ] Todo lo que hoy es estado local de React → debe persistir en DB

### 5.2 Refactor de código
- [ ] `src/app/admin/page.tsx` tiene ~480 líneas con 5 componentes internos → separar:
  ```
  src/app/admin/
  ├── page.tsx              (solo el shell con tabs)
  ├── components/
  │   ├── AdminDashboard.tsx
  │   ├── AdminProducts.tsx
  │   ├── AdminEditProduct.tsx
  │   ├── AdminStock.tsx
  │   └── AdminOrders.tsx
  ```

### 5.3 Features admin faltantes
- [ ] Upload de imágenes de productos → Supabase Storage (bucket `product-images`)
- [ ] Dashboard: métricas reales desde Supabase (ventas del mes, productos más vendidos)
- [ ] Filtros en tabla de pedidos: por fecha, por estado, por monto
- [ ] Exportar pedidos a CSV
- [ ] Gestión de descuentos/cupones (tabla `coupons`)
- [ ] Gestión de categorías y audiencias desde el admin

---

## 6. SEO & METADATA

- [ ] `src/app/page.tsx` → ya tiene metadata en layout.tsx, pero falta Open Graph image
- [ ] Páginas de cliente (`/tienda`, `/producto/[id]`) necesitan `generateMetadata()` dinámico
  ```ts
  // producto/[id]/page.tsx
  export async function generateMetadata({ params }) {
    const product = await getProduct(params.id)
    return { title: `${product.name} — Unilubi Kids`, description: product.description, openGraph: { images: [product.img] } }
  }
  ```
- [ ] Crear `src/app/sitemap.ts` para generar sitemap dinámico con todos los productos
- [ ] Crear `src/app/robots.ts`
- [ ] Bloquear `/admin` de indexación (ya tiene `X-Robots-Tag: noindex` de Vercel Auth, pero verificar)
- [ ] Agregar schema.org JSON-LD para productos (Product markup)

---

## 7. PERFORMANCE

- [ ] Reducir Google Fonts de 7 familias a máximo 2-3. Elegir cuáles usar en la guía de estilo y eliminar el resto del `layout.tsx`
- [ ] Imágenes below-the-fold: agregar `loading="lazy"` en secciones de Instagram, newsletter, related products
- [ ] `src/components/ui/Icon.tsx` tiene 40+ SVGs inline en switch. Reemplazar por `lucide-react` (`npm install lucide-react`) → mejor tree-shaking y bundle más liviano
- [ ] En `next.config.ts`: habilitar `images.minimumCacheTTL` más alto para imágenes de Supabase Storage
- [ ] Agregar `<link rel="preload">` para la imagen hero

---

## 8. EMAILS TRANSACCIONALES

- [ ] Crear cuenta en Resend (resend.com) y configurar dominio `unilubikids.com.ar`
- [ ] Variable de entorno: `RESEND_API_KEY`
- [ ] Templates con React Email (`npm install resend @react-email/components`):
  - [ ] Confirmación de pedido (orden + resumen de productos + número de tracking)
  - [ ] Cambio de estado de pedido (despachado, en camino)
  - [ ] Bienvenida al registrarse
  - [ ] Recuperación de contraseña (delegable a Supabase Auth)
  - [ ] Newsletter (se puede integrar con Resend Audiences)

---

## 9. ACCESIBILIDAD — Fixes menores

- [ ] Color swatches en producto: agregar `aria-label={color}` a cada botón de color
- [ ] Botones +/- de cantidad: agregar `aria-label="Aumentar cantidad"` / `aria-label="Disminuir cantidad"`
- [ ] Tabs de producto (Descripción/Materiales/Envíos): agregar `role="tablist"`, `role="tab"`, `aria-selected`
- [ ] Inputs del newsletter: agregar `<label htmlFor="newsletter-email">` o `aria-label`
- [ ] Botones con solo ícono en Navbar: verificar todos tienen `aria-label`
- [ ] Focus visible: agregar `:focus-visible` ring en botones principales (`globals.css`)

---

## 10. DEUDA TÉCNICA — Refactoring

- [ ] Constante `FREE_SHIP_THRESHOLD = 35000` usada en 4+ archivos sin centralizar → crear en `src/lib/constants.ts`
- [ ] `src/app/page.tsx` tiene 260+ líneas con estilos inline → extraer secciones a componentes (`HeroSection`, `BestSellers`, `CategoryGrid`, etc.)
- [ ] `safeJsonParse()` helper en `src/lib/utils.ts` para evitar crashes en `JSON.parse` del cart en localStorage
- [ ] Precio de transferencia (10% descuento) hardcodeado en checkout y en carrito → centralizar en constante
- [ ] `src/app/admin/page.tsx` → fragmentar (ver punto 5.2)
- [ ] Limpiar `tweaks-panel.jsx` del root (era del prototipo, no se usa en Next.js)
- [ ] Limpiar `index.html` y `Unilubi Kids.html` del root si el prototipo ya no se necesita

---

## 11. INFRAESTRUCTURA & DEVOPS

- [ ] Variables de entorno: crear `.env.local.example` con todas las vars necesarias documentadas:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  MP_PUBLIC_KEY=
  MP_ACCESS_TOKEN=
  MP_WEBHOOK_SECRET=
  RESEND_API_KEY=
  ADMIN_SECRET= (para JWT del admin si no se usa Supabase Auth)
  ```
- [ ] Configurar en Vercel: todas las vars de entorno (Settings → Environment Variables)
- [ ] Dominio propio: cuando el cliente tenga `unilubikids.com.ar`, apuntarlo en Vercel (Settings → Domains)
- [ ] Preview deployments: activar para PRs de GitHub (ya debería estar activo)
- [ ] Configurar branch `main` para producción y `dev` para staging (opcional)

---

## 12. CONTENIDO REAL (para el cliente)

- [ ] Imágenes de productos reales → subir a Supabase Storage y reemplazar URLs de Unsplash
- [ ] Logo en alta resolución → `/public/logo.png` actual es el placeholder
- [ ] Textos de cada producto (descripción, materiales, cuidado) → el cliente debe proveerlos
- [ ] Precios reales
- [ ] Foto de hero del home → debe ser imagen de marca real
- [ ] Redes sociales: actualizar URLs de Instagram/WhatsApp en `Footer.tsx`
- [ ] Dirección del showroom real en checkout (hoy dice "Palermo · cita previa")
- [ ] CBU/alias real para transferencias
- [ ] Políticas de cambio y envío reales para `/envios` y `/faq`

---

## Orden de trabajo sugerido para Lucas

1. **Semana 1:** Responsive CSS + validación de forms (sin backend, solo UX)
2. **Semana 1-2:** Setup Supabase + migrar productos a DB + server components
3. **Semana 2:** Auth de clientes (Supabase Auth) + proteger /admin
4. **Semana 3:** MercadoPago integration (crear preferencia + webhook)
5. **Semana 3-4:** Funcionalidades de cuenta (pedidos reales, favoritos, direcciones)
6. **Semana 4:** Emails transaccionales (Resend)
7. **Ongoing:** SEO, performance, accesibilidad
8. **Cuando cliente provea:** imágenes reales, textos, precios

---

*Generado el 2026-05-07. Revisado con code review y UX audit del prototipo inicial.*
