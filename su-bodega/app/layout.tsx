import type { Metadata } from "next";
import { Bodoni_Moda, Cinzel, Cormorant_Garamond, Lato, Montserrat, Playfair_Display } from "next/font/google";
import { cookies } from "next/headers";
import { CartProvider } from "@/lib/cart-context";
import { ADMIN_COOKIE_NAME, isAdminToken } from "@/lib/auth";
import { getSiteContent } from "@/lib/site-content";
import { cssImageUrl, fontCssVar } from "@/lib/site-content-schema";
import AdminTopBar from "@/components/AdminTopBar";
import PublicHeader from "@/components/PublicHeader";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import SocialFloatingButtons from "@/components/SocialFloatingButtons";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni-moda",
  display: "swap",
});

// Tipografías que el admin puede elegir; sin preload para que solo se descargue la que se usa.
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-site-playfair", display: "swap", preload: false });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-site-cormorant", display: "swap", preload: false });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-site-cinzel", display: "swap", preload: false });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-site-montserrat", display: "swap", preload: false });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-site-lato", display: "swap", preload: false });

const fontVariables = [bodoniModa, playfair, cormorant, cinzel, montserrat, lato].map((font) => font.variable).join(" ");

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    title: {
      default: content["site.title"],
      template: `%s | ${content["site.title"]}`,
    },
    description: content["site.description"],
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: content["site.title"],
      description: content["site.description"],
      type: "website",
      url: siteUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isAdmin = isAdminToken(adminToken);
  const content = await getSiteContent();

  const themeVariables = {
    "--site-title-font": fontCssVar(content["design.titleFont"]),
    "--site-body-font": fontCssVar(content["design.bodyFont"]),
    "--site-text-transform": content["design.uppercase"] === "true" ? "uppercase" : "none",
    "--cover-image": cssImageUrl(content["home.cover"]),
    "--card-vinos-image": cssImageUrl(content["sec.vinos.image"]),
    "--card-guardados-image": cssImageUrl(content["sec.guardados.image"]),
    "--card-regaleria-image": cssImageUrl(content["sec.regaleria.image"]),
  } as React.CSSProperties;

  return (
    <html lang="es" className={`scroll-smooth ${fontVariables}`} style={themeVariables}>
      <body className="antialiased bg-background text-foreground">
        <SiteContentProvider content={content}>
          <CartProvider>
            <AdminTopBar isAdmin={isAdmin} />
            {!isAdmin && <PublicHeader />}
            {children}
            <SocialFloatingButtons />
          </CartProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}
