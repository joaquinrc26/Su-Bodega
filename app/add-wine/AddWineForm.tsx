'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Grape = { id: string; name: string };
type ProductCategory = { id: string; slug: string; name: string; description?: string | null; isActive: boolean };
type FilePreview = { file: File; preview: string };
type WinePhoto = { id: string; url: string };
type WineRecord = {
  id: string;
  name: string;
  year: number;
  price: number;
  stock: number;
  isActive: boolean;
  region?: string | null;
  bodega?: string | null;
  maridaje?: string | null;
  description?: string | null;
  category?: ProductCategory | null;
  grapeType?: Grape | null;
  photos: WinePhoto[];
};

type StockStatus = {
  label: string;
  tone: string;
  icon: string;
};

const INITIAL_CATEGORY_SLUG = 'vino';
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export default function AddWineForm() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [wines, setWines] = useState<WineRecord[]>([]);
  const [grapes, setGrapes] = useState<Grape[]>([]);

  const [editingWineId, setEditingWineId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedGrapeId, setSelectedGrapeId] = useState<string | null>(null);
  const [newGrapeName, setNewGrapeName] = useState('');

  const [name, setName] = useState('');
  const [year, setYear] = useState<number | ''>(new Date().getFullYear());
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState<number | ''>(0);
  const [region, setRegion] = useState('');
  const [bodega, setBodega] = useState('');
  const [maridaje, setMaridaje] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [wineToDelete, setWineToDelete] = useState<WineRecord | null>(null);
  const [deletingWine, setDeletingWine] = useState(false);

  const defaultCategoryId = useMemo(() => {
    return categories.find((category) => category.slug === INITIAL_CATEGORY_SLUG)?.id ?? categories[0]?.id ?? '';
  }, [categories]);

  useEffect(() => {
    fetch('/api/categories')
      .then((response) => response.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    fetch('/api/grapes')
      .then((response) => response.json())
      .then((data) => setGrapes(Array.isArray(data) ? data : []))
      .catch(() => setGrapes([]));
  }, []);

  useEffect(() => {
    async function loadWines() {
      try {
        const response = await fetch('/api/wines?includeInactive=1');
        const data = await response.json();
        setWines(Array.isArray(data) ? data : []);
      } catch {
        setWines([]);
      }
    }

    loadWines();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId && defaultCategoryId) {
      setSelectedCategoryId(defaultCategoryId);
    }
  }, [defaultCategoryId, selectedCategoryId]);

  function resetForm() {
    setEditingWineId(null);
    setName('');
    setYear(new Date().getFullYear());
    setDescription('');
    setPrice('');
    setStock(0);
    setRegion('');
    setBodega('');
    setMaridaje('');
    setSelectedCategoryId(defaultCategoryId);
    setSelectedGrapeId(null);
    setNewGrapeName('');
    setIsActive(true);
    setFilePreviews([]);
    setMessage(null);
  }

  function getStockStatus(stock: number): StockStatus {
    if (stock <= 0) {
      return { label: 'Sin stock', tone: 'border-red-500/30 bg-red-500/10 text-red-200', icon: '🔴' };
    }

    if (stock <= 6) {
      return { label: 'Poco stock', tone: 'border-amber-500/30 bg-amber-500/10 text-amber-200', icon: '🟡' };
    }

    return { label: 'Disponible', tone: 'border-green-500/30 bg-green-500/10 text-green-200', icon: '🟢' };
  }

  function handleFileChange(files?: FileList | null) {
    if (!files || files.length === 0) {
      setFilePreviews([]);
      return;
    }

    const invalidFile = Array.from(files).find(
      (file) => !ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES
    );

    if (invalidFile) {
      setMessage(
        !ALLOWED_IMAGE_TYPES.has(invalidFile.type)
          ? 'Formato de imagen no soportado. Usá JPG, PNG, WEBP o GIF.'
          : 'La imagen supera el tamaño máximo permitido de 5 MB.'
      );
      setFilePreviews([]);
      return;
    }

    Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<FilePreview>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ file, preview: String(reader.result) });
            reader.readAsDataURL(file);
          })
      )
    ).then(setFilePreviews);
  }

  async function uploadFileServer(dataUrl: string) {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: dataUrl }),
    });

    if (!response.ok) throw new Error(await response.text());
    const json = await response.json();
    return json.url as string;
  }

  async function uploadFileClientDirect(file: File) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary no configurado para subida directa');
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(url, { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Error en la subida directa');
    const data = await response.json();
    return data.secure_url as string;
  }

  async function createGrape() {
    if (!newGrapeName.trim()) return;

    const response = await fetch('/api/grapes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newGrapeName.trim() }),
    });

    if (!response.ok) {
      setMessage(await response.text());
      return;
    }

    const grape = await response.json();
    setGrapes((current) => [...current, grape]);
    setSelectedGrapeId(grape.id);
    setNewGrapeName('');
  }

  function editWine(wine: WineRecord) {
    setEditingWineId(wine.id);
    setName(wine.name);
    setYear(wine.year);
    setDescription(wine.description || '');
    setPrice(String(wine.price ?? 0));
    setStock(wine.stock ?? 0);
    setRegion(wine.region || '');
    setBodega(wine.bodega || '');
    setMaridaje(wine.maridaje || '');
    setSelectedCategoryId(wine.category?.id || defaultCategoryId);
    setSelectedGrapeId(wine.grapeType?.id || null);
    setIsActive(wine.isActive);
    setFilePreviews([]);
    setMessage(null);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function reloadWines() {
    const response = await fetch('/api/wines?includeInactive=1');
    const data = await response.json();
    setWines(Array.isArray(data) ? data : []);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    if (!name.trim() || !year) {
      setMessage('Ingresá el nombre y el año para continuar.');
      return;
    }

    if (price === '' || Number(price) < 0) {
      setMessage('Ingresá un precio válido.');
      return;
    }

    if (stock === '' || Number(stock) < 0 || !Number.isInteger(Number(stock))) {
      setMessage('Ingresá un stock válido.');
      return;
    }

    if (!selectedCategoryId) {
      setMessage('Seleccioná una categoría para este vino.');
      return;
    }

    if (!editingWineId && filePreviews.length === 0) {
      setMessage('Agregá una foto para crear el vino.');
      return;
    }

    setUploading(true);

    try {
      const photos: string[] = [];

      for (const preview of filePreviews) {
        try {
          photos.push(await uploadFileServer(preview.preview));
        } catch {
          photos.push(await uploadFileClientDirect(preview.file));
        }
      }

      const payload: Record<string, unknown> = {
        name: name.trim(),
        year: Number(year),
        description,
        price: Number(price),
        stock: Number(stock),
        region: region || 'Sin especificar',
        bodega: bodega || undefined,
        maridaje: maridaje || 'Versatile',
        categoryId: selectedCategoryId,
        isActive,
      };

      if (selectedGrapeId) {
        payload.grapeTypeId = selectedGrapeId;
      } else if (newGrapeName.trim()) {
        payload.grapeTypeName = newGrapeName.trim();
      }

      if (photos.length > 0) {
        payload.photos = photos;
        payload.replacePhotos = true;
      }

      const response = await fetch(editingWineId ? `/api/wines/${editingWineId}` : '/api/wines', {
        method: editingWineId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setMessage('No pudimos guardar los cambios. Revisá los datos e intentá nuevamente.');
        return;
      }

      await reloadWines();
      setMessage(editingWineId ? 'Los cambios se guardaron correctamente.' : 'El vino se agregó correctamente.');
      resetForm();
    } catch {
      setMessage('No pudimos guardar los cambios. Revisá los datos e intentá nuevamente.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteWine() {
    if (!wineToDelete) return;

    setDeletingWine(true);
    try {
      const response = await fetch(`/api/wines/${wineToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) {
        setMessage('No pudimos eliminar el vino. Intentá nuevamente.');
        return;
      }

      await reloadWines();
      setMessage('El vino se eliminó correctamente.');
    } catch {
      setMessage('No pudimos eliminar el vino. Intentá nuevamente.');
    } finally {
      setDeletingWine(false);
      setShowDeleteConfirm(false);
      setWineToDelete(null);
    }
  }

  function removePreview(index: number) {
    setFilePreviews((current) => current.filter((_, i) => i !== index));
  }

  const activeProducts = wines.filter((wine) => wine.isActive);
  const inactiveProducts = wines.filter((wine) => !wine.isActive);

  return (
    <div className="min-h-screen buyer-bodegon-bg text-amber-50">
      <div className="container-premium py-10 md:py-14">
        <section className="wine-hero grain-overlay mb-8 p-7 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="wine-section-label">Panel administrativo</span>
              <h1 className="mt-4 text-5xl md:text-6xl font-playfair text-amber-50">Mis vinos</h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-amber-100/74">
                Acá podés ver tus vinos, agregar uno nuevo y cambiar precio, stock y estado sin complicaciones.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="rounded-full border border-gold/30 bg-gold/10 px-5 py-3 text-sm font-semibold text-amber-50 hover:border-gold hover:bg-gold/20 transition"
              >
                + AGREGAR VINO
              </button>
              <Link
                href="/wines"
                className="rounded-full border border-gold/20 px-5 py-3 text-sm text-amber-50 hover:border-gold hover:bg-gold/5 transition"
              >
                Ver catálogo público
              </Link>
            </div>
          </div>
        </section>

        {message && (
          <div className={`mb-8 rounded-2xl border p-4 ${message.includes('correctamente') ? 'border-green-500/30 bg-green-500/10 text-green-200' : 'border-amber-500/30 bg-amber-500/10 text-amber-200'}`}>
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="wine-card p-8 md:p-10">
              <span className="wine-section-label">Datos básicos</span>
              <h2 className="text-2xl font-playfair font-semibold mb-6 mt-4 text-amber-50">Información del vino</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100/80">Nombre *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Malbec Reserve"
                    className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100/80">Año *</label>
                  <input
                    type="number"
                    value={year as number | ''}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100/80">Precio ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100/80">Stock *</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={stock as number | ''}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100/80">Categoría *</label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 focus:border-gold focus:outline-none"
                  >
                    <option value="">Seleccionar</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100/80">Estado</label>
                  <button
                    type="button"
                    onClick={() => setIsActive((current) => !current)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                      isActive
                        ? 'border-green-500/40 bg-green-500/10 text-green-200'
                        : 'border-red-500/40 bg-red-500/10 text-red-200'
                    }`}
                  >
                    {isActive ? 'Disponible para comprar' : 'Desactivado'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100/80">Región</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="Ej: Mendoza, Salta"
                    className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100/80">Bodega</label>
                  <input
                    type="text"
                    value={bodega}
                    onChange={(e) => setBodega(e.target.value)}
                    placeholder="Ej: Achaval Ferrer"
                    className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100/80">Maridaje</label>
                  <input
                    type="text"
                    value={maridaje}
                    onChange={(e) => setMaridaje(e.target.value)}
                    placeholder="Ej: Carnes, Quesos"
                    className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="wine-card p-8 md:p-10">
              <span className="wine-section-label">Detalles</span>
              <h2 className="text-2xl font-playfair font-semibold mb-6 mt-4 text-amber-50">Descripción y uva</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100/80">Seleccionar uva existente</label>
                  <select
                    value={selectedGrapeId ?? ''}
                    onChange={(e) => setSelectedGrapeId(e.target.value || null)}
                    className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Seleccionar --</option>
                    {grapes.map((grape) => (
                      <option key={grape.id} value={grape.id}>
                        {grape.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-amber-100/80">O crear nueva uva</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nombre de la uva"
                      value={newGrapeName}
                      onChange={(e) => setNewGrapeName(e.target.value)}
                      className="flex-1 border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                    />
                    <button type="button" onClick={createGrape} className="btn-premium px-4">
                      Crear
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-3 text-amber-100/80">Descripción</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe los aromas, sabores, notas, etc."
                  rows={5}
                  className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                />
              </div>
            </section>

            <section className="wine-card p-8 md:p-10">
              <span className="wine-section-label">Foto</span>
              <h2 className="text-2xl font-playfair font-semibold mb-6 mt-4 text-amber-50">Fotografía</h2>

              {editingWineId && filePreviews.length === 0 && (
                <p className="mb-4 text-sm text-amber-100/70">
                  Si seleccionás una nueva imagen, reemplazará la foto actual del producto.
                </p>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-amber-100/80">
                  Selecciona una o varias fotos
                </label>
                <div className="border-2 border-dashed border-gold/30 rounded-lg p-8 text-center hover:border-gold hover:bg-gold/5 transition-all cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files)}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer block">
                    <div className="text-4xl mb-3">📸</div>
                    <p className="text-sm text-amber-100/80">
                      Arrastra fotos aquí o{' '}
                      <span className="text-gold font-semibold">haz clic para seleccionar</span>
                    </p>
                    <p className="text-xs text-amber-100/60 mt-2">JPG, PNG · seleccionar nuevamente reemplaza la imagen previa</p>
                  </label>
                </div>
              </div>

              {filePreviews.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-4 text-amber-100/80">Fotos seleccionadas ({filePreviews.length})</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filePreviews.map((preview, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border border-gold/15 bg-black/20">
                        <Image
                          src={preview.preview}
                          alt={`preview-${index}`}
                          width={150}
                          height={150}
                          className="w-full h-40 object-cover group-hover:brightness-75 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => removePreview(index)}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50"
                        >
                          <span className="text-white text-3xl">✕</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editingWineId && filePreviews.length === 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {wines.find((wine) => wine.id === editingWineId)?.photos.map((photo) => (
                    <div key={photo.id} className="rounded-lg overflow-hidden border border-gold/15 bg-black/20">
                      <Image src={photo.url} alt={name || 'producto'} width={200} height={200} className="w-full h-40 object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="wine-card p-8 md:p-10">
              <span className="wine-section-label">Guardar</span>
              <h2 className="text-2xl font-playfair font-semibold mb-6 mt-4 text-amber-50">Guardar cambios</h2>

              <div className="space-y-4">
                <button
                  disabled={uploading}
                  type="submit"
                  className="btn-premium w-full py-4 text-lg font-semibold disabled:opacity-50"
                >
                  {uploading ? '⏳ Guardando...' : editingWineId ? '✅ Actualizar producto' : '✅ Guardar producto'}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full px-6 py-3 border border-gold/20 rounded-full text-amber-50 hover:border-gold hover:bg-gold/5 transition-all"
                >
                  🔄 Limpiar formulario
                </button>
              </div>

              {message && (
                <div
                  className={`mt-6 p-5 rounded-lg ${
                    message.includes('✅') ? 'bg-green-900/30 border border-green-500/30 text-green-200' : 'bg-amber-900/30 border border-amber-500/30 text-amber-200'
                  }`}
                >
                  <p className="text-sm font-medium">{message}</p>
                </div>
              )}
            </section>
          </form>

          <aside className="space-y-6">
            <section className="wine-card p-8 md:p-10">
              <span className="wine-section-label">Inventario</span>
              <h2 className="text-2xl font-playfair font-semibold mb-6 mt-4 text-amber-50">Tus vinos</h2>

              <div className="space-y-4 max-h-[85vh] overflow-auto pr-1">
                {wines.map((wine) => {
                  const stockStatus = getStockStatus(wine.stock);

                  return (
                    <article key={wine.id} className="rounded-2xl border border-gold/12 bg-black/20 p-4">
                      <div className="flex items-start gap-3">
                        {wine.photos[0]?.url ? (
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gold/10">
                            <Image src={wine.photos[0].url} alt={wine.name} width={64} height={64} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-gold/10 text-xl">🍷</div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm uppercase tracking-[0.2em] text-gold/80">{wine.category?.name || 'Sin categoría'}</p>
                              <h3 className="mt-1 text-lg font-semibold text-amber-50">{wine.name}</h3>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${wine.isActive ? 'bg-green-500/15 text-green-200' : 'bg-red-500/15 text-red-200'}`}>
                              {wine.isActive ? 'Disponible' : 'No disponible'}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-amber-100/70">
                            <span>${Number(wine.price).toLocaleString('es-AR')}</span>
                            <span>·</span>
                            <span>Stock: {wine.stock}</span>
                          </div>

                          <div className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${stockStatus.tone}`}>
                            <span>{stockStatus.icon}</span>
                            <span>{stockStatus.label}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button type="button" onClick={() => editWine(wine)} className="rounded-full border border-gold/20 px-4 py-2 text-sm hover:border-gold hover:bg-gold/5 transition">
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setWineToDelete(wine);
                            setShowDeleteConfirm(true);
                          }}
                          className="rounded-full border border-red-400/20 px-4 py-2 text-sm text-red-200 hover:border-red-300 hover:bg-red-500/10 transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </article>
                  );
                })}

                {wines.length === 0 && <p className="text-amber-100/70">Todavía no hay vinos cargados.</p>}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {showDeleteConfirm && wineToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-gold/20 bg-[#140f0a] p-6 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.25em] text-gold/80">Eliminar vino</p>
            <h3 className="mt-3 text-2xl font-playfair text-amber-50">¿Querés eliminar este vino?</h3>
            <p className="mt-3 text-sm leading-7 text-amber-100/70">
              Esta acción quitará el producto del catálogo y no se podrá deshacer.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setWineToDelete(null);
                }}
                className="flex-1 rounded-full border border-gold/20 px-4 py-3 text-sm text-amber-50 hover:border-gold hover:bg-gold/5 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteWine}
                disabled={deletingWine}
                className="flex-1 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 hover:border-red-300 hover:bg-red-500/20 transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingWine ? 'Eliminando...' : 'Eliminar vino'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
