'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Grape = { id: string; name: string };
type ProductCategory = { id: string; slug: string; name: string; isActive: boolean };
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

const MAX_PHOTOS = 3;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export default function AddWineForm() {
  const [grapes, setGrapes] = useState<Grape[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [wines, setWines] = useState<WineRecord[]>([]);
  const [editingWineId, setEditingWineId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedGrapeId, setSelectedGrapeId] = useState<string | null>(null);
  const [newGrapeName, setNewGrapeName] = useState('');

  // Campos básicos
  const [name, setName] = useState('');
  const [year, setYear] = useState<number | ''>(new Date().getFullYear());
  const [description, setDescription] = useState('');

  // Campos nuevos
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState<number | ''>(0);
  const [isActive, setIsActive] = useState(true);
  const [region, setRegion] = useState('');
  const [bodega, setBodega] = useState('');
  const [maridaje, setMaridaje] = useState('');

  // Fotos
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/grapes')
      .then((response) => response.json())
      .then(setGrapes)
      .catch(() => setGrapes([]));
  }, []);

  useEffect(() => {
    loadWines();
  }, []);

  async function loadWines() {
    try {
      const response = await fetch('/api/wines?includeInactive=1');
      const data = await response.json();
      if (!response.ok) throw new Error();
      setWines(Array.isArray(data) ? data : []);
    } catch {
      setWines([]);
    }
  }

  useEffect(() => {
    fetch('/api/categories')
      .then((response) => response.json())
      .then((data: ProductCategory[]) => {
        setCategories(data);
        setSelectedCategoryId(data.find((category) => category.slug === 'vino')?.id || data[0]?.id || '');
      })
      .catch(() => setCategories([]));
  }, []);

  function handleFileChange(files?: FileList | null) {
    if (!files) {
      setFilePreviews([]);
      return;
    }

    const selectedFiles = Array.from(files);
    if (selectedFiles.length > MAX_PHOTOS) {
      setMessage(`Podés cargar hasta ${MAX_PHOTOS} fotos por producto.`);
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) => !ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES
    );
    if (invalidFile) {
      setMessage(
        !ALLOWED_IMAGE_TYPES.has(invalidFile.type)
          ? 'Usá imágenes JPG, PNG o WEBP.'
          : 'Cada imagen puede pesar hasta 5 MB.'
      );
      return;
    }

    setMessage(null);

    Promise.all(
      selectedFiles.map(
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    if (!name || !year) {
      setMessage('Ingrese nombre y año');
      return;
    }

    if (!price) {
      setMessage('Ingrese el precio');
      return;
    }

    if (!selectedCategoryId) {
      setMessage('Seleccione una sección');
      return;
    }

    if (stock === '' || Number(stock) < 0 || !Number.isInteger(Number(stock))) {
      setMessage('Ingrese un stock válido');
      return;
    }

    setUploading(true);
    try {
      const photos: string[] = [];

      for (const preview of filePreviews) {
        photos.push(await uploadFileServer(preview.preview));
      }

      type WinePayload = {
        name: string;
        year: number;
        description: string;
        price: string;
        stock: number;
        categoryId: string;
        isActive: boolean;
        region?: string;
        bodega?: string;
        maridaje?: string;
        photos: string[];
        grapeTypeId?: string;
        grapeTypeName?: string;
      };

      const payload: WinePayload = {
        name,
        year: Number(year),
        description,
        price,
        stock: Number(stock),
        categoryId: selectedCategoryId,
        isActive,
        region: region || 'Sin especificar',
        bodega: bodega || '',
        maridaje: maridaje || 'Versatile',
        photos,
      };

      if (selectedGrapeId) {
        payload.grapeTypeId = selectedGrapeId;
      } else if (newGrapeName.trim()) {
        payload.grapeTypeName = newGrapeName.trim();
      }

      const response = await fetch(editingWineId ? `/api/wines/${editingWineId}` : '/api/wines', {
        method: editingWineId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          replacePhotos: Boolean(editingWineId && photos.length),
        }),
      });

      if (!response.ok) {
        setMessage(await response.text());
        return;
      }

      setMessage(editingWineId ? '✅ Los cambios se guardaron correctamente.' : '✅ Producto creado correctamente.');
      await loadWines();
      // Limpiar formulario
      setEditingWineId(null);
      setName('');
      setYear(new Date().getFullYear());
      setDescription('');
      setPrice('');
      setStock(0);
      setIsActive(true);
      setSelectedCategoryId(categories.find((category) => category.slug === 'vino')?.id || categories[0]?.id || '');
      setRegion('');
      setBodega('');
      setMaridaje('');
      setSelectedGrapeId(null);
      setNewGrapeName('');
      setFilePreviews([]);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error durante la creación';
      setMessage(errorMsg);
    } finally {
      setUploading(false);
    }
  }

  function removePreview(index: number) {
    setFilePreviews((current) => current.filter((_, i) => i !== index));
  }

  function editWine(wine: WineRecord) {
    setEditingWineId(wine.id);
    setName(wine.name);
    setYear(wine.year);
    setDescription(wine.description || '');
    setPrice(String(wine.price));
    setStock(wine.stock);
    setIsActive(wine.isActive);
    setSelectedCategoryId(wine.category?.id || '');
    setSelectedGrapeId(wine.grapeType?.id || null);
    setRegion(wine.region || '');
    setBodega(wine.bodega || '');
    setMaridaje(wine.maridaje || '');
    setFilePreviews([]);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingWineId(null);
    setName('');
    setYear(new Date().getFullYear());
    setDescription('');
    setPrice('');
    setStock(0);
    setIsActive(true);
    setSelectedCategoryId(categories.find((category) => category.slug === 'vino')?.id || categories[0]?.id || '');
    setSelectedGrapeId(null);
    setNewGrapeName('');
    setRegion('');
    setBodega('');
    setMaridaje('');
    setFilePreviews([]);
    setMessage(null);
  }

  async function deleteWine(wine: WineRecord) {
    if (!window.confirm(`¿Querés eliminar "${wine.name}"?`)) return;

    const response = await fetch(`/api/wines/${wine.id}`, { method: 'DELETE' });
    if (!response.ok) {
      setMessage('No pudimos eliminar el producto. Intentá nuevamente.');
      return;
    }

    if (editingWineId === wine.id) resetForm();
    await loadWines();
    setMessage('El producto se eliminó correctamente.');
  }

  return (
    <div className="min-h-screen buyer-bodegon-bg text-amber-50">
      <div className="container-premium py-10 md:py-14">
        <section className="wine-hero grain-overlay mb-12 p-7 md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="wine-section-label">Carga de productos</span>
              <h1 className="mt-4 text-5xl md:text-6xl font-playfair text-amber-50">Agregar producto</h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-amber-100/74">
                Completa el formulario con todos los detalles del vino. Fotos, región, maridaje y descripción harán que tu catálogo sea rico y accesible.
              </p>
              <p className="mt-4 text-sm text-amber-100/62">
                Elegí una de las tres secciones para que el producto aparezca en el lugar correcto del catálogo.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
              <div className="wine-stat">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gold/72">Campos</p>
                <p className="mt-2 text-lg font-playfair">3 secciones</p>
              </div>
              <div className="wine-stat">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gold/72">Fotos</p>
                <p className="mt-2 text-lg font-playfair">Una o varias</p>
              </div>
              <div className="wine-stat">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gold/72">Guardado</p>
                <p className="mt-2 text-lg font-playfair">Inmediato</p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/admin/dashboard"
            className="rounded-full border border-gold/20 px-5 py-3 text-sm text-amber-50 hover:border-gold hover:bg-gold/5 transition"
          >
            ← Volver al panel
          </Link>
          <Link
            href="/wines"
            className="rounded-full border border-gold/20 px-5 py-3 text-sm text-amber-50 hover:border-gold hover:bg-gold/5 transition"
          >
            Ver catálogo buyer
          </Link>
        </div>

        <section className="wine-card p-7 md:p-9 mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="wine-section-label">Administración</span>
              <h2 className="mt-3 text-3xl font-playfair text-amber-50">Mis productos</h2>
              <p className="mt-2 text-amber-100/65">Desde acá podés revisar, editar, activar o eliminar lo que aparece en la tienda.</p>
            </div>
            <button type="button" onClick={resetForm} className="btn-premium px-5 py-3">
              + Agregar producto
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {wines.length === 0 && <p className="rounded-lg border border-amber-100/10 p-5 text-amber-100/65">Todavía no hay productos cargados.</p>}
            {wines.map((wine) => (
              <article key={wine.id} className="flex flex-col gap-4 rounded-xl border border-amber-100/10 bg-black/20 p-4 md:flex-row md:items-center">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gold/20 bg-black/30">
                  {wine.photos[0]?.url ? (
                    <Image src={wine.photos[0].url} alt={wine.name} width={80} height={80} className="h-full w-full object-cover" />
                  ) : <div className="flex h-full items-center justify-center text-xs text-amber-100/40">Sin foto</div>}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-semibold text-amber-50">{wine.name}</h3>
                  <p className="mt-1 text-sm text-amber-100/60">{wine.category?.name || 'Sin sección'} · ${Number(wine.price).toLocaleString('es-AR')}</p>
                  <p className="mt-1 text-sm text-amber-100/75">
                    Stock: {wine.stock} unidades · {wine.isActive ? 'Disponible' : 'No disponible'}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => editWine(wine)} className="rounded-full border border-gold/50 px-4 py-2 text-sm text-gold hover:bg-gold/10">Editar</button>
                  <button type="button" onClick={() => deleteWine(wine)} className="rounded-full border border-red-300/30 px-4 py-2 text-sm text-red-200 hover:bg-red-900/20">Eliminar</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sección 1: Información Básica */}
          <section className="wine-card p-8 md:p-10">
            <span className="wine-section-label">Paso 1 de 5</span>
            <h2 className="text-2xl font-playfair font-semibold mb-6 mt-4 text-amber-50">Información Básica</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-100/80">Nombre del producto *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Malbec Reserve"
                  className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-amber-100/80">Sección *</label>
                <select
                  value={selectedCategoryId}
                  onChange={(event) => setSelectedCategoryId(event.target.value)}
                  className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 focus:border-gold focus:outline-none"
                >
                  <option value="">Seleccionar sección</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-amber-100/80">Stock *</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(event) => setStock(event.target.value === '' ? '' : Number(event.target.value))}
                  className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 focus:border-gold focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-amber-100/80">
                <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
                Disponible para comprar
              </label>

              <div>
                <label className="block text-sm font-medium mb-2 text-amber-100/80">Año *</label>
                <input
                  type="number"
                  value={year as number | ''}
                  onChange={(e) => setYear(Number(e.target.value))}
                  placeholder="2020"
                  className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-amber-100/80">Precio ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="5000"
                  className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
                />
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

          {/* Sección 2: Tipo de Uva */}
          <section className="wine-card p-8 md:p-10">
            <span className="wine-section-label">Paso 2 de 5</span>
            <h2 className="text-2xl font-playfair font-semibold mb-6 mt-4 text-amber-50">Tipo de Uva</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-100/80">Seleccionar uva existente</label>
                <select
                  aria-label="Seleccionar tipo de uva existente"
                  title="Seleccionar tipo de uva existente"
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
          </section>

          {/* Sección 3: Descripción */}
          <section className="wine-card p-8 md:p-10">
            <span className="wine-section-label">Paso 3 de 5</span>
            <h2 className="text-2xl font-playfair font-semibold mb-6 mt-4 text-amber-50">Descripción</h2>
            <label className="block text-sm font-medium mb-3 text-amber-100/80">Detalles y notas de cata</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe los aromas, sabores, notas, etc."
              rows={5}
              className="w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none"
            />
          </section>

          {/* Sección 4: Fotos */}
          <section className="wine-card p-8 md:p-10">
            <span className="wine-section-label">Paso 4 de 5</span>
            <h2 className="text-2xl font-playfair font-semibold mb-6 mt-4 text-amber-50">Fotos</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-amber-100/80">
                Fotos del producto (opcional)
              </label>
              <div className="border-2 border-dashed border-gold/30 rounded-lg p-8 text-center hover:border-gold hover:bg-gold/5 transition-all cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
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
                  <p className="text-xs text-amber-100/60 mt-2">Hasta 3 fotos · JPG, PNG o WEBP · Máximo 5 MB cada una · Podés agregarlas después</p>
                  <p className="text-xs text-gold/85 mt-1">Se guardan en formato cuadrado para el catálogo.</p>
                </label>
              </div>
            </div>

            {/* Previsualizaciones */}
            {filePreviews.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-4 text-amber-100/80">Fotos seleccionadas ({filePreviews.length})</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square group overflow-hidden rounded-lg border border-gold/15 bg-black/20"
                    >
                      <Image
                        src={preview.preview}
                        alt={`preview-${index}`}
                        width={150}
                        height={150}
                        className="h-full w-full object-cover transition-all group-hover:brightness-75"
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
          </section>

          {/* Sección 5: Acciones */}
          <section className="wine-card p-8 md:p-10">
            <span className="wine-section-label">Paso 5 de 5</span>
            <h2 className="text-2xl font-playfair font-semibold mb-6 mt-4 text-amber-50">Guardar Producto</h2>

            <div className="space-y-4">
              <button
                disabled={uploading}
                type="submit"
                className="btn-premium w-full py-4 text-lg font-semibold disabled:opacity-50"
              >
                {uploading ? '⏳ Guardando...' : editingWineId ? '✅ Guardar cambios' : '✅ Guardar producto'}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="w-full px-6 py-3 border border-gold/20 rounded-full text-amber-50 hover:border-gold hover:bg-gold/5 transition-all"
              >
                🔄 Limpiar formulario
              </button>
            </div>

            {/* Mensajes */}
            {message && (
              <div className={`mt-6 p-5 rounded-lg ${message.includes('✅') ? 'bg-green-900/30 border border-green-500/30 text-green-200' : 'bg-amber-900/30 border border-amber-500/30 text-amber-200'}`}>
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
          </section>
        </form>
      </div>
    </div>
  );
}
