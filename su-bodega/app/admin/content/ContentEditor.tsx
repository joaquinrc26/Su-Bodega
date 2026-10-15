'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FIELDS, FONT_OPTIONS, GROUPS, type FieldDef, type SettingKey, type SiteContent } from '@/lib/site-content-schema';
import { resizeImageToDataUrl } from '@/lib/image-resize';

const fields: readonly FieldDef[] = FIELDS;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const inputClass =
  'w-full border border-gold/20 rounded-lg p-3 bg-black/30 text-amber-50 placeholder-amber-100/40 focus:border-gold focus:outline-none';

type Status = { type: 'success' | 'error'; messages: string[] } | null;

async function readError(response: Response): Promise<string> {
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    return data.error || data.errors?.join(' ') || text;
  } catch {
    return text || 'Error desconocido';
  }
}

type FieldInputProps = {
  field: FieldDef;
  value: string;
  uploading: boolean;
  onChange: (value: string) => void;
  onUpload: (file: File) => void;
};

function FieldInput({ field, value, uploading, onChange, onUpload }: FieldInputProps) {
  const id = `field-${field.key}`;
  const changed = value !== field.default;
  const fontVar = field.type === 'select' ? FONT_OPTIONS.find((option) => option.value === value)?.cssVar : undefined;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={id} className="block text-sm font-medium text-amber-100/80">
          {field.label}
        </label>
        {changed && (
          <button type="button" onClick={() => onChange(field.default)} className="shrink-0 text-xs text-gold/80 underline hover:text-gold">
            Restaurar original
          </button>
        )}
      </div>

      {(field.type === 'text' || field.type === 'phone' || field.type === 'url' || field.type === 'number') && (
        <input
          id={id}
          type="text"
          inputMode={field.type === 'number' || field.type === 'phone' ? 'numeric' : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
      )}

      {field.type === 'textarea' && (
        <textarea id={id} rows={3} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />
      )}

      {field.type === 'select' && (
        <>
          <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-2xl text-amber-100/90" style={{ fontFamily: fontVar ? `var(${fontVar})` : undefined }}>
            Su Bodega — Los mejores vinos
          </p>
        </>
      )}

      {field.type === 'toggle' && (
        <label className="flex cursor-pointer items-center gap-3 text-amber-100/90">
          <input id={id} type="checkbox" checked={value === 'true'} onChange={(event) => onChange(event.target.checked ? 'true' : 'false')} className="h-5 w-5 accent-gold" />
          {value === 'true' ? 'Activado' : 'Desactivado'}
        </label>
      )}

      {field.type === 'image' && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="h-24 w-40 shrink-0 rounded-lg border border-gold/20 bg-black/30 bg-cover bg-center" style={{ backgroundImage: `url("${value}")` }} />
          <div className="space-y-2">
            <label className="inline-block cursor-pointer rounded-full border border-gold/50 px-4 py-2 text-sm text-gold hover:bg-gold/10">
              {uploading ? 'Subiendo…' : 'Cambiar foto'}
              <input
                id={id}
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(',')}
                disabled={uploading}
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  if (file) onUpload(file);
                }}
              />
            </label>
            <p className="text-xs text-amber-100/60">Mejor una foto horizontal y de buena calidad. Se achica sola al subirla. Después hay que guardar los cambios.</p>
          </div>
        </div>
      )}

      {field.help && <p className="mt-2 text-xs text-amber-100/60">{field.help}</p>}
    </div>
  );
}

