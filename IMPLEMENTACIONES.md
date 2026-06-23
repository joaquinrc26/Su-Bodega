# 📦 SU BODEGA - Documento Completo de Implementaciones

## Proyecto: E-commerce Premium de Vinos 🍇

**Fecha**: 23 de Junio, 2026  
**Versión**: 1.2 - MVP (Fases 1, 2, 3, 4, 5 y cuenta buyer completadas)  
**Stack Tecnológico**: 
- **Frontend**: Next.js 15 (App Router + Turbopack)
- **UI**: React 19, TypeScript 5, Tailwind CSS 4
- **Backend/BD**: Prisma 5 ORM, SQLite
- **Autenticación**: Cookie-based (admin + buyer)
- **Almacenamiento**: Cloudinary

**Objetivo Principal**: Plataforma de venta de vinos con carga exclusiva del administrador

---

## 📋 Índice

1. [Arquitectura General](#arquitectura-general)
2. [Base de Datos](#base-de-datos)
3. [Sistema de Autenticación](#sistema-de-autenticación)
4. [Fase 1: Carrito de Compras](#fase-1-carrito-de-compras)
5. [Fase 2: Página de Detalle del Producto](#fase-2-página-de-detalle-del-producto)
6. [Fase 3: Página de Checkout](#fase-3-página-de-checkout)
7. [Fase 4: Búsqueda y Filtros Avanzados](#fase-4-búsqueda-y-filtros-avanzados)
8. [Fase 5: MercadoPago Payment Gateway](#fase-5-mercadopago-payment-gateway)
9. [Fase 6: Cuenta Buyer e Historial de Compras](#fase-6-cuenta-buyer-e-historial-de-compras)
10. [API Routes](#api-routes)
11. [Componentes Principales](#componentes-principales)
12. [Estructura de Carpetas](#estructura-de-carpetas)

---

## 🏗️ Arquitectura General

### Tecnologías Implementadas

- **Frontend**: Next.js 15 App Router (Turbopack) con React 19
- **Estilo**: Tailwind CSS 4 con tema oscuro premium (coal/gold)
- **Base de Datos**: SQLite con Prisma ORM
- **Autenticación**: Cookie-based (admin-only)
- **Almacenamiento de Imágenes**: Cloudinary (con fallback server-side)
- **Estado Global**: Context API (Cart)

### Características de Seguridad

✅ Admin-only wine uploads (cookie-based authentication)  
✅ Buyer-only checkout e historial de compras  
✅ Password validation (`ADMIN_PASSWORD` env variable)  
✅ Protected API routes (`isAdminRequest()` / `getBuyerIdFromCookie()`)  
✅ TypeScript strict mode (no implicit `any`)  
✅ ESLint enforcement (Next.js best practices)

---

## 🗄️ Base de Datos

### Modelo Prisma (Actualizado)

```prisma
model Wine {
  id         String     @id @default(cuid())
  name       String
  year       Int
  price      Decimal    @default(0)              // NUEVO
  region     String?    @default("Sin especificar") // NUEVO
  bodega     String?                             // NUEVO
  maridaje   String?    @default("Versatile")    // NUEVO
  description String?
  grapeType  GrapeType? @relation(fields: [grapeTypeId], references: [id])
  grapeTypeId String?
  photos     Photo[]
  createdAt  DateTime   @default(now())
}

model GrapeType {
  id    String @id @default(cuid())
  name  String @unique
  wines Wine[]
}

model Photo {
  id     String @id @default(cuid())
  url    String
  wine   Wine   @relation(fields: [wineId], references: [id])
  wineId String
}
```

### Campos Nuevos
- **price**: Precio en ARS
- **region**: Región de producción (Mendoza, Salta, etc.)
- **bodega**: Nombre de la bodega/productor
- **maridaje**: Sugerencias de maridaje con comidas

---

## 🔐 Sistema de Autenticación

### Archivo: `lib/auth.ts`

```typescript
// Funciones principales:
- isAdminRequest(request): Valida cookie su-bodega-admin
- isAdminToken(password): Compara contra ADMIN_PASSWORD
- createAdminCookie(): Genera Set-Cookie header
- clearAdminCookie(): Expira la cookie
```

### Flujo de Autenticación

1. Usuario visita `/admin` → Formulario de login
2. POST `/api/auth/login` con `{password}` JSON
3. Validación contra `process.env.ADMIN_PASSWORD`
4. Si correcto: Set-Cookie `su-bodega-admin` → Redirige a `/add-wine`
5. Rutas protegidas validan cookie y redirigen si no autenticado

---

## 🛒 Fase 1: Carrito de Compras

### 1.1 Context API del Carrito

**Archivo**: `lib/cart-context.tsx`

```typescript
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  year: number;
}

// Funciones:
- addToCart(item): Agrega o incrementa cantidad
- removeFromCart(id): Elimina item
- updateQuantity(id, qty): Actualiza cantidad
- clearCart(): Vacía el carrito
- total: Precio total
- itemCount: Cantidad de items
```

**Persistencia**: localStorage (`su-bodega-cart`)  
**Scope**: Root layout (toda la app)

### 1.2 Página de Carrito

**Archivo**: `app/cart/page.tsx`

**Características**:
- ✅ Listado de items con imagen, precio y cantidad
- ✅ Selector de cantidad (+/-)
- ✅ Botón para eliminar items
- ✅ Cálculo de envío (gratis desde $200.000)
- ✅ Código de promoción (base)
- ✅ Resumen de compra sticky
- ✅ Botón "Proceder al pago"
- ✅ Información de promociones

### 1.3 Integración en Catálogo

**Archivo**: `app/wines/page.tsx` (Actualizado)

- ✅ Botón "🛒 Carrito" con contador en header
- ✅ Botón "Agregar al carrito" en cada tarjeta
- ✅ Botones de favoritos (❤️/🤍)
- ✅ Muestra precio y región del vino
- ✅ Items clickeables que llevan a detalle

---

## 📄 Fase 2: Página de Detalle del Producto

### 2.1 Ruta Dinámica

**Archivo**: `app/wines/[id]/page.tsx`

**Características**:
- ✅ Galería de imágenes expandible
  - Imagen principal con zoom
  - Thumbnails laterales
  - Modal fullscreen con navegación
- ✅ Información completa del vino
  - Nombre, bodega, región, año
  - Precio destacado
  - Maridaje sugerido
- ✅ Selector de cantidad y agregar al carrito
- ✅ Descripción expandida
- ✅ Vinos relacionados (mismo región)
- ✅ Breadcrumb de navegación
- ✅ Info de envío y promociones

### 2.2 Galería de Imágenes

**Funcionalidades**:
```
- Imagen principal (h-96 desktop, h-72 mobile)
- Thumbnails con scroll horizontal
- Click en miniatura = cambio de imagen principal
- Hover en imagen = ícono "expandir"
- Modal con navegación Anterior/Siguiente
- Teclado: Esc para cerrar
```

### 2.3 Productos Relacionados

```typescript
// Lógica:
1. Obtiene región del vino actual
2. Busca /api/wines?region=XYZ
3. Filtra el vino actual (id !== current)
4. Limita a 4 items
5. Muestra en grid clickeable
```

---

## 🛍️ Fase 3: Página de Checkout

### 3.1 Ruta Dinámica

**Archivo**: `app/checkout/page.tsx`

**Características**:
- ✅ Formulario de 4 secciones
  - **Información Personal**: Nombre, Email, Teléfono, País
  - **Dirección de Envío**: Calle, Número, Apto, CP, Ciudad, Provincia
  - **Método de Pago**: Transferencia, Efectivo contra entrega, Tarjeta (próximamente)
  - **Notas Adicionales**: Instrucciones especiales para entrega
- ✅ Validaciones en tiempo real (required fields)
- ✅ Resumen lateral sticky
  - Listado de items con miniaturas
  - Cálculo automático de envío
  - Información de envío gratis (desde $200.000)
  - Total final destacado

### 3.2 Flujo de Compra

```
/cart (Proceder al pago) → /checkout (Formulario) → Orden Completada
```

**Validaciones**:
- Campos requeridos en formulario
- Email con formato válido
- Teléfono internacional
- Métodos de pago seleccionables
- Prevents submit sin completar campos

### 3.3 Estados de la Página

1. **Carrito Vacío**: Redirige a /wines
2. **Formulario**: Captura información del cliente
3. **Procesando**: Estado durante submit (botón deshabilitado)
4. **Orden Completada**: Confirmación con opción de volver al catálogo

### 3.4 Integración con Carrito

- Lee items del `useCart()` context
- Muestra total y cálculo de envío
- Mantiene resumen actualizado
- Permite editar cantidad antes de ir a checkout (en página /cart)

---

## 🔎 Fase 4: Búsqueda y Filtros Avanzados

### 4.1 Actualización de la Página de Catálogo

**Archivo**: `app/wines/page.tsx` (Completamente reescrita)

**Nuevas Características**:
- ✅ **Búsqueda por nombre**: Busca en nombre, bodega y descripción del vino
- ✅ **Filtros múltiples**:
  - Filtro por **Año** (lista dinámica de años)
  - Filtro por **Región** (lista dinámica de regiones)
  - Filtro por **Tipo de Uva** (cargado desde BD)
- ✅ **Ordenamiento dinámico**:
  - Relevancia (por defecto)
  - Precio: Menor a Mayor
  - Precio: Mayor a Menor
  - Año: Más Antiguos
  - Año: Más Recientes
- ✅ **Botón "Limpiar filtros"** (aparece solo si hay filtros activos)
- ✅ **Contador de resultados** (mostrando vinos filtrados vs. total)

### 4.2 Flujo de Búsqueda

```
1. Carga TODOS los vinos al iniciar (/api/wines sin parámetros)
2. Usuario ingresa búsqueda o selecciona filtros
3. Estado se actualiza → useMemo recalcula vinos filtrados
4. Ordenamiento se aplica después del filtrado
5. UI muestra resultados en tiempo real (sin recargar página)
```

### 4.3 Lógica de Filtrado (en useMemo)

```typescript
1. Búsqueda por nombre: toLowerCase() + includes()
2. Filtro por año: year.toString() === filterYear
3. Filtro por región: wine.region === filterRegion
4. Filtro por uva: wine.grapeType.id === filterGrape
5. Combinación: todos los filtros activos se aplican (AND)
6. Ordenamiento: aplica al array final según sortBy
```

### 4.4 Optimizaciones de Performance

- Carga de datos una sola vez (no requetea por cada filtro)
- `useMemo` previene recálculos innecesarios
- Listas dinámicas de años/regiones se generan solo cuando hay vinos
- Grid responsivo (1 col mobile, 2 col tablet, 4 col desktop)

---

## 💳 Fase 5: MercadoPago Payment Gateway

### 5.1 Integración MercadoPago REST API

**Tecnología**: REST API + Webhooks (sin SDK)  
**Modo**: Sandbox (pruebas) con TEST token

**Archivo**: `app/api/orders/create/route.ts`

```typescript
POST /api/orders/create
Request Body:
{
  customer: {
    email: string,
    name: string,
    phone: string
  },
  shippingAddress: {
    street: string,
    number: string,
    apartment?: string,
    postalCode: string,
    city: string,
    province: string,
    country: string
  },
  items: CartItem[],
  paymentMethod: 'mercadopago' | 'transferencia' | 'efectivo',
  shippingCost: number,
  total: number
}

Response (MercadoPago):
{
  preferenceId: string,
  checkoutUrl: string,
  orderId: string
}

Response (Otros métodos):
{
  orderId: string,
  status: 'pending'
}
```

**Flujo MercadoPago**:
1. Genera preferencia en https://api.mercadopago.com/checkout/preferences
2. Almacena `preferenceId` en BD (Order.mpPreferenceId)
3. Retorna URL de pago (init_point)
4. Frontend redirige a MercadoPago
5. Usuario completa pago en sandbox MercadoPago
6. MercadoPago redirige a /payment-success con parámetros
7. Webhook actualiza estado de orden

### 5.2 Modelos de Base de Datos

**Archivo**: `prisma/schema.prisma`

```prisma
model Order {
  id                String      @id @default(cuid())
  customerEmail     String
  customerName      String
  customerPhone     String
  shippingAddress   String      // JSON o campos separados
  shippingCity      String
  shippingPostalCode String
  shippingCost      Decimal     @default(0)
  total             Decimal
  paymentMethod     String      // 'transferencia', 'efectivo', 'mercadopago'
  status            String      @default("pending")  // pending, approved, rejected, cancelled
  mpPreferenceId    String?     // MercadoPago preference ID
  mpPaymentId       String?     // MercadoPago payment ID
  items             OrderItem[]
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  wineId    String
  wineName  String
  wineYear  Int
  price     Decimal
  quantity  Int
}

model AdminUser {
  id        String  @id @default(cuid())
  email     String  @unique
  name      String
  password  String  // Hasheado en futuro
  createdAt DateTime @default(now())
}
```

### 5.3 Webhook de MercadoPago

**Archivo**: `app/api/webhooks/mercadopago/route.ts`

```typescript
POST /api/webhooks/mercadopago

Recibe:
{
  action: string,
  api_version: string,
  data: {
    id: string  // payment ID
  },
  type: string,
  user_id: number,
  live_mode: boolean,
  sent_at: string,
  id: string,
  retry_number: number
}

Proceso:
1. Extrae payment ID del webhook
2. Consulta payment en MercadoPago REST API
3. Obtiene payment.status (approved, rejected, pending, etc.)
4. Busca orden con mpPreferenceId matching
5. Actualiza Order.status y mpPaymentId
6. Valida webhook token (MERCADOPAGO_WEBHOOK_TOKEN)
```

**Estados de Pago**:
- `approved` → Order.status = 'approved'
- `rejected` → Order.status = 'rejected'
- `pending` → Order.status = 'pending'
- `cancelled` → Order.status = 'cancelled'

### 5.4 Páginas de Resultado

**Archivo**: `app/payment-success/page.tsx`

```typescript
// Muestra:
- Ícono de éxito (✅)
- Mensaje "¡Pago Aprobado!"
- ID de transacción desde URL params
- Botones: "Continuar comprando", "Ir a inicio"
- Suspense boundary para useSearchParams()
```

**Archivo**: `app/payment-failure/page.tsx`

```typescript
// Muestra:
- Ícono de error (❌)
- Mensaje "Pago Rechazado"
- Botones: "Reintentar pago", "Volver al carrito"
```

**Archivo**: `app/payment-pending/page.tsx`

```typescript
// Muestra:
- Ícono de procesando (⏳)
- Mensaje "Pago Pendiente"
- Botones: "Continuar navegando", "Ir a inicio"
```

### 5.5 Integración en Checkout

**Archivo**: `app/checkout/page.tsx` (Actualizado)

```typescript
Selección de método de pago:
- "Transferencia Bancaria" (siempre)
- "Efectivo contra entrega" (siempre)
- "MercadoPago" (NUEVO - redirige a sandbox)

Formulario y validación idénticos a Fases anteriores

handleSubmitOrder:
1. Valida todos los campos
2. POST /api/orders/create con método seleccionado
3. Si MercadoPago:
   - Redirige a mercadopagoData.init_point (checkout URL)
4. Si Transferencia/Efectivo:
   - Muestra pantalla de confirmación
   - Opción volver al catálogo
```

### 5.6 Configuración de Credenciales

**Archivo**: `.env`

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-123456789
MERCADOPAGO_WEBHOOK_TOKEN=webhook-secret-123
```

**Requisitos de Producción**:
- Cambiar TEST token por token de Producción
- Configurar URL pública para webhooks
- Usar HTTPS en webhook endpoint

---

## 👤 Fase 6: Cuenta Buyer e Historial de Compras

### 6.1 Autenticación del Comprador

**Archivos**:
- `app/buyer-auth/page.tsx`
- `app/api/auth/buyer-login/route.ts`
- `app/api/auth/buyer-register/route.ts`
- `app/api/auth/buyer-logout/route.ts`
- `app/api/buyer/profile/route.ts`

**Características**:
- ✅ Registro de compradores con nombre, email, contraseña y teléfono opcional
- ✅ Login del comprador con cookie `su-bodega-buyer`
- ✅ Logout del comprador con invalidación de cookie
- ✅ Perfil editable para dirección, ciudad y código postal
- ✅ Checkout protegido: sin sesión buyer redirige a `/buyer-auth`

### 6.2 Historial de Compras

**Archivos**:
- `app/buyer/orders/page.tsx`
- `app/api/buyer/orders/route.ts`

**Flujo**:
1. El comprador autenticado ingresa a `/buyer/orders`
2. La página consulta `GET /api/buyer/orders`
3. Si no hay cookie activa, responde `401` y redirige a `/buyer-auth`
4. Si hay sesión válida, devuelve comprador + órdenes ordenadas por fecha descendente
5. La UI muestra productos, total, método de pago, estado y destino de entrega

**Vista del historial**:
- ✅ Cabecera con identidad del comprador
- ✅ Botón de cierre de sesión
- ✅ Estado de la orden (`Pendiente`, `Aprobada`, `Rechazada`, `Cancelada`)
- ✅ Método de pago (`Transferencia`, `Efectivo`, `Mercado Pago`)
- ✅ Desglose de productos por orden
- ✅ Estado vacío cuando todavía no existen compras

### 6.3 Vinculación Buyer → Order

**Archivo**: `prisma/schema.prisma`

```prisma
model BuyerUser {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  phone     String?
  address   String?
  city      String?
  zipCode   String?
  orders    Order[]
  createdAt DateTime @default(now())
}

model Order {
  id              String      @id @default(cuid())
  buyerId         String?
  buyer           BuyerUser?  @relation(fields: [buyerId], references: [id])
  customerEmail   String
  customerName    String
  customerPhone   String
  ...
}
```

**Reglas de negocio**:
- ✅ `POST /api/orders/create` exige buyer autenticado
- ✅ Valida que `customerEmail` y `customerName` coincidan con la sesión activa
- ✅ Persiste `buyerId` en cada orden creada
- ✅ Sin cookie buyer la API responde `401`
- Verificar firma de webhook (X-Signature header)

### 5.7 Flujo Completo End-to-End

```
1. Usuario agrega vinos al carrito
2. Hace clic "Proceder al pago" → /checkout
3. Completa formulario
4. Selecciona "MercadoPago" como método
5. Hace clic "Confirmar Orden"
6. POST /api/orders/create genera:
   - Orden en BD con status='pending'
   - Preferencia en MercadoPago
7. Frontend redirige a mercadopago.com.ar/checkout/XYZ
8. Usuario completa pago en sandbox
9. MercadoPago redirige a /payment-success?preference_id=...
10. Webhook notifica cambio de estado
11. POST /api/webhooks/mercadopago actualiza Order.status='approved'
12. Orden confirmada, cliente recibe email
```

### 5.8 Testing en Sandbox

**Credenciales de Prueba MercadoPago**:
- Sandbox disponible en: https://www.mercadopago.com.ar/developers
- Tarjetas de prueba: https://www.mercadopago.com.ar/developers/es/guias/resources/test-cards
- Ejemplo aprobada: 4111 1111 1111 1111
- CVC: 123, Fecha: 12/25

**Local Testing** (sin webhook externo):
- Dev server: http://localhost:3001
- Webhook local: ngrok/tunnel http://localhost:3001/api/webhooks/mercadopago
- O: configurar en .env y publicar URL temporal

---

## 🔌 API Routes

### POST `/api/wines` - Crear Vino (Admin-only)

```typescript
Request Body:
{
  name: string,
  year: number,
  description?: string,
  price: number,
  region?: string,
  bodega?: string,
  maridaje?: string,
  photos: string[],  // URLs Cloudinary
  grapeTypeId?: string,
  grapeTypeName?: string
}

Response: Wine object con relaciones (grapeType, photos)
Status: 201 Created | 401 Unauthorized | 400 Bad Request | 500 Error
```

### GET `/api/wines` - Listar Vinos

```typescript
Query Parameters:
- year: Filtro por año
- grape: Filtro por tipo de uva
- region: Filtro por región (NUEVO)
- id: Parámetro único (usado en detalle)

Response: Wine[] array con relaciones
```

### POST `/api/grapes` - Crear Tipo de Uva (Admin-only)

```typescript
Request: { name: string }
Response: { id, name }
Status: 201 | 409 Conflict (duplicado) | 401 | 500
```

### GET `/api/grapes` - Listar Tipos de Uva

```typescript
Response: GrapeType[] ordenado por nombre
```

### POST `/api/upload` - Subir Archivo (Admin-only)

```typescript
Request: { file: base64_string }
Response: { url: string }  // URL Cloudinary
Status: 200 | 401 | 500
```

### POST/GET `/api/auth/login` - Login Admin

```typescript
Request: { password: string }
Response: 
  - 200: Set-Cookie su-bodega-admin
  - 401: Wrong password
  - 400: Missing password
```

### POST `/api/auth/logout` - Logout Admin

```typescript
Response: Set-Cookie con expiración
Status: 200
```

---

## 🎯 Componentes Principales

### 1. `app/layout.tsx` (Root)
- Configura fuentes (Playfair Display + Montserrat)
- Envuelve app con `CartProvider`
- Metadata para SEO

### 2. `app/page.tsx` (Home)
- Hero section con CTAs
- Links a catálogo e admin
- Horarios y contacto

### 3. `app/wines/page.tsx` (Catálogo)
- Filtros por año y tipo de uva
- Grid de vinos (2 columnas)
- Items clickeables a detalle
- Botones agregar al carrito
- Favoritos persistentes (Set en estado)
- Mostrador de carrito en header

### 4. `app/wines/[id]/page.tsx` (Detalle)
- Galería expandible
- Información completa
- Productos relacionados
- Agregar al carrito con cantidad

### 5. `app/cart/page.tsx` (Carrito)
- Listado editable
- Resumen con envío
- Código promocional
- Botón redirecciona a checkout
- Botones de acción

### 6. `app/checkout/page.tsx` (Checkout)
- Formulario en 4 secciones
- Información personal y dirección
- Selección de método de pago
- Resumen lateral sticky
- Validaciones en tiempo real
- Pantalla de confirmación

### 7. `app/add-wine/AddWineForm.tsx` (Admin)
- 5 secciones de formulario
- Upload de múltiples fotos
- Previsualización de imágenes
- Crear tipos de uva inline
- Validaciones y mensajes

### 8. `app/admin/page.tsx` (Login)
- Formulario de contraseña
- Error/success messages
- Redirige a `/add-wine` si autenticado

---

## 📁 Estructura de Carpetas

```
su-bodega/
├── app/
│   ├── layout.tsx                 # Root layout con CartProvider
│   ├── page.tsx                   # Home
│   ├── globals.css                # Estilos globales
│   ├── admin/
│   │   └── page.tsx               # Login admin
│   ├── add-wine/
│   │   ├── page.tsx               # Protegido por auth
│   │   └── AddWineForm.tsx        # Componente del formulario
│   ├── cart/
│   │   └── page.tsx               # Página del carrito
│   ├── checkout/
│   │   └── page.tsx               # Página de checkout (ACTUALIZADA)
│   ├── wines/
│   │   ├── page.tsx               # Catálogo
│   │   └── [id]/
│   │       └── page.tsx           # Detalle del producto
│   ├── payment-success/
│   │   ├── page.tsx               # Página de éxito (NUEVA)
│   │   └── content.tsx            # Componente con Suspense (NUEVA)
│   ├── payment-failure/
│   │   ├── page.tsx               # Página de error (NUEVA)
│   │   └── content.tsx            # Componente (NUEVA)
│   ├── payment-pending/
│   │   ├── page.tsx               # Página de procesando (NUEVA)
│   │   └── content.tsx            # Componente (NUEVA)
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts     # POST login (ACTUALIZADA)
│       │   ├── register/route.ts  # POST register (NUEVA)
│       │   └── logout/route.ts    # POST logout
│       ├── orders/
│       │   └── create/route.ts    # POST crear orden + MercadoPago (NUEVA)
│       ├── webhooks/
│       │   └── mercadopago/route.ts # POST webhook MercadoPago (NUEVA)
│       ├── wines/route.ts         # GET/POST wines
│       ├── grapes/route.ts        # GET/POST grapes
│       └── upload/route.ts        # POST upload
├── lib/
│   ├── auth.ts                    # Funciones de autenticación
│   ├── prisma.ts                  # Cliente Prisma
│   └── cart-context.tsx           # Context API del carrito
├── prisma/
│   ├── schema.prisma              # Modelos de BD (ACTUALIZADO)
│   ├── seed.ts                    # Seed script (NUEVA)
│   └── migrations/                # Historial de migraciones
├── public/                        # Archivos estáticos
├── .env                           # Variables de entorno (ACTUALIZADO)
├── package.json                   # Dependencias (ACTUALIZADO)
├── tsconfig.json                  # Config TypeScript
└── tailwind.config.js             # Config Tailwind

```

---

## 🎨 Estilo y Tema

### Colores Principales

```css
--gold: #D4AF37 (acentos, botones)
--coal: #0F0F1E (fondo oscuro)
--slate: Grises para text/borders
```

### Componentes de UI

```css
.btn-premium - Botón dorado con hover
.card-premium - Tarjeta con borde y fondo semi-transparente
.glass - Efecto vidrio translúcido
.container-premium - Contenedor con ancho máximo
```

### Tipografía

- **Playfair Display**: Headings (h1-h3)
- **Montserrat**: Body text y UI

---

## 🚀 Características Implementadas

### ✅ Fase 1: Carrito de Compras
- [x] Context API con localStorage
- [x] Agregar/remover/editar items
- [x] Página de carrito completa
- [x] Cálculo de envío
- [x] Contador en header

### ✅ Fase 2: Página de Detalle del Producto
- [x] Página dinámica `/wines/[id]`
- [x] Galería expandible
- [x] Información completa
- [x] Productos relacionados
- [x] Modal fullscreen
- [x] Navegación de imágenes

### ✅ Fase 3: Página de Checkout
- [x] Ruta `/checkout` con formulario completo
- [x] Secciones: Información Personal, Dirección, Método de Pago
- [x] Validaciones en tiempo real
- [x] Resumen lateral del pedido
- [x] Selección de método de pago (Transferencia, Efectivo contra entrega)
- [x] Confirmación de orden con pantalla de éxito
- [x] Redirección desde página del carrito

### ✅ Fase 4: Búsqueda y Filtros Avanzados
- [x] Búsqueda por nombre (nombre, bodega, descripción)
- [x] Filtro por año (dinámico)
- [x] Filtro por región (dinámico)
- [x] Filtro por tipo de uva
- [x] Ordenamiento (precio, año, relevancia)
- [x] Botón limpiar filtros
- [x] Contador de resultados
- [x] Carga eficiente sin rerequests

### ✅ Fase 5: MercadoPago Payment Gateway
- [x] Integración REST API (sin SDK)
- [x] Modelos de BD: Order, OrderItem, AdminUser
- [x] Endpoint POST /api/orders/create con lógica de pago
- [x] Webhook POST /api/webhooks/mercadopago para actualizar estado
- [x] Páginas de resultado: success, failure, pending
- [x] Admin authentication: registro y login con AdminUser
- [x] Seed script para crear cuenta de prueba (admin@bodega.com / admin123)
- [x] Variables de entorno para tokens MercadoPago
- [x] TypeScript types para CartItem e interfaces de API
- [x] Suspense boundaries en payment pages para useSearchParams()

---

## 🔧 Configuración y Deployment

### Variables de Entorno (.env)

```env
DATABASE_URL=file:./dev.db
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxxxx
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=xxxxx
MERCADOPAGO_ACCESS_TOKEN=TEST-123456789
MERCADOPAGO_WEBHOOK_TOKEN=webhook-secret-123
```

### Comandos

```bash
npm run dev             # Desarrollo (puerto 3001)
npm run build           # Compilación optimizada
npm start               # Producción
npx prisma migrate dev  # Crear migraciones
npx prisma db seed      # Ejecutar seed script
```

### Build Info

- **Turbopack**: Compilación rápida (~7-11s)
- **21 rutas** generadas (actualizado desde 15)
- **127 KB** First Load JS (compartido)
- **TypeScript strict**: Activo
- **ESLint enforcement**: Activo (7 warnings, 0 errors)

---

## 📊 Resumen de Cambios por Archivo

| Archivo | Cambio | Fase | Status |
|---------|--------|------|--------|
| `prisma/schema.prisma` | Agregó Order, OrderItem, AdminUser models | 5 | ✅ |
| `prisma/seed.ts` | Nuevo: Seed script con admin@bodega.com | 5 | ✅ |
| `lib/cart-context.tsx` | Nuevo: Context del carrito | 1 | ✅ |
| `lib/auth.ts` | Existente: Autenticación admin | 3 | ✅ |
| `app/layout.tsx` | Agregó CartProvider | 1 | ✅ |
| `app/cart/page.tsx` | Nueva: Página de carrito + checkout | 1 | ✅ |
| `app/checkout/page.tsx` | Actualizada: MercadoPago payment method | 5 | ✅ |
| `app/wines/page.tsx` | Mejorada: Búsqueda, filtros, carrito | 1,4 | ✅ |
| `app/wines/[id]/page.tsx` | Nueva: Detalle con galería | 2 | ✅ |
| `app/add-wine/AddWineForm.tsx` | Mejorada: Nuevos campos | 3 | ✅ |
| `app/admin/page.tsx` | Actualizada: Login/Register toggle | 5 | ✅ |
| `app/payment-success/page.tsx` | Nueva: Página de éxito + Suspense | 5 | ✅ |
| `app/payment-success/content.tsx` | Nueva: Componente con useSearchParams | 5 | ✅ |
| `app/payment-failure/page.tsx` | Nueva: Página de error + Suspense | 5 | ✅ |
| `app/payment-failure/content.tsx` | Nueva: Componente de error | 5 | ✅ |
| `app/payment-pending/page.tsx` | Nueva: Página de procesando + Suspense | 5 | ✅ |
| `app/payment-pending/content.tsx` | Nueva: Componente de pending | 5 | ✅ |
| `app/api/wines/route.ts` | Actualizado: Nuevos campos (price, region, etc) | 3 | ✅ |
| `app/api/grapes/route.ts` | Existente: Tipos de uva | - | ✅ |
| `app/api/upload/route.ts` | Existente: Subida Cloudinary | - | ✅ |
| `app/api/auth/login/route.ts` | Actualizada: AdminUser + fallback | 5 | ✅ |
| `app/api/auth/register/route.ts` | Nueva: Registro de AdminUser | 5 | ✅ |
| `app/api/auth/logout/route.ts` | Existente: Logout | - | ✅ |
| `app/api/orders/create/route.ts` | Nueva: Crear orden + MercadoPago integration | 5 | ✅ |
| `app/api/webhooks/mercadopago/route.ts` | Nueva: Webhook para actualizar estado pago | 5 | ✅ |
| `package.json` | Agregó: mercadopago, ts-node devDep | 5 | ✅ |
| `.env` | Agregó: MERCADOPAGO_ACCESS_TOKEN, WEBHOOK_TOKEN | 5 | ✅ |

---

## 🎓 Notas Técnicas

### TypeScript Improvements
- Tipos explícitos para CartItem, Wine, WinePhoto
- Validaciones en handlers
- Error handling con tipos seguros

### Next.js Best Practices
- Server Components para seguridad (auth)
- Client Components con 'use client' donde necesario
- Image optimization con Next.js Image
- Dynamic routing con [id]
- SEO metadata

### Tailwind CSS
- Utility-first approach
- Grid responsive (md:grid-cols-2, lg:grid-cols-4)
- Transiciones y hover states
- Dark mode optimizado

### Performance
- Context API para estado local (no Redux)
- localStorage para carrito (sin servidor)
- Lazy loading de imágenes
- Compilación con Turbopack

---

## 📞 Contacto y Soporte

**Desarrollado**: 23 de Junio, 2026  
**Versión**: 1.0 MVP  
**Proyecto**: Su Bodega - E-commerce Premium

---

**Fin del Documento** ✅
