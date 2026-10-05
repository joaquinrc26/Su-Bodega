# Estado de producción y guía de cambios

Actualizado el **5 de octubre de 2026**. Esta guía es el registro operativo para continuar el proyecto después del despliegue.

## Producción actual

- Sitio: https://subodega.com.ar
- Admin: https://subodega.com.ar/admin
- Plataforma: Vercel; raíz configurada como `su-bodega/`.
- Repositorio: https://github.com/joaquinrc26/Su-Bodega
- Rama de producción: `preparacion-vercel`; `main` se conserva separada.
- Base de datos: Neon PostgreSQL, base `neondb`, rama Neon predeterminada nombrada `preparacion-vercel`.
- Migración inicial PostgreSQL aplicada; Prisma reporta el esquema al día.
- Seed ejecutado: categorías y admin inicial verificados.
- Admin único: `subodega@hotmail.com`. No documentar su contraseña.
- Dominio añadido a Vercel; SSL validado. DNS permanece administrado en Ferozo.
- Variables privadas se guardan en Vercel y en `.env` local ignorado; nunca en Git.

## Arquitectura y recorrido de cliente

El visitante explora `/wines`, agrega productos y desde `/cart` abre un mensaje preparado para WhatsApp. El dueño confirma stock, entrega, total y forma de pago por chat. El sitio no usa MercadoPago ni tarjetas. El mensaje no crea una orden en la base ni reserva inventario.

El panel `/admin` permite gestionar productos e imágenes. La tienda muestra hasta tres productos por fila en desktop y se adapta a móvil. Cada producto acepta hasta tres fotos; al guardar fotos nuevas desde editar se sustituyen las anteriores.

## Variables y servicios

Neon–Vercel proporciona automáticamente:

- `DATABASE_URL`: conexión pooled para la aplicación.
- `DATABASE_URL_UNPOOLED`: conexión directa que usa `prisma migrate deploy`.

Variables adicionales en Vercel:

- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_COOKIE_SECRET`.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- `NEXT_PUBLIC_SITE_URL`.

Verificar los nombres exactos. Evitar duplicados o errores tipográficos como `CLOUDINAY_*`. No pegar valores secretos en issues, chats, commits o capturas.

## Flujo para cambios que pida el cliente

1. Confirmar el pedido del cliente y delimitar qué páginas, datos o reglas comerciales cambiarán.
2. Actualizar la rama local de trabajo desde `origin/preparacion-vercel`.
3. Crear una rama de trabajo, por ejemplo `feature/ajuste-catalogo`.
4. Hacer el cambio y probar `npm run lint` y `npm run build`; agregar pruebas según el riesgo.
5. Subir la rama de trabajo. Vercel debe generar un Preview; revisar la vista y probar el flujo afectado sin exponer Production.
6. Abrir un Pull Request hacia `preparacion-vercel`, revisar el diff y mergear solo con aprobación.
7. El merge a `preparacion-vercel` genera el despliegue Production. Revisar logs, inicio, catálogo, `/admin` y WhatsApp.
8. No cambiar `main` ni el dominio/DNS sin que sea parte del pedido aprobado.

Si se modifica el schema Prisma, crear y revisar una migración PostgreSQL; aplicar `npm run db:deploy` con `DATABASE_URL_UNPOOLED` antes o durante una ventana controlada de despliegue. No usar `prisma db push` en producción. No ejecutar `prisma db seed` en cada deploy.

## Dominio y DNS

- NIC.ar sigue siendo el registrador; la zona DNS está en Ferozo.
- El A del dominio raíz apunta a Vercel (`216.198.79.1` según el panel consultado).
- Se quitó el AAAA raíz antiguo que causaba configuración SSL conflictiva.
- `www` mantiene CNAME al dominio raíz; verificar su estado en Vercel Domains.
- No cambiar nameservers ni borrar SOA/NS, MX, FTP, autoconfig/autodiscover u otros registros no web.
- El correo personal del dueño es Hotmail y no depende del DNS del dominio.

## Tareas de seguimiento

- Probar una subida real de fotos con las credenciales Cloudinary nuevas.
- Revisar en Vercel que no queden variables `CLOUDINAY_*` mal escritas/duplicadas.
- Repetir `npm audit` en la rama actual y planificar remediación; una instalación anterior reportó cinco vulnerabilidades (cuatro altas y una crítica).
- Confirmar precios, inventario, textos, fotos autorizadas, horarios y condiciones de entrega con el cliente.
- Decidir si se necesita guardar pedidos en Neon o si WhatsApp seguirá siendo el único registro operativo.
- Completar SEO y revisar accesibilidad/móvil.

## Referencias

- [README de la aplicación](README.md)
- [Setup local](SETUP.md)
- [Resumen técnico](../IMPLEMENTACIONES.md)
- [Pendientes](../TODO.md)
