# 🍇 Su-Bodega - E-commerce Premium de Vinos

**Versión**: 1.1 - MVP  
**Fecha**: 23 de Junio, 2026  
**Stack**: Next.js 15 + React 19 + TypeScript + Tailwind CSS + Prisma + SQLite

---

## 📋 Descripción del Proyecto

**Su-Bodega** es una plataforma de e-commerce especializada en la venta de vinos premium. Incluye:

- 🛒 **Carrito de compras** con persistencia en localStorage
- 🔍 **Búsqueda y filtros avanzados** (por año, región, tipo de uva)
- 📄 **Galería expandible** de imágenes de productos
- 💳 **Integración MercadoPago** para pagos en línea
- 👨‍💼 **Panel de administración** para cargar vinos
- 🎨 **Diseño premium** con tema oscuro (coal/gold)

---

## 🚀 Requisitos Previos

- **Node.js 18+** ([descargar](https://nodejs.org/))
- **npm 9+** o **pnpm** / **yarn**
- **Git** ([descargar](https://git-scm.com/))

### Verificar instalación:
```bash
node --version  # v18.0.0 o superior
npm --version   # 9.0.0 o superior
git --version   # git version 2.x.x
```

---

## 📦 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/YOUR_USERNAME/Su-Bodega.git
cd Su-Bodega/su-bodega
```

### 2. Instalar dependencias
```bash
npm install
```

Esto instalará todas las dependencias incluidas:
- `next` - Framework React
- `react` + `react-dom` - Librería UI
- `typescript` - Type checking
- `tailwindcss` - Estilos CSS
- `prisma` - ORM para base de datos
- `@prisma/client` - Cliente Prisma
- `mercadopago` - SDK de pagos (opcional, usando REST API)

### 3. Configurar variables de entorno
Crea un archivo `.env` en la carpeta `su-bodega/`:

```env
# Base de datos
DATABASE_URL="file:./dev.db"

# Admin
ADMIN_PASSWORD=admin123

# Cloudinary (para subir imágenes)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# MercadoPago (sandbox)
MERCADOPAGO_ACCESS_TOKEN=TEST-123456789
MERCADOPAGO_WEBHOOK_TOKEN=webhook-secret-123
```

**Nota**: Reemplaza `your_cloud_name` y `your_upload_preset` con tus credenciales de Cloudinary. Para desarrollo, puedes usar valores de prueba.

### 4. Inicializar la base de datos
```bash
# Aplicar migraciones
npx prisma migrate dev --name init

# Ejecutar seed (crea admin@bodega.com / admin123)
npx prisma db seed
```

---

## 🏃 Levantar el Servidor

### Modo Desarrollo
```bash
npm run dev
```

**Salida esperada**:
```
▲ Next.js 15.5.19
  - Local:    http://localhost:3001
  - Network:  http://192.168.x.x:3001
  ✓ Ready in 3.8s
```

**Acceso**:
- **Home**: http://localhost:3001
- **Catálogo**: http://localhost:3001/wines
- **Admin**: http://localhost:3001/admin

### Modo Producción
```bash
npm run build
npm start
```

---

## 👨‍💼 Acceso al Panel de Administración

### 1. Ir a la página de admin
```
http://localhost:3001/admin
```

### 2. Ingresar credenciales
- **Email**: `admin@bodega.com`
- **Contraseña**: `admin123`

### 3. Crear un vino
- Completa el formulario con datos del vino
- Sube fotos desde Cloudinary
- Haz clic en "Crear vino"

---

## 🛍️ Flujo de Compra

### Cliente
1. **Navega al catálogo**: `/wines`
2. **Busca y filtra** vinos por año, región, tipo de uva
3. **Agrega al carrito** y ve la galería del producto
4. **Va al carrito**: `/cart`
5. **Procede al pago**: `/checkout`
6. **Selecciona método de pago**:
   - 💸 Transferencia bancaria
   - 🚚 Efectivo contra entrega
   - 💳 MercadoPago

### MercadoPago (Testing)
Si selecciona **MercadoPago**:
1. Se redirige a sandbox de MercadoPago
2. Usa tarjeta de prueba: `4111 1111 1111 1111`
3. CVC: `123`, Fecha: `12/25`
4. Completa el pago
5. Se redirige a `/payment-success`
6. Webhook actualiza estado de la orden

---

## 📁 Estructura del Proyecto

```
Su-Bodega/
├── su-bodega/                    # Aplicación Next.js
│   ├── app/                      # App Router (Next.js 15)
│   │   ├── layout.tsx            # Layout raíz
│   │   ├── page.tsx              # Home
│   │   ├── admin/page.tsx        # Login de admin
│   │   ├── add-wine/             # Crear vino (protegido)
│   │   ├── wines/                # Catálogo
│   │   ├── cart/                 # Carrito
│   │   ├── checkout/             # Checkout
│   │   ├── payment-*/            # Páginas de pago
│   │   └── api/                  # Routes del servidor
│   ├── lib/                      # Utilidades
│   │   ├── prisma.ts             # Cliente Prisma
│   │   ├── auth.ts               # Autenticación
│   │   └── cart-context.tsx      # Context del carrito
│   ├── prisma/
│   │   ├── schema.prisma         # Modelos BD
│   │   ├── seed.ts               # Script de seed
│   │   └── dev.db                # BD SQLite (local)
│   ├── public/                   # Archivos estáticos
│   ├── .env                      # Variables de entorno
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.ts
├── IMPLEMENTACIONES.md           # Documentación técnica
├── TODO.md                       # Tareas pendientes
└── README.md                     # Este archivo
```

---

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev                 # Inicia servidor en http://localhost:3001

# Build
npm run build              # Compila para producción
npm start                  # Ejecuta build producción

# Base de datos
npx prisma migrate dev     # Crear migraciones
npx prisma db seed         # Ejecutar seed
npx prisma studio         # UI visual para BD

# Utilidades
npm run lint               # ESLint
npm run type-check         # Verificar tipos TypeScript
```

---

## 🔐 Autenticación

### Cookies
- `su-bodega-admin`: Token de sesión (7 días)
- Se valida en cada request protegido

### Rutas Protegidas
- `GET /add-wine` - Solo admin
- `POST /api/wines` - Solo admin
- `POST /api/grapes` - Solo admin
- `POST /api/upload` - Solo admin

### Admin Test
- Email: `admin@bodega.com`
- Password: `admin123`

---

## 💳 MercadoPago Integration

### Sandbox Mode (Desarrollo)
- **Tokens**: TEST-* en `.env`
- **No hay transacciones reales**
- Usa tarjetas de prueba

### Flujo
1. Cliente selecciona MercadoPago en checkout
2. Se crea preferencia en MercadoPago API
3. Se guarda `mpPreferenceId` en BD
4. Frontend redirige a `mercadopago.com.ar/checkout/...`
5. Webhook notifica resultado en `/api/webhooks/mercadopago`
6. Se actualiza estado de orden

### Tarjetas de Prueba
```
Aprobada:  4111 1111 1111 1111
Rechazada: 4000 0000 0000 0002
CVC: 123, Fecha: 12/25
```

---

## 📊 Base de Datos

### Modelos Principales

**Wine** - Productos
```
- id, name, year, price, region, bodega, maridaje, description
- grapeType (relación), photos (relación)
```

**Order** - Órdenes de compra
```
- id, customerEmail, customerName, customerPhone
- shippingAddress, shippingCity, shippingPostalCode
- total, paymentMethod, status
- mpPreferenceId, mpPaymentId (MercadoPago)
- items (relación OrderItem)
```

**OrderItem** - Ítems en orden
```
- id, orderId, wineId, wineName, wineYear, price, quantity
```

**AdminUser** - Administradores
```
- id, email, name, password, createdAt
```

**GrapeType** - Tipos de uva
```
- id, name
```

**Photo** - Imágenes
```
- id, url, wineId
```

---

## 🎨 Tema y Estilos

### Colores Principales
- **Coal** (#0F0F1E): Fondo oscuro premium
- **Gold** (#D4AF37): Acentos y botones
- **Slate**: Grises para texto y bordes

### Fuentes
- **Playfair Display**: Headings (h1-h3)
- **Montserrat**: Body text y UI

### Responsive
- Mobile: 1 columna
- Tablet: 2 columnas
- Desktop: 4 columnas

---

## 🐛 Troubleshooting

### "Port 3000 is in use"
El puerto 3000 está ocupado. Next.js usará 3001 o 3002 automáticamente.

```bash
# O matar el proceso que usa 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### Error de Prisma: "Couldn't find schema.prisma"
```bash
cd su-bodega
npx prisma generate
```

### Error de Cloudinary en upload
Verifica que `.env` tenga `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` y `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

### MercadoPago: "Invalid access token"
Verifica que `MERCADOPAGO_ACCESS_TOKEN` en `.env` sea un token TEST válido.

---

## 📝 Variables de Entorno Detalladas

| Variable | Descripción | Obligatorio | Ejemplo |
|----------|-------------|------------|---------|
| `DATABASE_URL` | URL de BD SQLite | ✅ | `file:./dev.db` |
| `ADMIN_PASSWORD` | Contraseña admin | ✅ | `admin123` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud Name Cloudinary | ⚠️ | `my-cloud` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload Preset | ⚠️ | `unsigned_preset` |
| `MERCADOPAGO_ACCESS_TOKEN` | Token API MercadoPago | ⚠️ | `TEST-123456...` |
| `MERCADOPAGO_WEBHOOK_TOKEN` | Token para validar webhooks | ⚠️ | `secret-123` |

**✅ = Requerido** | **⚠️ = Necesario para features específicas**

---

## 🚀 Deployment

### Vercel (Recomendado)
1. Push a GitHub
2. Conecta repo en Vercel
3. Configura variables de entorno
4. Deploy automático

```bash
# Desde terminal
npm install -g vercel
vercel
```

### Self-hosted
1. Compila: `npm run build`
2. Instala PM2: `npm install -g pm2`
3. Inicia: `pm2 start "npm start" --name "su-bodega"`

---

## 📚 Documentación Adicional

- **Técnica completa**: Ver `IMPLEMENTACIONES.md`
- **Tareas pendientes**: Ver `TODO.md`
- **Next.js docs**: https://nextjs.org/docs
- **Prisma docs**: https://www.prisma.io/docs
- **Tailwind docs**: https://tailwindcss.com/docs

---

## 👥 Equipo

**Desarrollado por**: GitHub Copilot + Usuario  
**Fecha de inicio**: Junio 2026  
**Estado**: MVP completado (Fase 5)

---

## 📞 Soporte

Para reportar bugs o sugerencias:
1. Abre un Issue en GitHub
2. Describe el problema con detalle
3. Incluye pasos para reproducir

---

## 📄 Licencia

Este proyecto es de uso privado. Todos los derechos reservados.

---

**¡Gracias por usar Su-Bodega! 🍷**
