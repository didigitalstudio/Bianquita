// Legacy re-export. Real data now comes from Supabase via:
//   - src/lib/data/products.ts
//   - src/lib/data/catalog.ts
//   - src/lib/data/orders.ts
// Client components only need `fmt`, which lives in src/lib/format.ts.
export { fmt } from "./format";
