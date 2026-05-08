import { notFound } from "next/navigation";
import { getProductById, listProducts } from "@/lib/data/products";
import { listAudiences } from "@/lib/data/catalog";
import ProductDetail from "./ProductDetail";

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, audiences, all] = await Promise.all([
    getProductById(id),
    listAudiences(),
    listProducts(),
  ]);

  if (!product) notFound();

  const related = all
    .filter((p) => p.id !== product.id && (p.category === product.category || p.audience === product.audience))
    .slice(0, 4);

  return <ProductDetail product={product} audiences={audiences} related={related} />;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Producto — Unilubi Kids" };
  return {
    title: `${product.name} — Unilubi Kids`,
    description: product.description,
    openGraph: { images: product.img ? [product.img] : [] },
  };
}
