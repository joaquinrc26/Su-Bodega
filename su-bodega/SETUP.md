# Setup local development

1. Copia `.env.example` a `.env` y ajusta variables si es necesario. Un ejemplo mínimo:

```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-unsigned-preset
```

2. Instala dependencias:

```bash
cd su-bodega
npm install
```

3. Genera el cliente Prisma y aplica la migración inicial (crea `dev.db`):

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

Cloudinary: crea un "unsigned upload preset" en tu panel de Cloudinary para permitir subidas públicas desde el navegador, y añade `NEXT_PUBLIC_CLOUDINARY_*` en tu `.env`.

Si prefieres no usar un preset público, puedes subir desde el servidor. Añade las credenciales en tu `.env`:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

He añadido un endpoint server-side en `/api/upload` que acepta `{ "file": "<data-url|image-url>" }` y devuelve `{ url }`.

