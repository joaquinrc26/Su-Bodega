'use client';

import { createContext, useContext } from 'react';
import { DEFAULTS, type SiteContent } from '@/lib/site-content-schema';

const SiteContentContext = createContext<SiteContent>(DEFAULTS);

export function SiteContentProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
