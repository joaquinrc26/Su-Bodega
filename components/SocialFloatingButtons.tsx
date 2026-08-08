'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

const WHATSAPP_URL =
  'https://wa.me/5492214366338?text=Hola%20Su%20Bodega%2C%20soy%20comprador%20y%20quiero%20asesoramiento%20sobre%20vinos%20y%20promociones.%20%C2%BFMe%20pueden%20ayudar%3F';
const INSTAGRAM_URL = 'https://www.instagram.com/subodega/';

export default function SocialFloatingButtons() {
  const pathname = usePathname();

  const hideButtons = useMemo(() => {
    if (!pathname) return false;
    return pathname.startsWith('/admin') || pathname.startsWith('/add-wine');
  }, [pathname]);

  if (hideButtons) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="animate-float-in flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform"
        title="Hablar por WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.07 0C5.54 0 .21 5.31.2 11.85a11.8 11.8 0 0 0 1.6 5.98L0 24l6.35-1.67a11.87 11.87 0 0 0 5.7 1.45h.01c6.53 0 11.86-5.31 11.87-11.85a11.8 11.8 0 0 0-3.41-8.45Zm-8.45 18.3h-.01a9.85 9.85 0 0 1-5.02-1.37l-.36-.21-3.77.99 1.01-3.67-.24-.38a9.86 9.86 0 0 1-1.5-5.25c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.98 2.9a9.8 9.8 0 0 1 2.9 6.99c0 5.45-4.44 9.88-9.9 9.88Zm5.42-7.41c-.3-.15-1.77-.87-2.05-.97-.27-.1-.46-.15-.66.15-.2.3-.76.97-.94 1.17-.17.2-.35.22-.65.08-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.52-1.8-1.7-2.1-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.66-1.58-.9-2.16-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.52.08-.8.37-.27.3-1.04 1.01-1.04 2.47 0 1.45 1.07 2.86 1.21 3.05.15.2 2.1 3.2 5.08 4.5.7.31 1.25.5 1.67.64.7.22 1.34.19 1.84.11.56-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.56-.35Z" />
        </svg>
      </a>

      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ver Instagram de Su Bodega"
        className="animate-float-in-delay flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-lg hover:scale-105 transition-transform"
        title="Seguir en Instagram"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
          <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 1.9A3.85 3.85 0 0 0 3.9 7.75v8.5A3.85 3.85 0 0 0 7.75 20.1h8.5a3.85 3.85 0 0 0 3.85-3.85v-8.5a3.85 3.85 0 0 0-3.85-3.85h-8.5Zm9.4 1.45a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z" />
        </svg>
      </a>
    </div>
  );
}
