import Link from 'next/link';

export default function Home() {
  return (
    <main className="buyer-bodegon-bg text-amber-50">
      <div className="container-premium py-8 md:py-12">
      <section className="home-cover grain-overlay p-8 md:p-12 lg:p-16">
        <div className="flex min-h-[inherit] items-end">
          <div className="max-w-2xl space-y-7">
            <span className="wine-section-label">Vinoteca de selección</span>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-playfair font-semibold leading-[0.95] md:text-7xl">
                Su Bodega
              </h1>
              <p className="text-2xl md:text-3xl text-gold/95 font-playfair">Los mejores Vinos del pais</p>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-amber-100/78">
              Una experiencia de compra con carácter de cava clásica: etiquetas curadas, navegación simple y un recorrido pensado para descubrir vinos, vinos únicos y regalería.
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
        </div>
      </section>

      <section className="mt-16 grid gap-5 md:grid-cols-3">
        <Link href="/wines#guardados" className="home-category-card home-category-unique group">
          <div className="relative z-10 p-6">
            <span className="wine-section-label">Selección</span>
            <h2 className="mt-4 text-2xl font-semibold">Vinos únicos</h2>
            <p className="mt-3 leading-7 text-amber-100/82">
              Una sección especial para botellas con impronta de guarda, pensada para compradores que valoran evolución y carácter.
            </p>
            <span className="mt-5 inline-flex text-sm text-gold transition group-hover:translate-x-1">Explorar selección →</span>
          </div>
        </Link>
        <Link href="/wines" className="home-category-card home-category-varietals group">
          <div className="relative z-10 p-6">
            <span className="wine-section-label">Varietales</span>
            <h2 className="mt-4 text-2xl font-semibold">Tipos por variedad</h2>
            <p className="mt-3 leading-7 text-amber-100/82">
              Malbec, Cabernet, Chardonnay y más, con filtros claros para descubrir la cava según gusto y ocasión.
            </p>
            <span className="mt-5 inline-flex text-sm text-gold transition group-hover:translate-x-1">Ver vinos →</span>
          </div>
        </Link>
        <Link href="/wines#regaleria" className="home-category-card home-category-gifts group">
          <div className="relative z-10 p-6">
            <span className="wine-section-label">Presentación</span>
            <h2 className="mt-4 text-2xl font-semibold">Regalería</h2>
            <p className="mt-3 leading-7 text-amber-100/82">
              Opciones para regalar y acompañar una buena botella, cargadas directamente por la administración.
            </p>
            <span className="mt-5 inline-flex text-sm text-gold transition group-hover:translate-x-1">Descubrir regalería →</span>
          </div>
        </Link>
      </section>

      <section className="mt-16">
        <div className="wine-card p-7 md:p-8">
          <span className="wine-section-label">Cómo comprar</span>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gold/10 bg-black/20 p-5">
              <p className="text-gold text-sm">01</p>
              <h3 className="mt-2 text-xl font-playfair">Explora</h3>
              <p className="mt-2 text-sm leading-6 text-amber-100/68">Filtra por año, región y uva para llegar rápido a la botella correcta.</p>
            </div>
            <div className="rounded-2xl border border-gold/10 bg-black/20 p-5">
              <p className="text-gold text-sm">02</p>
              <h3 className="mt-2 text-xl font-playfair">Envía tu pedido</h3>
              <p className="mt-2 text-sm leading-6 text-amber-100/68">Revisa el carrito y envíalo directamente a Su Bodega por WhatsApp.</p>
            </div>
            <div className="rounded-2xl border border-gold/10 bg-black/20 p-5">
              <p className="text-gold text-sm">03</p>
              <h3 className="mt-2 text-xl font-playfair">Coordina</h3>
              <p className="mt-2 text-sm leading-6 text-amber-100/68">El dueño confirma disponibilidad, entrega y los detalles del pedido directamente por WhatsApp.</p>
            </div>
          </div>
        </div>

      </section>

      <footer className="mt-16 wine-card p-7 md:p-8">
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
      </footer>
      </div>
    </main>
  );
}
