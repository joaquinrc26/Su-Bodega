# Su Bodega

Tienda online de la vinoteca Su Bodega. Este documento refleja el estado operativo al **5 de octubre de 2026**.

## Estado actual

- Sitio público: https://subodega.com.ar
- Panel de administración: https://subodega.com.ar/admin
- El dominio está publicado en Vercel y el certificado HTTPS fue validado.
- Código de producción: rama `preparacion-vercel` del repositorio `joaquinrc26/Su-Bodega`.
- Vercel usa `su-bodega/` como directorio raíz.
- Base de datos PostgreSQL en Neon; migración inicial aplicada y categorías/admin inicial creados.
- Cuenta admin única: `subodega@hotmail.com`. La contraseña no se documenta en el repositorio.
- Las compras se envían al dueño por WhatsApp; el pago y la entrega se coordinan por chat. No hay pago con tarjeta ni MercadoPago.

## Funcionalidad

- Catálogo de vinos, vinos únicos y regalería con filtros y detalle de producto.
- Grilla de hasta tres productos por fila en pantallas grandes, adaptable a pantallas chicas.
- Carrito persistido en el navegador y mensaje de pedido preparado para WhatsApp.
- El carrito no registra una orden en la base ni reserva stock; el dueño confirma disponibilidad y total por WhatsApp.
- Panel admin para crear, editar, activar/desactivar y eliminar productos.
- Hasta tres fotos por producto; las fotos se pueden reemplazar desde el formulario de edición.
- Imágenes alojadas en Cloudinary.

## Repositorio y despliegue

- Repositorio: https://github.com/joaquinrc26/Su-Bodega
- Rama configurada como Production en Vercel: `preparacion-vercel`.
- `main` se conserva sin mezclar los cambios de producción.
- Vercel despliega cada push a `preparacion-vercel`.
- Neon es la base de producción; la integración proporciona `DATABASE_URL` (pooled) y `DATABASE_URL_UNPOOLED` (directa para Prisma).

## Documentos

- [Guía de desarrollo local](su-bodega/SETUP.md)
- [Estado, despliegue y operación](su-bodega/PREPARACION_PRODUCCION.md)
- [Resumen técnico actual](IMPLEMENTACIONES.md)
- [Pendientes para el cliente](TODO.md)

## Seguridad

No guardar secretos, contraseñas, URLs de conexión ni archivos `.env` en Git. Los valores de producción se administran desde Vercel. El `.env` local se mantiene ignorado por Git.
