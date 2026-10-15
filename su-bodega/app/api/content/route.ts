import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';
import { SITE_SETTINGS_TAG } from '@/lib/site-content';
import { FIELDS, validateValue, type FieldDef } from '@/lib/site-content-schema';

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  let values: Record<string, unknown> | undefined;
  try {
    ({ values } = await request.json());
  } catch {
    return new Response('Solicitud inválida', { status: 400 });
  }
  if (!values || typeof values !== 'object') {
    return new Response('Faltan los valores a guardar', { status: 400 });
  }

  const errors: string[] = [];
  const validated: Record<string, string> = {};

  for (const field of FIELDS as readonly FieldDef[]) {
    if (!(field.key in values)) continue;
    const raw = values[field.key];
    if (typeof raw !== 'string') {
      errors.push(`${field.label}: valor inválido`);
      continue;
    }
    const result = validateValue(field, raw);
    if (result.ok) validated[field.key] = result.value;
    else errors.push(`${field.label}: ${result.error}`);
  }

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  // Lo que coincide con el original no se guarda: así "restaurar" deja la base limpia.
  const defaults = new Map((FIELDS as readonly FieldDef[]).map((field) => [field.key, field.default]));
  const toDelete = Object.keys(validated).filter((key) => validated[key] === defaults.get(key));
  const toSave = Object.entries(validated).filter(([key]) => !toDelete.includes(key));

  try {
    await prisma.$transaction([
      prisma.siteSetting.deleteMany({ where: { key: { in: toDelete } } }),
      ...toSave.map(([key, value]) =>
        prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
      ),
    ]);
  } catch (error) {
    console.error('Error al guardar el contenido del sitio:', error);
    return NextResponse.json({ errors: ['No pudimos guardar los cambios. Intentá nuevamente.'] }, { status: 500 });
  }

  revalidateTag(SITE_SETTINGS_TAG);
  revalidatePath('/', 'layout');

  return NextResponse.json({ ok: true, values: validated });
}
