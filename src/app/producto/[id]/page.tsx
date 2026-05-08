import { notFound } from "next/navigation";
import { getProductById, listProducts } from "@/lib/data/products";
import { listAudiences } from "@/lib/data/catalog";
import { getReviewsForProduct } from "@/lib/data/reviews";
import { createClient } from "@/lib/supabase/server";
import ProductDetail from "./ProductDetail";
import Reviews from "./Reviews";
import { BRAND } from "@/lib/constants";

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, audiences, all, reviewsSummary, supabase] = await Promise.all([
    getProductById(id),
    listAudiences(),
    listProducts(),
    getReviewsForProduct(id),
    createClient(),
  ]);

  if (!product) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const related = all
    .filter((p) => p.id !== product.id && (p.category === product.category || p.audience === product.audience))
    .slice(0, 4);

  return (
    <>
      <ProductDetail
        product={product}
        audiences={audiences}
        related={related}
        ratingAverage={reviewsSummary.average}
        ratingCount={reviewsSummary.count}
      />
      <Reviews productId={product.id} summary={reviewsSummary} isLoggedIn={!!user} />
      <ProductJsonLd product={product} ratingAverage={reviewsSummary.average} ratingCount={reviewsSummary.count} />
    </>
  );
}

function ProductJsonLd({ product, ratingAverage, ratingCount }: { product: Awaited<ReturnType<typeof getProductById>>; ratingAverage: number; ratingCount: number }) {
  if (!product) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.img,
    brand: { "@type": "Brand", name: BRAND.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: product.price,
      availability: Object.values(product.stock).some((v) => v > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(ratingCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: ratingAverage.toFixed(1),
        reviewCount: ratingCount,
      },
    }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Producto" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: product.img ? [product.img] : [], title: product.name, description: product.description },
  };
}
