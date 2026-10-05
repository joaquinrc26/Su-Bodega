# Desarrollo local

La aplicación está dentro de `su-bodega/`. Para trabajar en producción, usar el clon de `joaquinrc26/Su-Bodega`, rama `preparacion-vercel`; no editar `node_modules` ni asumir que la carpeta `Su-Bodega-main` corresponde a esa rama.

## Requisitos

- Node.js LTS compatible con Next.js 15.
- npm.
- Acceso al repositorio GitHub y, si se prueba contra servicios reales, acceso autorizado a Vercel/Neon/Cloudinary.

## Instalar y configurar

Desde la raíz del repositorio:

```powershell
cd su-bodega
npm ci
Copy-Item .env.example .env
```

Editá `.env` local con conexiones de desarrollo. Nunca guardes en Git valores reales de producción. La plantilla incluye:

- `DATABASE_URL`: conexión pooled de Neon para la app.
- `DATABASE_URL_UNPOOLED`: conexión directa para migraciones Prisma.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_COOKIE_SECRET`.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- `NEXT_PUBLIC_SITE_URL`.

Usá una rama/base de desarrollo de Neon separada de producción. El `.env` está ignorado por Git y no debe compartirse.

## Base local/de desarrollo

```powershell
npx prisma generate
npm run db:deploy
```

Para crear categorías y el admin inicial en una base nueva, definí `ADMIN_EMAIL` y `ADMIN_PASSWORD` y ejecutá una sola vez:

```powershell
npx prisma db seed
```

El seed no cambia la contraseña de un admin existente. No uses credenciales de producción en tareas de desarrollo ni ejecutes el seed para restablecer la contraseña.

## Ejecutar y verificar

```powershell
npm run dev -- --port 3001
```

Rutas locales: `http://localhost:3001/`, `/wines` y `/admin`.

```powershell
npm run lint
npm run build
```

`npm ci` ejecuta `postinstall` y genera Prisma Client. El build es `npm run build`.

## Imágenes

La subida es server-side y necesita las tres variables privadas de Cloudinary. El panel acepta hasta tres fotos JPG, PNG o WEBP de máximo 5 MB por producto. No se necesita un upload preset público para el flujo actual.

## Producción

No ejecutar migraciones ni seeds a ciegas desde desarrollo. El estado actual de Neon, Vercel, DNS y SSL está documentado en [`PREPARACION_PRODUCCION.md`](PREPARACION_PRODUCCION.md).
