import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { mergeContent, type SiteContent } from '@/lib/site-content-schema';

export const SITE_SETTINGS_TAG = 'site-settings';

const readOverrides = unstable_cache(
  async () => {
    const rows = await prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  },
  ['site-settings'],
  { tags: [SITE_SETTINGS_TAG], revalidate: 300 }
);

// Si la base falla o la tabla aún no existe, el sitio sigue funcionando con los textos originales.
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  try {
    return mergeContent(await readOverrides());
  } catch (error) {
    console.error('No se pudo leer el contenido editable; se usan los valores originales:', error);
    return mergeContent({});
  }
});
