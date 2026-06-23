import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SU BODEGA",
    template: "%s | SU BODEGA",
  },
  description: "La mejor selección para tu ocasión especial",
  metadataBase: new URL("https://subodega.com"),
  openGraph: {
    title: "SU BODEGA",
    description: "La mejor selección para tu ocasión especial",
    type: "website",
    url: "https://subodega.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased bg-background text-foreground`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
