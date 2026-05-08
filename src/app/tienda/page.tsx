import { Suspense } from "react";
import { listProducts } from "@/lib/data/products";
import { listCategories, listAudiences } from "@/lib/data/catalog";
import TiendaClient from "./TiendaClient";

export default async function TiendaPage() {
  const [products, categories, audiences] = await Promise.all([
    listProducts(),
    listCategories(),
    listAudiences(),
  ]);

  return (
    <Suspense fallback={<div style={{ padding: "120px 24px", textAlign: "center" }} className="muted">Cargando tienda…</div>}>
      <TiendaClient products={products} categories={categories} audiences={audiences} />
    </Suspense>
  );
}
