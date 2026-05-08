import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/data/products";
import { BRAND } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProducts().catch(() => []);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BRAND.url,                lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BRAND.url}/tienda`,    lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BRAND.url}/contacto`,  lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BRAND.url}/envios`,    lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BRAND.url}/faq`,       lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BRAND.url}/producto/${p.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
