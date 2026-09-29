# Setup local development

La aplicación activa está dentro de `su-bodega/`. Todos los comandos siguientes se ejecutan desde esa carpeta.

## Cuenta administrativa de desarrollo

La cuenta con permisos administrativos completos es:

- Email: `admin@bodega.com`
- Contraseña: `admin123`

Entrá en `http://localhost:3001/admin`. En este proyecto no existe un rol separado llamado "super admin": las cuentas `AdminUser` tienen acceso al panel y a la gestión del catálogo.

Para producción, cambiá esta contraseña y definí un `AUTH_COOKIE_SECRET` largo y aleatorio.

1. Abrí una terminal en la carpeta del proyecto y copiá `.env.example` a `.env`:

```powershell
cd C:\Users\Joaqu\OneDrive\Desktop\Su-Bodega-main\su-bodega
Copy-Item .env.example .env
```

Editá `.env` y ajustá variables si es necesario. Para navegar y probar el catálogo alcanza con:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-unsigned-preset
```

2. Instalá dependencias:

```bash
cd su-bodega
npm install
```

3. Generá el cliente Prisma y aplicá la migración inicial PostgreSQL:

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

El seed es para desarrollo o staging. No lo ejecutes en producción: crea o actualiza el administrador definido por `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

4. Levantá el servidor de desarrollo:

```bash
npm run dev -- --port 3001
```

5. Abrí en el navegador:

- Tienda: `http://localhost:3001`
- Catálogo: `http://localhost:3001/wines`
- Administrador: `http://localhost:3001/admin`

Para detener el servidor, presioná `Ctrl+C` en esa terminal. Para las siguientes sesiones, normalmente solo necesitás ejecutar `npm run dev -- --port 3001`; las migraciones y el seed se ejecutan cuando inicializás una base nueva.

## Carga de imágenes

Las fotos se suben desde el servidor; no hace falta crear un upload preset público. En tu cuenta de Cloudinary, copiá estas tres credenciales en `.env`:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Después reiniciá `npm run dev -- --port 3001`. El panel permite hasta tres fotos por producto, acepta JPG/PNG/WEBP de hasta 5 MB y Cloudinary las guarda recortadas en formato cuadrado.

## Foto de portada

Para la portada completa del inicio, agregá una foto horizontal de la bodega, botellas o una escena de vino en `public/hero-cover.jpg`. Se recomienda una imagen de al menos 1920 x 1080 px. El sitio la muestra con texto superpuesto y se adapta a celular automáticamente.

