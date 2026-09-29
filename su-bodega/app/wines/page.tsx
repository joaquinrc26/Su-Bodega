'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';

type WinePhoto = { id: string; url: string };
type GrapeType = { id: string; name: string };
type ProductCategory = { id: string; slug: string; name: string };
type Wine = {
  id: string;
  name: string;
  year: number;
  price?: number;
  stock: number;
  region?: string;
  bodega?: string;
  maridaje?: string;
  description?: string;
  grapeType?: GrapeType | null;
  category?: ProductCategory | null;
  photos: WinePhoto[];
};

type SectionType = 'vinos' | 'guardados' | 'regaleria';

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
    function syncSectionWithHash() {
      const hash = window.location.hash;
      if (hash === '#guardados') setSection('guardados');
      else if (hash === '#regaleria') setSection('regaleria');
      else setSection('vinos');
    }

    syncSectionWithHash();
    window.addEventListener('hashchange', syncSectionWithHash);

    fetch('/api/grapes')
      .then((res) => res.json())
      .then(setGrapes)
      .catch(() => setGrapes([]));

    return () => window.removeEventListener('hashchange', syncSectionWithHash);
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
      return wines.filter((wine) => wine.category?.slug === 'vino-guardado');
    }

    if (section === 'regaleria') {
      return wines.filter((wine) => wine.category?.slug === 'regaleria');
    }

    return wines.filter((wine) => wine.category?.slug === 'vino');
  }, [wines, section]);

  const sectionCounts = useMemo(() => ({
    vinos: wines.filter((wine) => wine.category?.slug === 'vino').length,
    guardados: wines.filter((wine) => wine.category?.slug === 'vino-guardado').length,
    regaleria: wines.filter((wine) => wine.category?.slug === 'regaleria').length,
  }), [wines]);

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
        title: 'Vinos únicos',
        subtitle: 'Seleccion curada y cargada manualmente por administracion.',
      };
    }

    if (section === 'regaleria') {
      return {
        title: 'Regalería',
        subtitle: 'Regalos y accesorios seleccionados por la bodega.',
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
      stock: wine.stock ?? 0,
    });
  };

  const getStockLabel = (stock: number) => {
    if (stock <= 0) return { label: 'Sin stock', className: 'text-red-200 border-red-300/25 bg-red-950/20' };
    if (stock <= 3) return { label: `Poco stock · ${stock} unidades`, className: 'text-amber-200 border-amber-300/25 bg-amber-950/20' };
    return { label: `Disponible · ${stock} unidades`, className: 'text-emerald-200 border-emerald-300/25 bg-emerald-950/20' };
  };

  return (
    <main className="min-h-screen buyer-bodegon-bg text-amber-50">
      <div className="container-premium py-10 md:py-14">
        <header className="catalog-hero wine-hero grain-overlay p-6 md:p-10 mb-8 md:mb-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-amber-100/55">
                <span>Su Bodega</span>
                <span className="text-gold/70">/</span>
                <span className="text-gold">Colección</span>
              </div>
              <h1 className="max-w-3xl text-5xl font-playfair leading-[0.95] md:text-7xl">La colección</h1>
              <p className="max-w-2xl text-amber-100/80 leading-7">
                Etiquetas elegidas para descubrir, regalar y disfrutar. Encontrá tu próxima botella en una selección cuidada por Su Bodega.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <div className="catalog-stat">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold/70">Etiquetas</span>
                <strong>{wines.length}</strong>
              </div>
              <div className="catalog-stat">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold/70">Secciones</span>
                <strong>03</strong>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:absolute lg:right-10 lg:top-10">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/60 bg-black/40 px-5 py-3 text-sm transition hover:border-gold hover:bg-gold/10"
              >
                <span aria-hidden="true">🛒</span> Carrito
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

          <nav className="catalog-tabs grid grid-cols-1 gap-2 sm:grid-cols-3" aria-label="Secciones de la colección">
            <button
              type="button"
              onClick={() => setSection('vinos')}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                section === 'vinos'
                  ? 'border-gold bg-black/30 text-gold shadow-[0_18px_40px_rgba(0,0,0,0.2)]'
                  : 'border-amber-100/20 bg-black/15 text-amber-100 hover:border-gold/70'
              }`}
            >
              <span className="text-xs uppercase tracking-[0.2em]">01 · Tintos, blancos y rosados</span>
              <span className="mt-2 flex items-center justify-between text-lg font-semibold">Vinos <small>{sectionCounts.vinos}</small></span>
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
              <span className="text-xs uppercase tracking-[0.2em]">02 · Tiempo y carácter</span>
              <span className="mt-2 flex items-center justify-between text-lg font-semibold">Vinos únicos <small>{sectionCounts.guardados}</small></span>
            </button>
            <button
              type="button"
              onClick={() => setSection('regaleria')}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                section === 'regaleria'
                  ? 'border-gold bg-black/30 text-gold shadow-[0_18px_40px_rgba(0,0,0,0.2)]'
                  : 'border-amber-100/20 bg-black/15 text-amber-100 hover:border-gold/70'
              }`}
            >
              <span className="text-xs uppercase tracking-[0.2em]">03 · Para celebrar</span>
              <span className="mt-2 flex items-center justify-between text-lg font-semibold">Regalería <small>{sectionCounts.regaleria}</small></span>
            </button>
          </nav>
        </header>

        <section className="catalog-filters wine-card p-5 md:p-7 mb-8">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="wine-section-label">Encontrá tu etiqueta</span>
              <h2 className="mt-3 text-2xl font-playfair">Filtrar colección</h2>
            </div>
            <p className="text-sm text-amber-100/55">Refiná la selección según tu ocasión.</p>
          </div>
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
                id="filter-year"
                aria-label="Filtrar vinos por año"
                title="Filtrar vinos por año"
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
                id="filter-region"
                aria-label="Filtrar vinos por región"
                title="Filtrar vinos por región"
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
                id="filter-grape"
                aria-label="Filtrar vinos por tipo de uva"
                title="Filtrar vinos por tipo de uva"
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

          <div className="mt-4 grid grid-cols-1 gap-4 items-end border-t border-gold/10 pt-4 md:grid-cols-3">
            <div>
              <label className="block text-xs uppercase tracking-[0.22em] text-amber-200/80 mb-2">Ordenar</label>
              <select
                id="sort-by"
                aria-label="Ordenar vinos"
                title="Ordenar vinos"
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

        <section className="mb-5 flex flex-col gap-3 border-b border-gold/15 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="wine-section-label">Colección visible</span>
            <h2 className="text-3xl font-playfair">{sectionCopy.title}</h2>
            <p className="text-amber-100/70 mt-1">{sectionCopy.subtitle}</p>
          </div>
          <p className="text-sm text-amber-100/60">
            {filteredWines.length} {filteredWines.length === 1 ? 'etiqueta disponible' : 'etiquetas disponibles'}
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
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredWines.map((wine) => (
              <Link
                key={wine.id}
                href={`/wines/${wine.id}`}
                className="catalog-product-card wine-card group overflow-hidden transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_center,rgba(200,169,107,0.12),rgba(0,0,0,0.4)_62%)]">
                  {wine.photos[0] ? (
                    <Image
                      src={wine.photos[0].url}
                      alt={wine.name}
                      fill
                      className="object-contain p-5 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-amber-100/50">Sin imagen</div>
                  )}
                </div>

                <div className="flex min-h-[245px] flex-col gap-4 p-5">
                  <div>
                    <h3 className="text-xl font-playfair leading-tight text-amber-50">{wine.name}</h3>
                    <p className="text-sm text-amber-100/70 mt-1">
                      {wine.year}
                      {wine.region ? ` · ${wine.region}` : ''}
                    </p>
                    {wine.grapeType?.name && <p className="text-sm text-gold mt-1">Uva: {wine.grapeType.name}</p>}
                    {wine.bodega && <p className="text-xs text-amber-100/65 mt-1">Bodega: {wine.bodega}</p>}
                    <span className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[11px] ${getStockLabel(wine.stock).className}`}>
                      {getStockLabel(wine.stock).label}
                    </span>
                  </div>

                  <div className="wine-divider" />

                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-amber-100/55">Precio</p>
                      <p className="text-xl font-semibold text-gold">${(wine.price || 0).toLocaleString('es-AR')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, wine)}
                      disabled={wine.stock <= 0}
                      className="rounded-full border border-gold/60 px-4 py-2 text-sm transition hover:border-gold hover:bg-gold/10 disabled:cursor-not-allowed disabled:border-amber-100/15 disabled:text-amber-100/35 disabled:hover:bg-transparent"
                    >
                      {wine.stock > 0 ? 'Agregar' : 'Agotado'}
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
