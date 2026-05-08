import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import ShellWrapper from "@/components/layout/ShellWrapper";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: `${BRAND.name} — Indumentaria infantil argentina`,
    template: `%s — ${BRAND.name}`,
  },
  description: BRAND.description,
  icons: { icon: "/logo.png" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: BRAND.name,
    title: `${BRAND.name} — Indumentaria infantil argentina`,
    description: BRAND.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — Indumentaria infantil argentina`,
    description: BRAND.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&family=Fraunces:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <ShellWrapper>{children}</ShellWrapper>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
