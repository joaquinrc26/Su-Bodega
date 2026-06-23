import Link from 'next/link';

export default function Home() {
  return (
    <main className="buyer-bodegon-bg text-amber-50">
      <div className="container-premium py-8 md:py-12">
      <header className="sticky top-3 z-40 mb-10 rounded-2xl border border-gold/20 bg-black/65 px-4 py-4 backdrop-blur md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-sm uppercase tracking-[0.4em] text-gold">Su Bodega</span>
            <p className="mt-2 text-amber-100/72">Experiencia premium para compradores y gestión exclusiva para administración.</p>
          </div>

          <nav className="flex flex-wrap items-center gap-3">
            <Link href="/wines" className="btn-premium">
              Ver vinos
            </Link>
            <Link href="/buyer/orders" className="px-4 py-3 border rounded text-amber-50 border-amber-100/20 hover:border-gold">
              Mis compras
            </Link>
            <Link href="/admin" className="px-4 py-3 border rounded text-amber-50 border-amber-100/20 hover:border-gold">
              Ingreso admin
            </Link>
          </nav>
        </div>
      </header>

      <section className="wine-hero grain-overlay p-8 md:p-12 lg:p-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-7">
            <span className="wine-section-label">Vinoteca de selección</span>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-playfair font-semibold leading-[0.95] md:text-7xl">
                Su Bodega
              </h1>
              <p className="text-2xl md:text-3xl text-gold/95 font-playfair">Los mejores Vinos del pais</p>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-amber-100/78">
              Una experiencia de compra con carácter de cava clásica: etiquetas curadas, navegación simple y un recorrido pensado para descubrir vinos, guardados y whiskey con identidad propia.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/wines" className="btn-premium px-6 py-4 text-base">
                Descubrir colección
              </Link>
              <Link href="/cart" className="rounded-full border border-amber-100/20 px-6 py-4 text-center text-amber-50 transition hover:border-gold hover:bg-gold/10">
                Ver carrito
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            <div className="wine-stat">
              <p className="text-xs uppercase tracking-[0.3em] text-gold/75">Selección</p>
              <p className="mt-3 text-2xl font-playfair">Etiquetas curadas</p>
              <p className="mt-2 text-sm leading-6 text-amber-100/68">Catálogo cargado manualmente para mantener un perfil premium y coherente.</p>
            </div>
            <div className="wine-stat">
              <p className="text-xs uppercase tracking-[0.3em] text-gold/75">Compra</p>
              <p className="mt-3 text-2xl font-playfair">Checkout con cuenta</p>
              <p className="mt-2 text-sm leading-6 text-amber-100/68">El comprador crea su cuenta, completa su compra y luego revisa su historial.</p>
            </div>
            <div className="wine-stat">
              <p className="text-xs uppercase tracking-[0.3em] text-gold/75">Entrega</p>
              <p className="mt-3 text-2xl font-playfair">Envío y retiro</p>
              <p className="mt-2 text-sm leading-6 text-amber-100/68">Promoción de envío gratis y comunicación clara de sucursales y horarios.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="wine-card p-6">
          <span className="wine-section-label">Selección</span>
          <h2 className="mt-4 text-2xl font-semibold">Vinos guardados</h2>
          <p className="mt-3 leading-7 text-amber-100/72">
            Una sección especial para botellas con impronta de guarda, pensada para compradores que valoran evolución y carácter.
          </p>
        </div>
        <div className="wine-card p-6">
          <span className="wine-section-label">Varietales</span>
          <h2 className="mt-4 text-2xl font-semibold">Tipos por variedad</h2>
          <p className="mt-3 leading-7 text-amber-100/72">
            Malbec, Cabernet, Chardonnay y más, con filtros claros para descubrir la cava según gusto y ocasión.
          </p>
        </div>
        <div className="wine-card p-6">
          <span className="wine-section-label">Presentación</span>
          <h2 className="mt-4 text-2xl font-semibold">Botellas con presencia</h2>
          <p className="mt-3 leading-7 text-amber-100/72">
            La imagen de cada botella acompaña la decisión de compra y vuelve la navegación más sensorial y cuidada.
          </p>
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="wine-card p-7 md:p-8">
          <span className="wine-section-label">Recorrido buyer</span>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gold/10 bg-black/20 p-5">
              <p className="text-gold text-sm">01</p>
              <h3 className="mt-2 text-xl font-playfair">Explora</h3>
              <p className="mt-2 text-sm leading-6 text-amber-100/68">Filtra por año, región y uva para llegar rápido a la botella correcta.</p>
            </div>
            <div className="rounded-2xl border border-gold/10 bg-black/20 p-5">
              <p className="text-gold text-sm">02</p>
              <h3 className="mt-2 text-xl font-playfair">Compra</h3>
              <p className="mt-2 text-sm leading-6 text-amber-100/68">Confirma tu carrito con una cuenta buyer y un checkout simple y claro.</p>
            </div>
            <div className="rounded-2xl border border-gold/10 bg-black/20 p-5">
              <p className="text-gold text-sm">03</p>
              <h3 className="mt-2 text-xl font-playfair">Vuelve</h3>
              <p className="mt-2 text-sm leading-6 text-amber-100/68">Consulta el historial de compras para repetir etiquetas o revisar entregas.</p>
            </div>
          </div>
        </div>

        <div className="wine-card p-7 md:p-8">
          <span className="wine-section-label">Atención</span>
          <h2 className="mt-4 text-3xl font-playfair">Sucursales</h2>
          <p className="mt-3 max-w-xl leading-7 text-amber-100/72">
            Atención personalizada, selección de etiquetas y asesoramiento en cualquiera de nuestras dos ubicaciones.
          </p>
          <div className="wine-divider my-6" />
          <div className="space-y-4 text-amber-50">
            <div className="rounded-2xl border border-gold/14 bg-black/20 p-5">
              <h3 className="font-semibold">Su Bodega · Calle 9 Nº605</h3>
              <p className="mt-2 text-sm leading-6 text-amber-100/68">Lunes a Viernes: 9 a 13 hs y 16 a 20 hs</p>
              <p className="text-sm leading-6 text-amber-100/68">Sábados: 10 a 13 hs y 17 a 20 hs</p>
            </div>
            <div className="rounded-2xl border border-gold/14 bg-black/20 p-5">
              <h3 className="font-semibold">Su Bodega · Calle 35 Nº693</h3>
              <p className="mt-2 text-sm leading-6 text-amber-100/68">Lunes a Viernes: 9 a 13 hs y 16 a 20 hs</p>
              <p className="text-sm leading-6 text-amber-100/68">Sábados: 10 a 13 hs</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-16 wine-card p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <span className="wine-section-label">Identidad</span>
            <h2 className="mt-4 text-2xl font-semibold">Una cava digital con tono de vinoteca real</h2>
            <p className="mt-3 max-w-xl leading-7 text-amber-100/68">
              La experiencia buyer fue pensada para priorizar etiquetas, información útil y una estética sobria, cálida y confiable.
            </p>
          </div>

          <div className="rounded-xl border border-gold/20 bg-black/30 p-5 h-fit">
            <h3 className="text-lg font-semibold mb-3">Vistas separadas del proyecto</h3>
            <p className="leading-7 text-amber-100/68">
              Públicas: inicio, catálogo, detalle, carrito, checkout y estados de pago. Buyer: acceso y mis compras. Admin: login, dashboard y carga manual.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </main>
  );
}
