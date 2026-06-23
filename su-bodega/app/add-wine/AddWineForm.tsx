'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Grape = { id: string; name: string };
type FilePreview = { file: File; preview: string };

export default function AddWineForm() {
  const [grapes, setGrapes] = useState<Grape[]>([]);
  const [selectedGrapeId, setSelectedGrapeId] = useState<string | null>(null);
  const [newGrapeName, setNewGrapeName] = useState('');

  // Campos básicos
  const [name, setName] = useState('');
  const [year, setYear] = useState<number | ''>(new Date().getFullYear());
  const [description, setDescription] = useState('');

  // Campos nuevos
  const [price, setPrice] = useState('');
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

  function handleFileChange(files?: FileList | null) {
    if (!files) {
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

      type WinePayload = {
        name: string;
        year: number;
        description: string;
        price: string;
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

      const response = await fetch('/api/wines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setMessage(await response.text());
        return;
      }

      setMessage('✅ Vino creado correctamente');
      // Limpiar formulario
      setName('');
      setYear(new Date().getFullYear());
      setDescription('');
      setPrice('');
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

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container-premium py-12">
        {/* Header */}
        <div className="mb-12">
          <span className="text-sm uppercase tracking-[0.4em] text-gold">Panel Administrativo</span>
          <h1 className="text-4xl md:text-5xl font-playfair font-semibold mt-4 mb-2">Agregar Vino</h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Completa todos los campos del vino que deseas agregar al catálogo. Las fotos y la descripción son opcionales pero
            recomendadas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sección 1: Información Básica */}
          <section className="card-premium p-8 glass">
            <h2 className="text-2xl font-semibold mb-6 text-gold">📋 Información Básica</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre del Vino *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Malbec Reserve"
                  className="w-full border border-slate-600 rounded p-3 bg-slate-800/50 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Año *</label>
                <input
                  type="number"
                  value={year as number | ''}
                  onChange={(e) => setYear(Number(e.target.value))}
                  placeholder="2020"
                  className="w-full border border-slate-600 rounded p-3 bg-slate-800/50 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Precio ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="5000"
                  className="w-full border border-slate-600 rounded p-3 bg-slate-800/50 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Región</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Ej: Mendoza, Salta"
                  className="w-full border border-slate-600 rounded p-3 bg-slate-800/50 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bodega</label>
                <input
                  type="text"
                  value={bodega}
                  onChange={(e) => setBodega(e.target.value)}
                  placeholder="Ej: Achaval Ferrer"
                  className="w-full border border-slate-600 rounded p-3 bg-slate-800/50 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Maridaje</label>
                <input
                  type="text"
                  value={maridaje}
                  onChange={(e) => setMaridaje(e.target.value)}
                  placeholder="Ej: Carnes, Quesos"
                  className="w-full border border-slate-600 rounded p-3 bg-slate-800/50 focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </section>

          {/* Sección 2: Tipo de Uva */}
          <section className="card-premium p-8 glass">
            <h2 className="text-2xl font-semibold mb-6 text-gold">🍇 Tipo de Uva</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Seleccionar uva existente</label>
                <select
                  value={selectedGrapeId ?? ''}
                  onChange={(e) => setSelectedGrapeId(e.target.value || null)}
                  className="w-full border border-slate-600 rounded p-3 bg-slate-800/50 focus:outline-none focus:border-gold"
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
                <label className="block text-sm font-medium mb-2">O crear nueva uva</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nombre de la uva"
                    value={newGrapeName}
                    onChange={(e) => setNewGrapeName(e.target.value)}
                    className="flex-1 border border-slate-600 rounded p-3 bg-slate-800/50 focus:outline-none focus:border-gold"
                  />
                  <button type="button" onClick={createGrape} className="btn-premium px-4">
                    Crear
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Sección 3: Descripción */}
          <section className="card-premium p-8 glass">
            <h2 className="text-2xl font-semibold mb-6 text-gold">📝 Descripción</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe los aromas, sabores, notas, etc."
              rows={5}
              className="w-full border border-slate-600 rounded p-3 bg-slate-800/50 focus:outline-none focus:border-gold"
            />
          </section>

          {/* Sección 4: Fotos */}
          <section className="card-premium p-8 glass">
            <h2 className="text-2xl font-semibold mb-6 text-gold">📸 Fotos</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                Selecciona una o varias fotos (recomendado: mínimo 1)
              </label>
              <div className="border-2 border-dashed border-slate-600 rounded p-6 text-center hover:border-gold transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files)}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  <div className="text-3xl mb-2">📁</div>
                  <p className="text-sm text-slate-300">
                    Arrastra fotos aquí o{' '}
                    <span className="text-gold font-semibold">haz clic para seleccionar</span>
                  </p>
                </label>
              </div>
            </div>

            {/* Previsualizaciones */}
            {filePreviews.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-4">Fotos seleccionadas ({filePreviews.length})</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border border-slate-600 bg-slate-800"
                    >
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
          </section>

          {/* Sección 5: Acciones */}
          <section className="flex gap-3 flex-col md:flex-row">
            <button
              disabled={uploading}
              type="submit"
              className="btn-premium flex-1 md:flex-none py-4 text-lg font-semibold disabled:opacity-50"
            >
              {uploading ? '⏳ Guardando...' : '✅ Guardar Vino'}
            </button>

            <button
              type="button"
              onClick={() => {
                setName('');
                setYear(new Date().getFullYear());
                setDescription('');
                setPrice('');
                setRegion('');
                setBodega('');
                setMaridaje('');
                setSelectedGrapeId(null);
                setNewGrapeName('');
                setFilePreviews([]);
                setMessage(null);
              }}
              className="px-6 py-4 border border-slate-600 rounded text-slate-100 hover:border-gold transition-colors"
            >
              🔄 Limpiar formulario
            </button>
          </section>

          {/* Mensajes */}
          {message && (
            <div className={`card-premium p-4 rounded ${message.includes('✅') ? 'bg-green-900/30 text-green-200' : 'bg-amber-900/30 text-amber-200'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
