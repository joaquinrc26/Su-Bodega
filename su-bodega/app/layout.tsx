import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { cookies } from "next/headers";
import { CartProvider } from "@/lib/cart-context";
import { ADMIN_COOKIE_NAME, isAdminToken } from "@/lib/auth";
import AdminTopBar from "@/components/AdminTopBar";
import SocialFloatingButtons from "@/components/SocialFloatingButtons";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isAdmin = isAdminToken(adminToken);

  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased bg-background text-foreground`}
      >
        <CartProvider>
          <AdminTopBar isAdmin={isAdmin} />
          {children}
          <SocialFloatingButtons />
        </CartProvider>
      </body>
    </html>
  );
}
