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

export default function WinesPage() {
  const { addToCart, itemCount } = useCart();
  const [wines, setWines] = useState<Wine[]>([]);
  const [grapes, setGrapes] = useState<GrapeType[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Filtros y búsqueda
  const [searchName, setSearchName] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('');
  const [filterGrape, setFilterGrape] = useState<string>('');
  const [filterRegion, setFilterRegion] = useState<string>('');
  const [sortBy, setSortBy] = useState<'none' | 'price-asc' | 'price-desc' | 'year-asc' | 'year-desc'>('none');

  // Obtener lista de años y regiones únicos
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(wines.map((wine) => wine.year)));
    return uniqueYears.sort((a, b) => b - a);
  }, [wines]);

  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(wines.map((wine) => wine.region).filter(Boolean)));
    return uniqueRegions.sort();
  }, [wines]);

  // Cargar tipos de uva
  useEffect(() => {
    fetch('/api/grapes')
      .then((res) => res.json())
      .then(setGrapes)
      .catch(() => setGrapes([]));
  }, []);

  // Cargar todos los vinos
  useEffect(() => {
    async function loadWines() {
      setLoading(true);
      setMessage(null);
      try {
        const res = await fetch('/api/wines');
        const data = await res.json();
        setWines(data);
      } catch {
        setMessage('No se pudieron cargar los vinos.');
        setWines([]);
      } finally {
        setLoading(false);
      }
    }
    loadWines();
  }, []);

  // Filtrar y ordenar vinos
  const filteredWines = useMemo(() => {
    let result = [...wines];

    // Filtro por nombre
    if (searchName.trim()) {
      const search = searchName.toLowerCase();
      result = result.filter(
        (wine) =>
          wine.name.toLowerCase().includes(search) ||
          wine.bodega?.toLowerCase().includes(search) ||
          wine.description?.toLowerCase().includes(search)
      );
    }

    // Filtro por año
    if (filterYear) {
      result = result.filter((wine) => wine.year.toString() === filterYear);
    }

    // Filtro por tipo de uva
    if (filterGrape) {
      result = result.filter((wine) => wine.grapeType?.id === filterGrape);
    }

    // Filtro por región
    if (filterRegion) {
      result = result.filter((wine) => wine.region === filterRegion);
    }

    // Ordenamiento
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
  }, [wines, searchName, filterYear, filterGrape, filterRegion, sortBy]);

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

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container-premium py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <section>
            <span className="text-sm uppercase tracking-[0.4em] text-gold">Catálogo Su Bodega</span>
            <h1 className="text-4xl md:text-5xl font-playfair font-semibold mt-4 mb-2">
              Descubrí nuestros vinos premium
            </h1>
            <p className="text-lg max-w-2xl text-slate-200/90 leading-8">
              Filtrá, buscá y encontrá el vino ideal para tu mesa. Más de 50 etiquetas seleccionadas.
            </p>
          </section>
          <Link
            href="/cart"
            className="flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold/90 text-coal font-semibold rounded transition-colors self-start md:self-auto whitespace-nowrap"
          >
            🛒 Carrito
            {itemCount > 0 && <span className="bg-coal text-gold px-2 py-1 rounded text-sm font-bold">{itemCount}</span>}
          </Link>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="card-premium glass p-6 mb-8 border border-slate-700">
          <div className="space-y-4">
            {/* Búsqueda por nombre */}
            <div>
              <label className="block text-sm font-montserrat text-slate-300 mb-2">🔍 Buscar vino</label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Ej: Malbec, Cabernet, Bodega..."
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-gold focus:outline-none transition"
              />
            </div>

            {/* Filtros en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtro por año */}
              <div>
                <label className="block text-sm font-montserrat text-slate-300 mb-2">Año</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none transition"
                >
                  <option value="">Todos</option>
                  {years.map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por región */}
              <div>
                <label className="block text-sm font-montserrat text-slate-300 mb-2">Región</label>
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none transition"
                >
                  <option value="">Todas</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por tipo de uva */}
              <div>
                <label className="block text-sm font-montserrat text-slate-300 mb-2">Tipo de Uva</label>
                <select
                  value={filterGrape}
                  onChange={(e) => setFilterGrape(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none transition"
                >
                  <option value="">Todos</option>
                  {grapes.map((grape) => (
                    <option key={grape.id} value={grape.id}>
                      {grape.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordenamiento */}
              <div>
                <label className="block text-sm font-montserrat text-slate-300 mb-2">Ordenar por</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none transition"
                >
                  <option value="none">Relevancia</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="year-asc">Año: Más Antiguos</option>
                  <option value="year-desc">Año: Más Recientes</option>
                </select>
              </div>
            </div>

            {/* Botón limpiar filtros */}
            {(searchName || filterYear || filterGrape || filterRegion || sortBy !== 'none') && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSearchName('');
                    setFilterYear('');
                    setFilterGrape('');
                    setFilterRegion('');
                    setSortBy('none');
                  }}
                  className="text-sm text-gold hover:text-gold/80 underline"
                >
                  ✕ Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Cargando vinos...</p>
          </div>
        ) : filteredWines.length === 0 ? (
          <div className="card-premium glass p-12 text-center border border-slate-700">
            <p className="text-xl text-slate-300 mb-4">No se encontraron vinos con esos filtros</p>
            <button
              onClick={() => {
                setSearchName('');
                setFilterYear('');
                setFilterGrape('');
                setFilterRegion('');
                setSortBy('none');
              }}
              className="text-gold hover:text-gold/80 underline"
            >
              Ver todos los vinos
            </button>
          </div>
        ) : (
          <>
            <div className="text-slate-300 mb-4">
              Mostrando <span className="text-gold font-semibold">{filteredWines.length}</span> de{' '}
              <span className="text-gold font-semibold">{wines.length}</span> vinos
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredWines.map((wine) => (
                <Link
                  key={wine.id}
                  href={`/wines/${wine.id}`}
                  className="card-premium glass group cursor-pointer border border-slate-700 hover:border-gold transition-all duration-300 overflow-hidden flex flex-col h-full"
                >
                  {/* Imagen */}
                  <div className="relative h-48 bg-slate-800 overflow-hidden">
                    {wine.photos[0] ? (
                      <Image
                        src={wine.photos[0].url}
                        alt={wine.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">Sin imagen</div>
                    )}
                    {/* Botón favorito */}
                    <button
                      onClick={(e) => toggleFavorite(e, wine.id)}
                      className="absolute top-3 right-3 text-2xl hover:scale-125 transition-transform"
                    >
                      {favorites.has(wine.id) ? '❤️' : '🤍'}
                    </button>
                  </div>

                  {/* Contenido */}
                  <div className="flex-grow p-4 flex flex-col justify-between">
                    {/* Info */}
                    <div className="mb-3">
                      <h3 className="text-lg font-playfair font-semibold line-clamp-2">{wine.name}</h3>
                      {wine.bodega && <p className="text-xs text-slate-400 mt-1">{wine.bodega}</p>}
                      <div className="flex gap-2 mt-2 text-xs text-slate-400">
                        <span>{wine.year}</span>
                        {wine.region && <span>•</span>}
                        {wine.region && <span>{wine.region}</span>}
                      </div>
                      {wine.grapeType && <p className="text-xs text-gold mt-1">{wine.grapeType.name}</p>}
                      {wine.maridaje && <p className="text-xs text-slate-300 mt-2 italic">{wine.maridaje}</p>}
                    </div>

                    {/* Precio */}
                    {wine.price && (
                      <p className="text-lg font-semibold text-gold mb-3">${wine.price.toLocaleString('es-AR')}</p>
                    )}

                    {/* Botón agregar */}
                    <button
                      onClick={(e) => handleAddToCart(e, wine)}
                      className="btn-premium w-full py-2 text-sm"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {message && <p className="mt-8 text-center text-red-400">{message}</p>}
      </div>
    </main>
  );
}