export default function ContentEditor({ initialValues }: { initialValues: SiteContent }) {
  const router = useRouter();
  const [values, setValues] = useState<SiteContent>(initialValues);
  const [saved, setSaved] = useState<SiteContent>(initialValues);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(null);

  const dirtyCount = fields.filter((field) => values[field.key as SettingKey] !== saved[field.key as SettingKey]).length;

  useEffect(() => {
    if (dirtyCount === 0) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirtyCount]);

  function setField(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function uploadImage(field: FieldDef, file: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setStatus({ type: 'error', messages: ['Usá imágenes JPG, PNG o WEBP.'] });
      return;
    }

    setUploadingKey(field.key);
    setStatus(null);
    try {
      const dataUrl = await resizeImageToDataUrl(file, 1920, 0.82);
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: dataUrl, kind: 'background' }),
      });
      if (!response.ok) throw new Error(await readError(response));
      const { url } = (await response.json()) as { url: string };
      setField(field.key, url);
    } catch (error) {
      setStatus({ type: 'error', messages: [`No pudimos subir la foto: ${error instanceof Error ? error.message : 'error desconocido'}`] });
    } finally {
      setUploadingKey(null);
    }
  }

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setStatus({ type: 'error', messages: data?.errors ?? ['No pudimos guardar los cambios.'] });
        return;
      }

      const data = (await response.json()) as { values: Partial<SiteContent> };
      const next = { ...values, ...data.values };
      setValues(next);
      setSaved(next);
      setStatus({ type: 'success', messages: ['Cambios guardados. Ya se ven en el sitio.'] });
      router.refresh();
    } catch {
      setStatus({ type: 'error', messages: ['No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.'] });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen buyer-bodegon-bg text-amber-50 normal-case">
      <div className="container-premium py-10 md:py-14">
        <section className="wine-hero grain-overlay mb-8 p-7 md:p-10">
          <span className="wine-section-label">Administración</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-playfair">Contenido del sitio</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-amber-100/74">
            Cambiá textos, nombres de las secciones, fotos de fondo, tipografías y mensajes. Lo que dejes sin tocar se muestra como siempre. Con “Restaurar original” volvés al texto de fábrica de cada campo.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/admin/dashboard" className="rounded-full border border-gold/20 px-5 py-3 text-sm text-amber-50 hover:border-gold hover:bg-gold/5 transition">
              ← Volver al panel
            </Link>
            <Link href="/" target="_blank" className="rounded-full border border-gold/20 px-5 py-3 text-sm text-amber-50 hover:border-gold hover:bg-gold/5 transition">
              Ver el sitio
            </Link>
          </div>
        </section>

        <div className="space-y-4">
          {GROUPS.map((group, index) => {
            const groupFields = fields.filter((field) => field.group === group);
            const subgroups = Array.from(new Set(groupFields.map((field) => field.subgroup ?? '')));

            return (
              <details key={group} open={index < 2} className="wine-card rounded-2xl p-6 md:p-8">
                <summary className="cursor-pointer text-2xl font-playfair text-gold">{group}</summary>
                <div className="mt-6 space-y-8">
                  {subgroups.map((subgroup) => (
                    <div key={subgroup} className="space-y-5">
                      {subgroup && <h3 className="border-b border-gold/15 pb-2 text-sm font-semibold tracking-widest text-gold/80">{subgroup}</h3>}
                      {groupFields
                        .filter((field) => (field.subgroup ?? '') === subgroup)
                        .map((field) => (
                          <FieldInput
                            key={field.key}
                            field={field}
                            value={values[field.key as SettingKey]}
                            uploading={uploadingKey === field.key}
                            onChange={(value) => setField(field.key, value)}
                            onUpload={(file) => uploadImage(field, file)}
                          />
                        ))}
                    </div>
                  ))}
                </div>
              </details>
            );
          })}
        </div>

        <div className="sticky bottom-4 z-30 mt-8 rounded-2xl border border-gold/30 bg-black/85 p-4 backdrop-blur">
          {status && (
            <ul className={`mb-3 space-y-1 text-sm ${status.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
              {status.messages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-amber-100/80">{dirtyCount > 0 ? `Tenés ${dirtyCount} campo(s) modificado(s) sin guardar.` : 'No hay cambios pendientes.'}</p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={dirtyCount === 0 || saving}
                onClick={() => {
                  setValues(saved);
                  setStatus(null);
                }}
                className="rounded-full border border-amber-100/30 px-5 py-3 text-sm text-amber-100 hover:border-gold disabled:opacity-40"
              >
                Descartar
              </button>
              <button type="button" disabled={dirtyCount === 0 || saving || uploadingKey !== null} onClick={save} className="btn-premium px-6 py-3 disabled:opacity-40">
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
