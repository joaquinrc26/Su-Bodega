# Implementación actual de Su Bodega

Estado documentado al **5 de octubre de 2026**. Este archivo reemplaza la descripción histórica del MVP. La referencia operacional detallada está en [`su-bodega/PREPARACION_PRODUCCION.md`](su-bodega/PREPARACION_PRODUCCION.md).

## Plataforma

- Next.js 15 App Router, React 19, TypeScript y Tailwind CSS.
- Deploy en Vercel; raíz del proyecto: `su-bodega/`.
- Producción sigue la rama Git `preparacion-vercel` de `joaquinrc26/Su-Bodega`.
- PostgreSQL administrado en Neon con Prisma.
- Fotos subidas desde el servidor a Cloudinary.
- Código y documentación de producción están versionados; valores secretos quedan fuera del repositorio.

## Flujo público de compra

1. El cliente explora `/wines`, abre el detalle y agrega productos al carrito.
2. `/cart` prepara un mensaje con productos, cantidades, subtotal, envío y total.
3. El botón abre WhatsApp del negocio para coordinar disponibilidad, entrega y pago.
4. El pago se acuerda manualmente con el dueño por mensajería.

No se ofrecen MercadoPago ni tarjeta. El mensaje de WhatsApp no crea una orden en Neon ni reserva stock. El dueño confirma disponibilidad y monto antes de aceptar el pedido.

## Administración

- Login: `/admin`; panel de gestión: `/admin/dashboard`.
- La cuenta inicial usa el correo empresarial configurado y credenciales que no se documentan aquí.
- No hay registro público de nuevos administradores.
- El admin puede crear, editar y eliminar productos; cambiar precio, stock, categoría y disponibilidad.
- Se aceptan hasta tres fotos JPG/PNG/WEBP de hasta 5 MB por producto. Al editar, las fotos nuevas reemplazan las anteriores.
- Vinos, vinos únicos y regalería se muestran en el catálogo con una grilla responsiva de hasta tres columnas en desktop.

## Persistencia y servicios

El esquema de [`su-bodega/prisma/schema.prisma`](su-bodega/prisma/schema.prisma) contiene productos, categorías, variedades, fotos, usuarios y modelos de órdenes. La base de producción usa Neon PostgreSQL; la migración `20260929130000_postgresql_init` está aplicada.

Neon–Vercel provee:

- `DATABASE_URL`: endpoint pooled para las consultas de la aplicación.
- `DATABASE_URL_UNPOOLED`: endpoint directo utilizado por Prisma para migraciones.

Las variables de Cloudinary se configuran en Vercel como `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET`.

## Seguridad

- La creación de administradores requiere una sesión admin autenticada.
- La cookie admin se firma con `AUTH_COOKIE_SECRET`, usa comparación segura y agrega `Secure` en producción.
- Las contraseñas de usuarios creadas por el seed se almacenan con hash scrypt.
- No registrar secretos en documentación, código, capturas públicas o Git.

## Rutas importantes

- `/`: portada e información del negocio.
- `/wines`: catálogo y filtros.
- `/wines/[id]`: detalle.
- `/cart`: resumen y salida a WhatsApp.
- `/admin`: login admin.
- `/admin/dashboard`: administración.
- `/buyer-auth` y `/checkout`: redirigen al carrito; no forman parte del proceso público vigente.

## Verificaciones realizadas

- `npm ci`, generación de Prisma Client, `npx prisma validate`, ESLint y `npm run build` pasaron en la rama de despliegue.
- `npm run db:deploy` se ejecutó contra Neon y Prisma reportó la base al día.
- `npx prisma db seed` creó las categorías y verificó el admin inicial.
- La tienda y el login admin fueron comprobados bajo `https://subodega.com.ar` después de validar SSL.
