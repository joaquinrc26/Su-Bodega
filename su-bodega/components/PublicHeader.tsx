import Link from 'next/link';

export default function PublicHeader() {
  return (
    <header className="public-header sticky top-0 z-40 border-b border-gold/20 bg-[#120d0a]/90 backdrop-blur-xl">
      <div className="container-premium flex min-h-16 items-center justify-between gap-4 py-3">
        <Link href="/" className="shrink-0" aria-label="Ir al inicio de Su Bodega">
          <span className="text-sm uppercase tracking-[0.34em] text-gold">Su Bodega</span>
          <span className="mt-1 hidden text-[10px] uppercase tracking-[0.2em] text-amber-100/50 sm:block">Vinoteca de selección</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación de la tienda">
          <Link href="/wines" className="public-nav-link">Vinos</Link>
          <Link href="/wines#guardados" className="public-nav-link">Vinos únicos</Link>
          <Link href="/wines#regaleria" className="public-nav-link">Regalería</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="public-header-icon" aria-label="Ver carrito" title="Ver carrito">
            <span aria-hidden="true">🛒</span>
          </Link>
        </div>
      </div>

      <nav className="container-premium flex gap-1 overflow-x-auto pb-3 md:hidden" aria-label="Navegación móvil de la tienda">
        <Link href="/wines" className="public-nav-link whitespace-nowrap">Vinos</Link>
        <Link href="/wines#guardados" className="public-nav-link whitespace-nowrap">Vinos únicos</Link>
        <Link href="/wines#regaleria" className="public-nav-link whitespace-nowrap">Regalería</Link>
      </nav>
    </header>
  );
}
