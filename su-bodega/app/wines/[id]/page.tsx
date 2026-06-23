'use client';

import { useEffect, useState } from 'react';
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
  createdAt?: string;
};

export default function WineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { addToCart } = useCart();
  const [wine, setWine] = useState<Wine | null>(null);
  const [relatedWines, setRelatedWines] = useState<Wine[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  // Resolver params (Server Component pattern)
  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  // Cargar vino
  useEffect(() => {
    if (!id) return;

    async function fetchWine() {
      try {
        setLoading(true);
        const res = await fetch(`/api/wines?id=${id}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setWine(data[0]);
        } else {
          setWine(null);
        }
      } catch {
        setWine(null);
      } finally {
        setLoading(false);
      }
    }

    fetchWine();
  }, [id]);

  // Cargar vinos relacionados (misma región o tipo de uva)
  useEffect(() => {
    if (!wine) {
      setRelatedWines([]);
      return;
    }

    const fetchRelated = async () => {
      if (!wine) return;
      try {
        const params = new URLSearchParams();
        if (wine.region) params.set('region', wine.region);
        const res = await fetch(`/api/wines?${params.toString()}`);
        const data = await res.json();
        const currentWineId = wine.id;
        const filtered = (Array.isArray(data) ? data : []).filter((w: Wine) => w.id !== currentWineId).slice(0, 4);
        setRelatedWines(filtered);
      } catch {
        setRelatedWines([]);
      }
    };

    fetchRelated();
  }, [wine]);

  if (loading) {
    return (
      <main className="container-premium py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-slate-400">Cargando vino...</p>
        </div>
      </main>
    );
  }

  if (!wine) {
    return (
      <main className="container-premium py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-slate-400 mb-4">Vino no encontrado</p>
          <Link href="/wines" className="btn-premium">
            ← Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  const mainImage = wine.photos[selectedImageIndex];
  const hasMultipleImages = wine.photos.length > 1;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: wine.id,
        name: wine.name,
        price: wine.price || 0,
        quantity: 1,
        image: wine.photos[0]?.url,
        year: wine.year,
      });
    }
    setMessage('✅ Agregado al carrito');
    setQuantity(1);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container-premium py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/wines" className="hover:text-gold">
            Catálogo
          </Link>
          <span>/</span>
          <span className="text-gold">{wine.name}</span>
        </div>

        {/* Main Content */}
        <div className="grid gap-12 md:grid-cols-2 mb-12">
          {/* Galería de Imágenes */}
          <div className="space-y-4">
            {/* Imagen Principal */}
            <div
              className="relative h-96 md:h-[500px] rounded-lg overflow-hidden bg-slate-800 border border-slate-700 cursor-pointer group"
              onClick={() => setShowImageModal(true)}
            >
              {mainImage ? (
                <Image
                  src={mainImage.url}
                  alt={wine.name}
                  fill
                  className="w-full h-full object-cover group-hover:brightness-110 transition-all"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">Sin imagen</div>
              )}
              {hasMultipleImages && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="text-white text-center">
                    <div className="text-3xl mb-2">🔍</div>
                    <p className="text-sm">Expandir galería</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {hasMultipleImages && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {wine.photos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden transition-all ${
                      selectedImageIndex === idx ? 'border-gold' : 'border-slate-600 hover:border-gold'
                    }`}
                  >
                    <Image src={photo.url} alt={`${wine.name} ${idx + 1}`} width={80} height={80} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del Producto */}
          <div className="space-y-6">
            {/* Meta */}
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gold mb-2">
                {wine.region || 'Sin especificar'} • {wine.year}
              </p>
              <h1 className="text-5xl font-playfair font-semibold mb-2">{wine.name}</h1>
              {wine.bodega && <p className="text-lg text-slate-400">{wine.bodega}</p>}
            </div>

            {/* Precio */}
            {wine.price ? (
              <div className="border-y border-slate-700 py-6">
                <p className="text-sm text-slate-400 mb-1">Precio</p>
                <p className="text-5xl font-bold text-gold">${wine.price.toLocaleString('es-AR')}</p>
              </div>
            ) : (
              <div className="border-y border-slate-700 py-6">
                <p className="text-slate-400">Precio no disponible</p>
              </div>
            )}

            {/* Maridaje */}
            {wine.maridaje && wine.maridaje !== 'Versatile' && (
              <div className="card-premium p-4 glass">
                <p className="text-sm text-gold mb-2">🍽️ RECOMENDACIÓN DE MARIDAJE</p>
                <p className="text-slate-100">{wine.maridaje}</p>
              </div>
            )}

            {/* Selector de Cantidad y Botón */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-600 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-slate-800 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center bg-transparent border-x border-slate-600 py-3"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-slate-800 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-slate-400">
                  Total: ${((wine.price || 0) * quantity).toLocaleString('es-AR')}
                </span>
              </div>

              <button onClick={handleAddToCart} className="btn-premium w-full py-4 text-lg font-semibold">
                🛒 Agregar al carrito
              </button>

              {message && <p className="text-center text-green-400 text-sm">{message}</p>}

              <Link href="/cart" className="block w-full text-center px-4 py-3 border border-gold text-gold hover:bg-gold/10 rounded transition-colors">
                Ver carrito
              </Link>
            </div>

            {/* Info Envío */}
            <div className="card-premium p-4 glass text-sm space-y-2">
              <div className="flex gap-2">
                <span>🚚</span>
                <span>Envío gratis a CABA y AMBA desde $200.000</span>
              </div>
              <div className="flex gap-2">
                <span>💳</span>
                <span>Hasta 6 cuotas sin interés en vinos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción Expandida */}
        {wine.description && (
          <section className="mb-12">
            <h2 className="text-3xl font-playfair font-semibold mb-6">Descripción</h2>
            <div className="card-premium p-8 glass">
              <p className="text-slate-200 leading-8 text-lg">{wine.description}</p>
            </div>
          </section>
        )}

        {/* Productos Relacionados */}
        {relatedWines.length > 0 && (
          <section>
            <h2 className="text-3xl font-playfair font-semibold mb-8">Vinos Relacionados</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {relatedWines.map((relatedWine) => (
                <Link key={relatedWine.id} href={`/wines/${relatedWine.id}`}>
                  <article className="card-premium overflow-hidden glass group hover:border-gold transition-all h-full cursor-pointer">
                    <div className="relative h-64 bg-slate-800 overflow-hidden">
                      {relatedWine.photos[0] ? (
                        <Image
                          src={relatedWine.photos[0].url}
                          alt={relatedWine.name}
                          fill
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">Sin imagen</div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-gold mb-1">
                        {relatedWine.year}
                      </p>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{relatedWine.name}</h3>
                      {relatedWine.price && (
                        <p className="text-xl font-bold text-gold">${relatedWine.price.toLocaleString('es-AR')}</p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modal Galería Expandida */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Imagen */}
            {mainImage && (
              <div className="relative w-full h-96 md:h-[600px]">
                <Image
                  src={mainImage.url}
                  alt={wine.name}
                  fill
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Controles */}
            {hasMultipleImages && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? wine.photos.length - 1 : prev - 1))}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-white transition-colors"
                >
                  ← Anterior
                </button>
                <p className="text-white text-sm">
                  {selectedImageIndex + 1} / {wine.photos.length}
                </p>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev === wine.photos.length - 1 ? 0 : prev + 1))}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-white transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            )}

            {/* Cerrar */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full p-3 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
