export type FieldType = 'text' | 'textarea' | 'image' | 'select' | 'toggle' | 'number' | 'phone' | 'url';

export type FieldDef = {
  key: string;
  label: string;
  group: string;
  subgroup?: string;
  type: FieldType;
  default: string;
  help?: string;
  options?: readonly { value: string; label: string }[];
  max?: number;
};

export const FONT_OPTIONS = [
  { value: 'bodoni', label: 'Bodoni Moda (actual)', cssVar: '--font-bodoni-moda' },
  { value: 'playfair', label: 'Playfair Display', cssVar: '--font-site-playfair' },
  { value: 'cormorant', label: 'Cormorant Garamond', cssVar: '--font-site-cormorant' },
  { value: 'cinzel', label: 'Cinzel', cssVar: '--font-site-cinzel' },
  { value: 'montserrat', label: 'Montserrat', cssVar: '--font-site-montserrat' },
  { value: 'lato', label: 'Lato', cssVar: '--font-site-lato' },
] as const;

const FONT_CHOICES = FONT_OPTIONS.map(({ value, label }) => ({ value, label }));

export const GROUPS = [
  'Datos generales',
  'Portada del inicio',
  'Las 3 secciones',
  'Cómo comprar (inicio)',
  'Sucursales y horarios (inicio)',
  'Catálogo',
  'Ficha de producto',
  'Carrito y pedido por WhatsApp',
  'Contacto',
  'Diseño',
] as const;

