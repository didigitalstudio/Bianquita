import { Suspense } from "react";
import type { Metadata } from "next";
import { listProducts } from "@/lib/data/products";
import { listCategories, listAudiences } from "@/lib/data/catalog";
import TiendaClient from "./TiendaClient";

export const metadata: Metadata = {
  title: "Tienda — toda la colección",
  description: "Bodies, conjuntos, pijamas, vestidos y abrigos para recién nacidos, bebés y niños. Indumentaria infantil de diseño argentino con envíos a todo el país.",
};

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
