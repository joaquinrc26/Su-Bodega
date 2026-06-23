import Link from 'next/link';

export default function Home() {
  return (
    <main className="container-premium py-12">
      <header className="sticky top-3 z-40 mb-10 rounded-2xl border border-gold/20 bg-black/65 px-4 py-4 backdrop-blur md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-sm uppercase tracking-[0.4em] text-gold">Su Bodega</span>
            <p className="text-slate-300 mt-2">Experiencia premium para compradores y gestión exclusiva para administración.</p>
          </div>

          <nav className="flex flex-wrap items-center gap-3">
            <Link href="/wines" className="btn-premium">
              Ver vinos
            </Link>
            <Link href="/buyer/orders" className="px-4 py-3 border rounded text-slate-100 border-slate-600 hover:border-gold">
              Mis compras
            </Link>
            <Link href="/admin" className="px-4 py-3 border rounded text-slate-100 border-slate-600 hover:border-gold">
              Ingreso admin
            </Link>
          </nav>
        </div>
      </header>

      <section className="grid gap-10 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-playfair font-semibold leading-tight">Su Bodega</h1>
          <p className="text-2xl md:text-3xl text-gold/95 font-playfair">Los mejores Vinos del pais</p>
          <p className="max-w-2xl text-slate-200 leading-8 text-lg">
            Elegí tu próximo vino por año o por tipo de uva y recorré una selección curada. Las cargas de productos
            las realiza únicamente el administrador.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/wines" className="btn-premium">
              Ver catálogo
            </Link>
            <Link href="/cart" className="px-4 py-3 border rounded text-slate-100 border-slate-600 hover:border-gold">
              Ver carrito
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="card-premium p-6 glass">
          <span className="text-sm uppercase tracking-[0.2em] text-gold">Selección</span>
          <h2 className="text-2xl font-semibold mt-3">Vinos guardados</h2>
          <p className="mt-3 text-slate-300 leading-7">
            Tu cliente puede elegir vinos según su año y conservar la información de cada botella, ideal para una
            bodega con propuesta premium.
          </p>
        </div>
        <div className="card-premium p-6 glass">
          <span className="text-sm uppercase tracking-[0.2em] text-gold">Uvas</span>
          <h2 className="text-2xl font-semibold mt-3">Tipos por variedad</h2>
          <p className="mt-3 text-slate-300 leading-7">
            Organiza las etiquetas por tipo de uva y permite a los clientes filtrar entre Malbec, Cabernet, Chardonnay y más.
          </p>
        </div>
        <div className="card-premium p-6 glass">
          <span className="text-sm uppercase tracking-[0.2em] text-gold">Imágenes</span>
          <h2 className="text-2xl font-semibold mt-3">Botellas con foto</h2>
          <p className="mt-3 text-slate-300 leading-7">
            Cada vino puede incorporar la foto de la botella para que la experiencia de compra sea más visual y cuidada.
          </p>
        </div>
      </section>

      <footer className="mt-16 card-premium p-6 glass">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Sucursales</h2>
            <div className="space-y-4 text-slate-100">
              <div className="rounded-xl border border-gold/20 bg-black/50 p-4">
                <h3 className="font-semibold">Su Bodega - Calle 9 Nº605</h3>
                <p className="text-sm leading-6">Lunes a Viernes: 9 a 13 hs y 16 a 20 hs</p>
                <p className="text-sm leading-6">Sábados: 10 a 13 hs y 17 a 20 hs</p>
              </div>
              <div className="rounded-xl border border-gold/20 bg-black/50 p-4">
                <h3 className="font-semibold">Su Bodega - Calle 35 Nº693</h3>
                <p className="text-sm leading-6">Lunes a Viernes: 9 a 13 hs y 16 a 20 hs</p>
                <p className="text-sm leading-6">Sábados: 10 a 13 hs</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gold/20 bg-black/50 p-5 h-fit">
            <h3 className="text-lg font-semibold mb-3">Información</h3>
            <p className="text-slate-300 leading-7">
              Visitanos en cualquiera de nuestras sucursales. Atención premium, selección de etiquetas y
              asesoramiento personalizado.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