export const FIELDS = [
  { key: 'site.title', label: 'Título del sitio (pestaña del navegador y Google)', group: 'Datos generales', type: 'text', default: 'SU BODEGA' },
  { key: 'site.description', label: 'Descripción del sitio (Google y redes)', group: 'Datos generales', type: 'textarea', default: 'La mejor selección para tu ocasión especial', max: 300 },
  { key: 'brand.name', label: 'Nombre en el encabezado', group: 'Datos generales', type: 'text', default: 'Su Bodega' },
  { key: 'brand.tagline', label: 'Frase bajo el nombre del encabezado', group: 'Datos generales', type: 'text', default: 'Vinoteca de selección' },

  { key: 'home.cover', label: 'Foto de fondo de la portada', group: 'Portada del inicio', type: 'image', default: '/hero-cover.jpg' },
  { key: 'home.kicker', label: 'Etiqueta pequeña superior', group: 'Portada del inicio', type: 'text', default: 'Vinoteca de selección' },
  { key: 'home.title', label: 'Título principal', group: 'Portada del inicio', type: 'text', default: 'Su Bodega' },
  { key: 'home.subtitle', label: 'Subtítulo', group: 'Portada del inicio', type: 'text', default: 'Los mejores Vinos del pais' },
  {
    key: 'home.description',
    label: 'Texto descriptivo',
    group: 'Portada del inicio',
    type: 'textarea',
    default: 'Una experiencia de compra con carácter de cava clásica: etiquetas curadas, navegación simple y un recorrido pensado para descubrir vinos, vinos únicos y regalería.',
  },
  { key: 'home.primaryButton', label: 'Botón principal', group: 'Portada del inicio', type: 'text', default: 'Descubrir colección' },
  { key: 'home.secondaryButton', label: 'Botón secundario', group: 'Portada del inicio', type: 'text', default: 'Ver carrito' },

  { key: 'sec.vinos.name', label: 'Nombre de la sección (menú, pestaña y título)', group: 'Las 3 secciones', subgroup: 'Sección 1', type: 'text', default: 'Vinos' },
  { key: 'sec.vinos.tab', label: 'Frase de la pestaña del catálogo', group: 'Las 3 secciones', subgroup: 'Sección 1', type: 'text', default: 'Tintos, blancos y rosados' },
  { key: 'sec.vinos.subtitle', label: 'Subtítulo dentro del catálogo', group: 'Las 3 secciones', subgroup: 'Sección 1', type: 'text', default: 'Catalogo principal de vinos, cargado manualmente por administracion.' },
  { key: 'sec.vinos.cardLabel', label: 'Etiqueta de la tarjeta del inicio', group: 'Las 3 secciones', subgroup: 'Sección 1', type: 'text', default: 'Varietales' },
  { key: 'sec.vinos.cardTitle', label: 'Título de la tarjeta del inicio', group: 'Las 3 secciones', subgroup: 'Sección 1', type: 'text', default: 'Tipos por variedad' },
  {
    key: 'sec.vinos.cardText',
    label: 'Texto de la tarjeta del inicio',
    group: 'Las 3 secciones',
    subgroup: 'Sección 1',
    type: 'textarea',
    default: 'Malbec, Cabernet, Chardonnay y más, con filtros claros para descubrir la cava según gusto y ocasión.',
  },
  { key: 'sec.vinos.cardButton', label: 'Botón de la tarjeta del inicio', group: 'Las 3 secciones', subgroup: 'Sección 1', type: 'text', default: 'Ver vinos →' },
  { key: 'sec.vinos.image', label: 'Foto de fondo de la tarjeta', group: 'Las 3 secciones', subgroup: 'Sección 1', type: 'image', default: '/varietales.jpg' },

  { key: 'sec.guardados.name', label: 'Nombre de la sección (menú, pestaña y título)', group: 'Las 3 secciones', subgroup: 'Sección 2', type: 'text', default: 'Vinos únicos' },
  { key: 'sec.guardados.tab', label: 'Frase de la pestaña del catálogo', group: 'Las 3 secciones', subgroup: 'Sección 2', type: 'text', default: 'Tiempo y carácter' },
  { key: 'sec.guardados.subtitle', label: 'Subtítulo dentro del catálogo', group: 'Las 3 secciones', subgroup: 'Sección 2', type: 'text', default: 'Seleccion curada y cargada manualmente por administracion.' },
  { key: 'sec.guardados.cardLabel', label: 'Etiqueta de la tarjeta del inicio', group: 'Las 3 secciones', subgroup: 'Sección 2', type: 'text', default: 'Selección' },
  { key: 'sec.guardados.cardTitle', label: 'Título de la tarjeta del inicio', group: 'Las 3 secciones', subgroup: 'Sección 2', type: 'text', default: 'Vinos únicos' },
  {
    key: 'sec.guardados.cardText',
    label: 'Texto de la tarjeta del inicio',
    group: 'Las 3 secciones',
    subgroup: 'Sección 2',
    type: 'textarea',
    default: 'Una sección especial para botellas con impronta de guarda, pensada para compradores que valoran evolución y carácter.',
  },
  { key: 'sec.guardados.cardButton', label: 'Botón de la tarjeta del inicio', group: 'Las 3 secciones', subgroup: 'Sección 2', type: 'text', default: 'Explorar selección →' },
  { key: 'sec.guardados.image', label: 'Foto de fondo de la tarjeta', group: 'Las 3 secciones', subgroup: 'Sección 2', type: 'image', default: '/vinos-unicos.jpg' },

  { key: 'sec.regaleria.name', label: 'Nombre de la sección (menú, pestaña y título)', group: 'Las 3 secciones', subgroup: 'Sección 3', type: 'text', default: 'Regalería' },
  { key: 'sec.regaleria.tab', label: 'Frase de la pestaña del catálogo', group: 'Las 3 secciones', subgroup: 'Sección 3', type: 'text', default: 'Para celebrar' },
  { key: 'sec.regaleria.subtitle', label: 'Subtítulo dentro del catálogo', group: 'Las 3 secciones', subgroup: 'Sección 3', type: 'text', default: 'Regalos y accesorios seleccionados por la bodega.' },
  { key: 'sec.regaleria.cardLabel', label: 'Etiqueta de la tarjeta del inicio', group: 'Las 3 secciones', subgroup: 'Sección 3', type: 'text', default: 'Presentación' },
  { key: 'sec.regaleria.cardTitle', label: 'Título de la tarjeta del inicio', group: 'Las 3 secciones', subgroup: 'Sección 3', type: 'text', default: 'Regalería' },
  {
    key: 'sec.regaleria.cardText',
    label: 'Texto de la tarjeta del inicio',
    group: 'Las 3 secciones',
    subgroup: 'Sección 3',
    type: 'textarea',
    default: 'Opciones para regalar y acompañar una buena botella, cargadas directamente por la administración.',
  },
  { key: 'sec.regaleria.cardButton', label: 'Botón de la tarjeta del inicio', group: 'Las 3 secciones', subgroup: 'Sección 3', type: 'text', default: 'Descubrir regalería →' },
  { key: 'sec.regaleria.image', label: 'Foto de fondo de la tarjeta', group: 'Las 3 secciones', subgroup: 'Sección 3', type: 'image', default: '/regaleria.jpg' },

  { key: 'how.label', label: 'Etiqueta de la sección', group: 'Cómo comprar (inicio)', type: 'text', default: 'Cómo comprar' },
  { key: 'how.1.title', label: 'Paso 1: título', group: 'Cómo comprar (inicio)', type: 'text', default: 'Explora' },
  { key: 'how.1.text', label: 'Paso 1: texto', group: 'Cómo comprar (inicio)', type: 'textarea', default: 'Filtra por año, región y uva para llegar rápido a la botella correcta.' },
  { key: 'how.2.title', label: 'Paso 2: título', group: 'Cómo comprar (inicio)', type: 'text', default: 'Envía tu pedido' },
  { key: 'how.2.text', label: 'Paso 2: texto', group: 'Cómo comprar (inicio)', type: 'textarea', default: 'Revisa el carrito y envíalo directamente a Su Bodega por WhatsApp.' },
  { key: 'how.3.title', label: 'Paso 3: título', group: 'Cómo comprar (inicio)', type: 'text', default: 'Coordina' },
  {
    key: 'how.3.text',
    label: 'Paso 3: texto',
    group: 'Cómo comprar (inicio)',
    type: 'textarea',
    default: 'El dueño confirma disponibilidad, entrega y los detalles del pedido directamente por WhatsApp.',
  },

  { key: 'stores.label', label: 'Etiqueta de la sección', group: 'Sucursales y horarios (inicio)', type: 'text', default: 'Atención' },
  { key: 'stores.title', label: 'Título', group: 'Sucursales y horarios (inicio)', type: 'text', default: 'Sucursales' },
  {
    key: 'stores.text',
    label: 'Texto introductorio',
    group: 'Sucursales y horarios (inicio)',
    type: 'textarea',
    default: 'Atención personalizada, selección de etiquetas y asesoramiento en cualquiera de nuestras dos ubicaciones.',
  },
  { key: 'stores.1.name', label: 'Nombre y dirección', group: 'Sucursales y horarios (inicio)', subgroup: 'Sucursal 1', type: 'text', default: 'Su Bodega · Calle 9 Nº605' },
  {
    key: 'stores.1.hours',
    label: 'Horarios (una línea por renglón)',
    group: 'Sucursales y horarios (inicio)',
    subgroup: 'Sucursal 1',
    type: 'textarea',
    default: 'Lunes a Viernes: 9 a 13 hs y 16 a 20 hs\nSábados: 10 a 13 hs y 17 a 20 hs',
  },
  {
    key: 'stores.2.name',
    label: 'Nombre y dirección (vacío = ocultar sucursal)',
    group: 'Sucursales y horarios (inicio)',
    subgroup: 'Sucursal 2',
    type: 'text',
    default: 'Su Bodega · Calle 35 Nº693',
  },
  {
    key: 'stores.2.hours',
    label: 'Horarios (una línea por renglón)',
    group: 'Sucursales y horarios (inicio)',
    subgroup: 'Sucursal 2',
    type: 'textarea',
    default: 'Lunes a Viernes: 9 a 13 hs y 16 a 20 hs\nSábados: 10 a 13 hs',
  },

  { key: 'catalog.kicker', label: 'Palabra del recorrido (Su Bodega / …)', group: 'Catálogo', type: 'text', default: 'Colección' },
  { key: 'catalog.title', label: 'Título de la página', group: 'Catálogo', type: 'text', default: 'La colección' },
  {
    key: 'catalog.description',
    label: 'Texto bajo el título',
    group: 'Catálogo',
    type: 'textarea',
    default: 'Etiquetas elegidas para descubrir, regalar y disfrutar. Encontrá tu próxima botella en una selección cuidada por Su Bodega.',
  },
  { key: 'catalog.empty', label: 'Mensaje cuando una sección no tiene productos', group: 'Catálogo', type: 'text', default: 'Esta vista solo muestra productos cargados previamente por administracion.' },

  {
    key: 'product.note1',
    label: 'Mensaje 1 bajo el botón de compra',
    group: 'Ficha de producto',
    type: 'text',
    default: '',
    help: 'Vacío = no se muestra. Podés empezar con un emoji, por ejemplo: 🚚 Envíos a todo el país.',
  },
  { key: 'product.note2', label: 'Mensaje 2 bajo el botón de compra', group: 'Ficha de producto', type: 'text', default: '', help: 'Vacío = no se muestra.' },

  { key: 'cart.kicker', label: 'Etiqueta superior', group: 'Carrito y pedido por WhatsApp', type: 'text', default: 'Tu carrito' },
  { key: 'cart.title', label: 'Título', group: 'Carrito y pedido por WhatsApp', type: 'text', default: 'Revisar compra' },
  { key: 'cart.subtitle', label: 'Texto bajo el título', group: 'Carrito y pedido por WhatsApp', type: 'text', default: 'Enviá tu pedido por WhatsApp y coordiná directamente con Su Bodega.' },
  { key: 'cart.whatsappButton', label: 'Texto del botón de WhatsApp', group: 'Carrito y pedido por WhatsApp', type: 'text', default: 'Enviar pedido por WhatsApp' },
  {
    key: 'cart.note',
    label: 'Aviso bajo el botón',
    group: 'Carrito y pedido por WhatsApp',
    type: 'text',
    default: 'El dueño confirmará disponibilidad, entrega y los detalles del pedido por WhatsApp.',
  },
  { key: 'cart.perk1', label: 'Ventaja 1 (lista al pie)', group: 'Carrito y pedido por WhatsApp', type: 'text', default: 'Coordinación directa del pedido por WhatsApp', help: 'Vacío = no se muestra.' },
  { key: 'cart.perk2', label: 'Ventaja 2 (lista al pie)', group: 'Carrito y pedido por WhatsApp', type: 'text', default: '', help: 'Vacío = no se muestra.' },
  { key: 'cart.messageIntro', label: 'Mensaje de WhatsApp: primera línea', group: 'Carrito y pedido por WhatsApp', type: 'text', default: 'Hola Su Bodega, quiero coordinar este pedido:' },
  { key: 'cart.messageOutro', label: 'Mensaje de WhatsApp: última línea', group: 'Carrito y pedido por WhatsApp', type: 'text', default: 'Quedo atento/a para coordinar el pedido por WhatsApp.' },
  { key: 'shipping.label', label: 'Nombre del costo de envío', group: 'Carrito y pedido por WhatsApp', type: 'text', default: 'Envío a CABA/AMBA' },
  {
    key: 'shipping.cost',
    label: 'Costo de envío ($)',
    group: 'Carrito y pedido por WhatsApp',
    type: 'number',
    default: '5000',
    help: 'Poné 0 para no cobrar ni mostrar el envío en el carrito.',
  },
  {
    key: 'shipping.freeFrom',
    label: 'Envío gratis desde ($)',
    group: 'Carrito y pedido por WhatsApp',
    type: 'number',
    default: '200000',
    help: 'Poné 0 para desactivar el envío gratis y el aviso “falta X para envío gratis”.',
  },

  {
    key: 'contact.whatsapp',
    label: 'Número de WhatsApp del negocio',
    group: 'Contacto',
    type: 'phone',
    default: '5492214366342',
    help: 'Solo números, con código de país. Argentina: 549 + código de área + número, sin 0 ni 15.',
  },
  {
    key: 'contact.whatsappMessage',
    label: 'Mensaje del botón flotante de WhatsApp',
    group: 'Contacto',
    type: 'textarea',
    default: 'Hola Su Bodega, soy comprador y quiero asesoramiento sobre vinos y promociones. ¿Me pueden ayudar?',
  },
  { key: 'contact.instagram', label: 'Enlace de Instagram', group: 'Contacto', type: 'url', default: 'https://www.instagram.com/subodega/', help: 'Vacío = se oculta el botón de Instagram.' },

  { key: 'design.titleFont', label: 'Tipografía de los títulos', group: 'Diseño', type: 'select', default: 'bodoni', options: FONT_CHOICES },
  { key: 'design.bodyFont', label: 'Tipografía de los textos', group: 'Diseño', type: 'select', default: 'bodoni', options: FONT_CHOICES },
  {
    key: 'design.uppercase',
    label: 'Mostrar todo el sitio en MAYÚSCULAS',
    group: 'Diseño',
    type: 'toggle',
    default: 'true',
    help: 'Desactivado, los textos se ven con mayúsculas y minúsculas normales.',
  },
] as const satisfies readonly FieldDef[];

