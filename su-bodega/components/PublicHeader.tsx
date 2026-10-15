import Link from 'next/link';
import { getSiteContent } from '@/lib/site-content';

export default async function PublicHeader() {
  const c = await getSiteContent();

  return (
    <header className="public-header sticky top-0 z-40 border-b border-gold/20 bg-[#120d0a]/90 backdrop-blur-xl">
      <div className="container-premium flex min-h-16 items-center justify-between gap-4 py-3">
        <Link href="/" className="shrink-0" aria-label="Ir al inicio de Su Bodega">
          <span className="text-sm uppercase tracking-[0.34em] text-gold">{c['brand.name']}</span>
          <span className="mt-1 hidden text-[10px] uppercase tracking-[0.2em] text-amber-100/50 sm:block">{c['brand.tagline']}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación de la tienda">
          <Link href="/wines" className="public-nav-link">{c['sec.vinos.name']}</Link>
          <Link href="/wines#guardados" className="public-nav-link">{c['sec.guardados.name']}</Link>
          <Link href="/wines#regaleria" className="public-nav-link">{c['sec.regaleria.name']}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="public-header-icon" aria-label="Ver carrito" title="Ver carrito">
            <span aria-hidden="true">🛒</span>
          </Link>
        </div>
      </div>

      <nav className="container-premium flex gap-1 overflow-x-auto pb-3 md:hidden" aria-label="Navegación móvil de la tienda">
        <Link href="/wines" className="public-nav-link whitespace-nowrap">{c['sec.vinos.name']}</Link>
        <Link href="/wines#guardados" className="public-nav-link whitespace-nowrap">{c['sec.guardados.name']}</Link>
        <Link href="/wines#regaleria" className="public-nav-link whitespace-nowrap">{c['sec.regaleria.name']}</Link>
      </nav>
    </header>
  );
}
