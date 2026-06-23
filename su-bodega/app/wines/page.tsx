'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';

type WinePhoto = { id: string; url: string };
type GrapeType = { id: string; name: string };
type Wine = {
  id: string;
  name: string;
  year: number;
  price?: number;
  region?: string;
  bodega?: string;
  maridaje?: string;
  description?: string;
  grapeType?: GrapeType | null;
  photos: WinePhoto[];
};

type SectionType = 'vinos' | 'guardados' | 'whiskey';

function normalizedText(wine: Wine) {
  return `${wine.name} ${wine.description || ''} ${wine.bodega || ''} ${wine.grapeType?.name || ''}`.toLowerCase();
}

export default function WinesPage() {
  const { addToCart, itemCount } = useCart();
  const [wines, setWines] = useState<Wine[]>([]);
  const [grapes, setGrapes] = useState<GrapeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [searchName, setSearchName] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('');
  const [filterGrape, setFilterGrape] = useState<string>('');
  const [filterRegion, setFilterRegion] = useState<string>('');
  const [sortBy, setSortBy] = useState<'none' | 'price-asc' | 'price-desc' | 'year-asc' | 'year-desc'>('none');
  const [section, setSection] = useState<SectionType>('vinos');

  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(wines.map((wine) => wine.year)));
    return uniqueYears.sort((a, b) => b - a);
  }, [wines]);

  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(wines.map((wine) => wine.region).filter(Boolean)));
    return uniqueRegions.sort();
  }, [wines]);

  useEffect(() => {
    fetch('/api/grapes')
      .then((res) => res.json())
      .then(setGrapes)
      .catch(() => setGrapes([]));
  }, []);

  useEffect(() => {
    async function loadWines() {
      setLoading(true);
      setMessage(null);
      try {
        const res = await fetch('/api/wines');
        const data = await res.json();
        setWines(data);
      } catch {
        setMessage('No se pudieron cargar los productos por ahora.');
        setWines([]);
      } finally {
        setLoading(false);
      }
    }
    loadWines();
  }, []);

  const sectionWines = useMemo(() => {
    if (section === 'guardados') {
      return wines.filter((wine) => normalizedText(wine).includes('guardado'));
    }

    if (section === 'whiskey') {
      return wines.filter((wine) => {
        const text = normalizedText(wine);
        return text.includes('whisky') || text.includes('whiskey');
      });
    }

    return wines.filter((wine) => {
      const text = normalizedText(wine);
      return !text.includes('guardado') && !text.includes('whisky') && !text.includes('whiskey');
    });
  }, [wines, section]);

  const filteredWines = useMemo(() => {
    let result = [...sectionWines];

    if (searchName.trim()) {
      const search = searchName.toLowerCase();
      result = result.filter(
        (wine) =>
          wine.name.toLowerCase().includes(search) ||
          wine.bodega?.toLowerCase().includes(search) ||
          wine.description?.toLowerCase().includes(search)
      );
    }

    if (filterYear) {
      result = result.filter((wine) => wine.year.toString() === filterYear);
    }

    if (filterGrape) {
      result = result.filter((wine) => wine.grapeType?.id === filterGrape);
    }

    if (filterRegion) {
      result = result.filter((wine) => wine.region === filterRegion);
    }

    if (sortBy !== 'none') {
      result.sort((a, b) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;

        switch (sortBy) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'year-asc':
            return a.year - b.year;
          case 'year-desc':
            return b.year - a.year;
          default:
            return 0;
        }
      });
    }

    return result;
  }, [sectionWines, searchName, filterYear, filterGrape, filterRegion, sortBy]);

  const sectionCopy = useMemo(() => {
    if (section === 'guardados') {
      return {
        title: 'Vinos guardados',
        subtitle: 'Seleccion curada y cargada manualmente por administracion.',
      };
    }

    if (section === 'whiskey') {
      return {
        title: 'Whiskey',
        subtitle: 'Seleccion de etiquetas de whiskey cargadas manualmente por administracion.',
      };
    }

    return {
      title: 'Vinos',
      subtitle: 'Catalogo principal de vinos, cargado manualmente por administracion.',
    };
  }, [section]);

  const handleAddToCart = (e: React.MouseEvent, wine: Wine) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: wine.id,
      name: wine.name,
      price: wine.price || 0,
      quantity: 1,
      image: wine.photos[0]?.url,
      year: wine.year,
    });
  };

  return (
    <main className="min-h-screen buyer-bodegon-bg text-amber-50">
      <div className="container-premium py-10 md:py-14">
        <header className="wine-hero grain-overlay p-6 md:p-10 mb-8 md:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-4">
              <span className="wine-section-label">Casa tradicional</span>
              <h1 className="text-5xl md:text-7xl font-playfair leading-none">Su Bodega</h1>
              <p className="text-xl md:text-2xl text-amber-100/90 font-serif">Los mejores Vinos del pais</p>
              <p className="max-w-2xl text-amber-100/80 leading-7">
                Estilo de vinoteca clasica con alma de bodegon antiguo. El comprador solo visualiza productos ya cargados.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/60 bg-black/40 px-5 py-3 text-sm hover:border-gold"
              >
                Carrito
                {itemCount > 0 && <span className="rounded-full bg-gold px-2 py-0.5 text-black font-semibold">{itemCount}</span>}
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-amber-200/30 px-5 py-3 text-sm hover:border-gold"
              >
                Volver al inicio
              </Link>
            </div>
          </div>

          <div className="wine-divider mt-8 mb-6" />

          <nav className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSection('vinos')}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                section === 'vinos'
                  ? 'border-gold bg-black/30 text-gold shadow-[0_18px_40px_rgba(0,0,0,0.2)]'
                  : 'border-amber-100/20 bg-black/15 text-amber-100 hover:border-gold/70'
              }`}
            >
              <p className="text-sm uppercase tracking-[0.2em]">Seccion</p>
              <p className="text-lg font-semibold mt-1">Vinos</p>
            </button>
            <button
              type="button"
              onClick={() => setSection('guardados')}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                section === 'guardados'
                  ? 'border-gold bg-black/30 text-gold shadow-[0_18px_40px_rgba(0,0,0,0.2)]'
                  : 'border-amber-100/20 bg-black/15 text-amber-100 hover:border-gold/70'
              }`}
            >
              <p className="text-sm uppercase tracking-[0.2em]">Seccion</p>
              <p className="text-lg font-semibold mt-1">Vinos guardados</p>
            </button>
            <button
              type="button"
              onClick={() => setSection('whiskey')}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                section === 'whiskey'
                  ? 'border-gold bg-black/30 text-gold shadow-[0_18px_40px_rgba(0,0,0,0.2)]'
                  : 'border-amber-100/20 bg-black/15 text-amber-100 hover:border-gold/70'
              }`}
            >
              <p className="text-sm uppercase tracking-[0.2em]">Seccion</p>
              <p className="text-lg font-semibold mt-1">Whiskey</p>
            </button>
          </nav>
        </header>

        <section className="wine-card p-5 md:p-7 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs uppercase tracking-[0.22em] text-amber-200/80 mb-2">Buscar</label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Nombre, bodega o descripcion"
                className="w-full rounded-lg border border-amber-100/20 bg-black/35 px-4 py-3 text-amber-50 placeholder:text-amber-100/45 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.22em] text-amber-200/80 mb-2">Ano</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full rounded-lg border border-amber-100/20 bg-black/35 px-3 py-3 text-amber-50 focus:outline-none focus:border-gold"
              >
                <option value="">Todos</option>
                {years.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.22em] text-amber-200/80 mb-2">Region</label>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="w-full rounded-lg border border-amber-100/20 bg-black/35 px-3 py-3 text-amber-50 focus:outline-none focus:border-gold"
              >
                <option value="">Todas</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.22em] text-amber-200/80 mb-2">Uva</label>
              <select
                value={filterGrape}
                onChange={(e) => setFilterGrape(e.target.value)}
                className="w-full rounded-lg border border-amber-100/20 bg-black/35 px-3 py-3 text-amber-50 focus:outline-none focus:border-gold"
              >
                <option value="">Todas</option>
                {grapes.map((grape) => (
                  <option key={grape.id} value={grape.id}>
                    {grape.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs uppercase tracking-[0.22em] text-amber-200/80 mb-2">Ordenar</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full rounded-lg border border-amber-100/20 bg-black/35 px-3 py-3 text-amber-50 focus:outline-none focus:border-gold"
              >
                <option value="none">Relevancia</option>
                <option value="price-asc">Precio: Menor a mayor</option>
                <option value="price-desc">Precio: Mayor a menor</option>
                <option value="year-asc">Ano: Antiguos primero</option>
                <option value="year-desc">Ano: Recientes primero</option>
              </select>
            </div>

            <div className="md:col-span-2 flex md:justify-end">
              <button
                type="button"
                onClick={() => {
                  setSearchName('');
                  setFilterYear('');
                  setFilterGrape('');
                  setFilterRegion('');
                  setSortBy('none');
                }}
                className="rounded-full border border-amber-100/20 px-4 py-2 text-sm text-amber-100 hover:border-gold"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </section>

        <section className="mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <div>
            <span className="wine-section-label">Colección visible</span>
            <h2 className="text-3xl font-playfair">{sectionCopy.title}</h2>
            <p className="text-amber-100/70 mt-1">{sectionCopy.subtitle}</p>
          </div>
          <p className="text-sm text-amber-100/75">
            Mostrando {filteredWines.length} de {sectionWines.length} etiquetas de la seccion
          </p>
        </section>

        {loading ? (
          <section className="buyer-paper rounded-2xl p-10 text-center">
            <p className="text-amber-100/80">Cargando seleccion...</p>
          </section>
        ) : filteredWines.length === 0 ? (
          <section className="buyer-paper rounded-2xl p-10 text-center">
            <p className="text-xl">No hay productos en esta seccion con los filtros actuales.</p>
            <p className="text-amber-100/70 mt-2">Esta vista solo muestra productos cargados previamente por administracion.</p>
          </section>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredWines.map((wine) => (
              <Link
                key={wine.id}
                href={`/wines/${wine.id}`}
                className="wine-card overflow-hidden group hover:translate-y-[-4px] transition-transform"
              >
                <div className="relative h-64 bg-black/40 overflow-hidden">
                  {wine.photos[0] ? (
                    <Image
                      src={wine.photos[0].url}
                      alt={wine.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-amber-100/50">Sin imagen</div>
                  )}
                </div>

                <div className="p-5 flex flex-col gap-4">
                  <div>
                    <h3 className="text-xl font-playfair leading-tight">{wine.name}</h3>
                    <p className="text-sm text-amber-100/70 mt-1">
                      {wine.year}
                      {wine.region ? ` · ${wine.region}` : ''}
                    </p>
                    {wine.grapeType?.name && <p className="text-sm text-gold mt-1">Uva: {wine.grapeType.name}</p>}
                    {wine.bodega && <p className="text-xs text-amber-100/65 mt-1">Bodega: {wine.bodega}</p>}
                  </div>

                  <div className="wine-divider" />

                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-amber-100/55">Precio</p>
                      <p className="text-lg font-semibold text-gold">${(wine.price || 0).toLocaleString('es-AR')}</p>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, wine)}
                      className="rounded-full border border-gold/60 px-4 py-2 text-sm hover:border-gold hover:bg-gold/10"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}

        {message && <p className="mt-8 text-center text-red-300">{message}</p>}
      </div>
    </main>
  );
}
