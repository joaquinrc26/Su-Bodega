# Aplicación Su Bodega

Aplicación Next.js de la tienda pública y su panel administrativo. El repositorio está en `joaquinrc26/Su-Bodega`; la aplicación vive en esta carpeta y Vercel la usa como Root Directory.

## Rutas

- `/`: portada de Su Bodega.
- `/wines`: catálogo de vinos, vinos únicos y regalería.
- `/wines/[id]`: detalle de producto.
- `/cart`: carrito y pedido por WhatsApp.
- `/admin`: login de administración.
- `/admin/dashboard`: gestión de productos e imágenes.

El acceso admin usa una única cuenta inicial. No hay registro público.

## Venta

El cliente arma su carrito y envía el resumen al WhatsApp comercial configurado en el código. El dueño confirma stock, entrega, total y forma de pago en la conversación. No hay pasarela de pago integrada y el envío del mensaje no reserva stock ni crea un pedido persistente.

## Stack y servicios

- Next.js 15, React 19, TypeScript, Tailwind CSS.
- Prisma con PostgreSQL de Neon.
- Imágenes de producto en Cloudinary.
- Deploy en Vercel con rama de producción `preparacion-vercel`.

Para desarrollo y despliegue, seguir [`SETUP.md`](SETUP.md) y [`PREPARACION_PRODUCCION.md`](PREPARACION_PRODUCCION.md).
