export default function Home() {
  return (
    <main className="container-premium py-12">
      <section className="grid gap-10 lg:grid-cols-[1fr_420px] items-center">
        <div className="space-y-6">
          <span className="text-sm uppercase tracking-[0.4em] text-gold">Su Bodega</span>
          <h1 className="text-5xl md:text-6xl font-playfair font-semibold leading-tight">
            Tu tienda de vinos con la experiencia de bodega premium.
          </h1>
          <p className="max-w-2xl text-slate-200 leading-8 text-lg">
            Elegí tu próximo vino por año o por tipo de uva, cargá la botella con foto y compartí el estilo de tu
            bodega. Inspirado en los mejores sitios de venta de vinos de Argentina.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/wines" className="btn-premium">
              Ver catálogo
            </a>
            <a href="/admin" className="px-4 py-3 border rounded text-slate-100 border-slate-600 hover:border-gold">
              Ingreso admin
            </a>
          </div>
        </div>

        <div className="card-premium p-6 glass space-y-6">
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

          <div className="rounded-xl border border-gold/20 bg-black/50 p-5">
            <h3 className="text-lg font-semibold mb-3">Contacto</h3>
            <p className="text-slate-300 leading-7">
              Visitanos en cualquiera de nuestras sucursales o cargá vinos desde tu celular. Atención premium,
              selección de etiquetas y asesoramiento personalizado.
            </p>
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
    </main>
  );
}
