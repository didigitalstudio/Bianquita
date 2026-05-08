# Tests

Sistema de testing del proyecto Unilubi Kids.

## Stack

| Herramienta | Para qué |
| --- | --- |
| **Vitest** + jsdom | Unit tests de helpers (`tests/unit`) y de componentes React |
| **Vitest** + node | Tests "server" sin red real (`tests/server`) — mockean Resend, etc. |
| **Vitest** + node | Tests de RLS contra Supabase (`tests/db`) |
| **Playwright** (Chromium + Pixel 7) | Tests E2E end-to-end (`tests/e2e`) |

## Comandos

```bash
npm run test            # corre los 3 proyectos de Vitest (unit + server + db)
npm run test:watch      # watch mode local
npm run test:unit       # solo unit (sin red)
npm run test:server     # solo server (mocks)
npm run test:db         # solo RLS — necesita .env.test
npm run test:e2e        # Playwright local (levanta `npm run dev` automáticamente)
npm run test:e2e:ui     # Playwright en modo interactivo
npm run test:coverage   # cobertura v8 → coverage/index.html
```

## Variables de entorno

Local:

- `.env.local` — para `npm run dev` (claves de producción)
- `.env.test` — para `npm run test:db` (puede apuntar al mismo proyecto que prod si los tests son seguros)

Para los DB tests (en `.env.test` o como secrets de GitHub):

```
STAGING_SUPABASE_URL
STAGING_SUPABASE_PUBLISHABLE_KEY
STAGING_SUPABASE_SERVICE_ROLE_KEY
```

Si se setean apuntando a producción, los tests son **seguros**:
- El producto de prueba se crea con `active = false` (no se ve en `/tienda`)
- Cada corrida usa un id único `rls-test-<timestamp>-<rand>`
- `beforeAll` limpia residuos de corridas previas
- `afterAll` borra el producto y el user de prueba

## GitHub Actions secrets

Setear en `Settings → Secrets and variables → Actions`:

| Secret | Para qué |
| --- | --- |
| `STAGING_SUPABASE_URL` | DB tests |
| `STAGING_SUPABASE_PUBLISHABLE_KEY` | DB tests |
| `STAGING_SUPABASE_SERVICE_ROLE_KEY` | DB tests (cuidado: bypassea RLS) |
| `RESEND_TEST_API_KEY` *(opcional)* | Si querés que el job email use una test key real de Resend |
| `PRODUCTION_URL` *(opcional)* | URL contra la que corren los E2E en push a master. Por defecto: `https://unilubi.vercel.app` |

`GITHUB_TOKEN` lo provee Actions automáticamente — lo usa el `wait-for-vercel-preview` para escuchar los checks de Vercel.

## Branch protection

Para que CI bloquee el merge de PRs con tests rotos:

1. `Settings → Branches → Branch protection rules → Add rule`
2. Branch name pattern: `master`
3. ☑ **Require status checks to pass before merging**
4. Buscá y marcá:
   - `Unit tests (Vitest)`
   - `DB & RLS tests`
   - `Email tests`
   - `E2E tests (Playwright)`
5. ☑ Require branches to be up to date before merging *(opcional pero recomendado)*

## Cómo agregar un test nuevo

| Tipo | Carpeta | Ejemplo |
| --- | --- | --- |
| Helper puro | `tests/unit/*.test.ts` | `safeJsonParse.test.ts` |
| Componente React | `tests/unit/*.test.tsx` | `EmptyState.test.tsx` |
| Lib server-side (mockeada) | `tests/server/*.test.ts` | `email.test.ts` |
| RLS / DB | `tests/db/*.test.ts` | `rls-products.test.ts` |
| Flow E2E | `tests/e2e/*.spec.ts` | `checkout.spec.ts` |

## Notas

- Los tests de **email** mockean `resend` con `vi.mock`, así que no envían mails reales en CI.
- Los tests de **RLS** son secuenciales (un solo worker) para no chocar entre sí.
- Los tests de **E2E** sólo corren en PRs (contra el preview de Vercel) y en pushes a master (contra producción), no en pushes a otras ramas.