export type SettingKey = (typeof FIELDS)[number]['key'];
export type SiteContent = Record<SettingKey, string>;

export const DEFAULTS = Object.fromEntries(FIELDS.map((field) => [field.key, field.default])) as SiteContent;

export type ValidationResult = { ok: true; value: string } | { ok: false; error: string };

// Solo rutas propias o imágenes alojadas en Cloudinary; evita inyectar CSS arbitrario.
const SAFE_IMAGE = /^(\/[A-Za-z0-9._\-/]{1,200}|https:\/\/res\.cloudinary\.com\/[A-Za-z0-9._\-/%~]{1,400})$/;
const SAFE_URL = /^https:\/\/[^\s"'()<>\\]{3,300}$/;

export function validateValue(field: FieldDef, raw: string): ValidationResult {
  const text = raw.replace(/\r\n/g, '\n');

  switch (field.type) {
    case 'text': {
      const value = text.replace(/\n/g, ' ').trim();
      const max = field.max ?? 200;
      return value.length > max ? { ok: false, error: `máximo ${max} caracteres` } : { ok: true, value };
    }
    case 'textarea': {
      const value = text.trim();
      const max = field.max ?? 1200;
      return value.length > max ? { ok: false, error: `máximo ${max} caracteres` } : { ok: true, value };
    }
    case 'image': {
      const value = text.trim();
      if (!value) return { ok: true, value: field.default };
      return SAFE_IMAGE.test(value) ? { ok: true, value } : { ok: false, error: 'imagen no válida' };
    }
    case 'select': {
      const value = text.trim();
      return field.options?.some((option) => option.value === value) ? { ok: true, value } : { ok: false, error: 'opción no válida' };
    }
    case 'toggle': {
      const value = text.trim();
      return value === 'true' || value === 'false' ? { ok: true, value } : { ok: false, error: 'valor no válido' };
    }
    case 'number': {
      const value = text.trim();
      return /^\d{1,9}$/.test(value) ? { ok: true, value: String(Number(value)) } : { ok: false, error: 'ingresá un número entero, sin puntos ni signos' };
    }
    case 'phone': {
      const value = text.replace(/[\s+\-()]/g, '');
      return /^\d{8,15}$/.test(value) ? { ok: true, value } : { ok: false, error: 'ingresá solo números, entre 8 y 15 dígitos' };
    }
    case 'url': {
      const value = text.trim();
      if (!value) return { ok: true, value: '' };
      return SAFE_URL.test(value) ? { ok: true, value } : { ok: false, error: 'debe empezar con https://' };
    }
  }
}

// Si un valor guardado no es válido, se usa el original en lugar de romper el sitio.
export function mergeContent(overrides: Record<string, string>): SiteContent {
  const content = { ...DEFAULTS };
  for (const field of FIELDS as readonly FieldDef[]) {
    const stored = overrides[field.key];
    if (stored === undefined) continue;
    const result = validateValue(field, stored);
    if (result.ok) (content as Record<string, string>)[field.key] = result.value;
  }
  return content;
}

export function fontCssVar(value: string): string {
  const option = FONT_OPTIONS.find((font) => font.value === value) ?? FONT_OPTIONS[0];
  return `var(${option.cssVar})`;
}

export function cssImageUrl(value: string): string {
  return `url("${value}")`;
}
