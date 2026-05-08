import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import ShellWrapper from "@/components/layout/ShellWrapper";

export const metadata: Metadata = {
  title: "Unilubi Kids — Indumentaria infantil",
  description: "Ropita rica, suavecita y con onda para tus chiquitos. Envíos a todo el país.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Quicksand:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Fraunces:ital,wght@0,400;0,500;0,600;1,400&family=DM+Serif+Display&family=Cormorant+Garamond:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          <ToastProvider>
            <ShellWrapper>{children}</ShellWrapper>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
