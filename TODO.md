# Pendientes de Su Bodega

Actualizado el **5 de octubre de 2026**. La tienda ya está desplegada en Vercel con dominio propio y Neon.

## Operación inmediata

- [ ] Probar en el teléfono del dueño una subida/edición real de fotos desde `/admin/dashboard` con las nuevas credenciales de Cloudinary.
- [ ] Confirmar en Vercel que existan los nombres correctos `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET`; eliminar duplicados mal escritos como `CLOUDINAY_*` si todavía existen.
- [ ] Volver a ejecutar `npm audit` en la rama actual y revisar los avisos que reportó la instalación limpia (5 vulnerabilidades: 4 altas y 1 crítica en ese momento). No aplicar `npm audit fix --force` sin revisar cambios incompatibles.
- [ ] Probar desde un móvil el carrito, el mensaje completo a WhatsApp y la coordinación del pedido con el dueño.

## Contenido y negocio

- [ ] Confirmar con el cliente precios, stock, productos, fotos, texto, horarios, direcciones, cobertura y costo de entrega.
- [ ] Revisar políticas de privacidad, edad mínima, cambios y cancelaciones antes de publicarlas.
- [ ] Acordar si el cliente quiere registrar pedidos en un panel. Hoy la compra se coordina por WhatsApp y no crea una orden ni reserva inventario.
- [ ] Retirar o implementar el campo de cupón; no debe parecer funcional si no aplica descuentos.

## Mejoras opcionales

- [ ] Completar SEO: metadata final, Open Graph, favicon, `robots.txt` y `sitemap.xml`.
- [ ] Verificar accesibilidad y el recorrido en tamaños móviles adicionales.
- [ ] Definir un flujo seguro de recuperación/cambio de contraseña admin.
- [ ] Revisar el comportamiento de `www.subodega.com.ar` y la redirección a la URL canónica.

## Ya completado

- [x] Rama `preparacion-vercel` creada y conectada como rama de producción en Vercel.
- [x] Neon PostgreSQL conectado; migración inicial aplicada y seed inicial ejecutado.
- [x] Un admin inicial creado para `subodega@hotmail.com` (la contraseña no se guarda en el repo).
- [x] Integración de MercadoPago retirada; la compra pública se coordina por WhatsApp.
- [x] Dominio `subodega.com.ar` apuntado a Vercel y SSL validado.
- [x] Alta pública de administradores cerrada.
