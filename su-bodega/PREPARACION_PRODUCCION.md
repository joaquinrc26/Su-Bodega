# Su Bodega: guía de preparación para producción

Esta guía reúne las decisiones y tareas necesarias para publicar Su Bodega con dominio propio, operar la tienda de forma segura y mantenerla después del lanzamiento.

## Estado actual

La aplicación es una tienda Next.js con catálogo administrado desde un panel, imágenes en Cloudinary y carrito que prepara un pedido para enviar por WhatsApp. El pedido y sus condiciones se coordinan directamente entre el cliente y el dueño; el recorrido público no debe pedir cuenta, mostrar tarjeta ni integrar MercadoPago.

**No publicar todavía.** Antes de habilitar el dominio deben cerrarse los bloqueos P0 de esta guía, elegirse hosting/base de datos y probarse el despliegue con datos de producción.

## P0: bloqueos antes de publicar

- [ ] **Rotar las credenciales de Cloudinary.** Antes se encontraron valores con aspecto de credenciales en `.env.example`; el ejemplo local ya fue saneado, pero eso no invalida los valores anteriores. Revocarlos y generar credenciales nuevas desde Cloudinary. Si el archivo llegó a un repositorio remoto, asumir que quedaron expuestos y limpiar el historial cuando corresponda; no reutilizarlos.
- [x] **Limpiar `.env.example`.** La plantilla local ya usa placeholders. Mantenerla sin secretos; las credenciales reales solo van en el gestor de secretos del hosting o en un `.env` local ignorado por Git.
- [x] **Cerrar el alta pública de administradores.** La ruta `POST /api/auth/register` ahora exige una sesión admin; la pantalla pública ya no ofrece crear cuentas.
- [ ] **Eliminar las credenciales de desarrollo.** El proyecto usa valores de admin de desarrollo por defecto y el seed crea una cuenta de prueba con contraseña conocida. No ejecutar `prisma db seed` en producción. Crear el usuario admin de producción de forma controlada y cambiar cualquier credencial compartida durante el desarrollo.
- [x] **Elegir la estrategia de base de datos antes de elegir el hosting.** Prisma ya está configurado para PostgreSQL y el repositorio contiene una línea base PostgreSQL para una base nueva. Crear la base en Neon/Supabase y ejecutar `npx prisma migrate deploy`; no usar SQLite en Vercel.
- [ ] **Verificar autenticación admin en HTTPS.** Generar un `AUTH_COOKIE_SECRET` aleatorio, largo y exclusivo de producción. Revisar las cookies para que usen `Secure` en producción, mantener `HttpOnly` y `SameSite`, y probar login, logout y acceso denegado sin sesión.
- [ ] **Revisar y limitar el acceso al panel y a sus APIs.** Comprobar que todas las operaciones de escritura exigen admin autenticado y que no existe otra ruta que permita alta o cambio de permisos sin autorización.
- [ ] **Confirmar el WhatsApp comercial.** El número está fijado en el código en más de un lugar. Verificarlo con el dueño y probar desde un teléfono real tanto el botón flotante como “Enviar pedido por WhatsApp”. El mensaje debe mostrar productos, cantidades y total; el dueño debe confirmar stock, envío y monto final por chat.
- [ ] **Confirmar precios, stock y logística.** Revisar todos los productos, que no haya precios de prueba, definir zonas y costo de envío, el umbral de envío gratis, horarios, direcciones y medios de contacto publicados. El mensaje preparado por el carrito no crea una orden ni reserva stock: el dueño debe validar disponibilidad y total en WhatsApp.

## P1: terminar el producto

### Administración

- [ ] Probar alta, edición, ocultamiento, reactivación y eliminación de productos, categorías, variedades e imágenes con una cuenta admin de producción.
- [ ] Decidir si el dueño necesita registrar y consultar los pedidos recibidos. Actualmente el carrito los deriva a WhatsApp y no crea una orden en la base de datos ni ofrece un historial operativo al administrador.
- [ ] Confirmar quiénes pueden ser administradores y cómo se recupera el acceso. Evitar cuentas compartidas si varias personas gestionan el catálogo.
- [ ] Verificar que la vista pública y el dashboard admin se distingan claramente y que la vista pública no exponga controles de gestión.

### Tienda y contenido

- [ ] Revisar la tienda en móvil y escritorio: inicio, catálogo, filtros, detalle, carrito, enlaces sociales y estados sin productos.
- [ ] Reemplazar imágenes y textos de muestra; completar títulos, descripciones, precios, añadas, bodegas, regiones, stock y fotos autorizadas.
- [ ] Confirmar por escrito las políticas comerciales: entrega/retiro, cobertura geográfica, cambios, cancelaciones, privacidad, edad mínima y tratamiento de datos personales. Publicar únicamente condiciones aprobadas por el negocio.
- [ ] Revisar accesibilidad básica: navegación por teclado, contraste, etiquetas de formularios, textos alternativos y mensajes de error.
- [ ] Probar que no se pueda enviar un pedido con carrito vacío o productos sin stock. Como el contacto final es WhatsApp, verificar los importes en el mensaje y confirmar que el dueño revalida precios y stock antes de aceptar.
- [ ] Retirar o terminar controles que parezcan funcionales pero no lo sean, como el campo de cupón si no existe una lógica real de aplicación.

### SEO y analítica

- [ ] Configurar `NEXT_PUBLIC_SITE_URL` con la URL HTTPS definitiva. El sitio usa localhost como valor de reserva para metadata.
- [ ] Completar metadata por página, títulos y descripciones, Open Graph, favicon e imágenes sociales con marca e imágenes autorizadas.
- [ ] Crear y verificar `robots.txt` y `sitemap.xml`; excluir rutas privadas como admin y APIs del contenido indexable.
- [ ] Añadir datos estructurados solo cuando reflejen información real y verificable del negocio.
- [ ] Decidir si se necesita analítica. Si se incorpora, documentar cookies/consentimiento y mantener la recolección en el mínimo necesario.

## Hosting y base de datos

### Opción recomendada: plataforma administrada

Para desplegar Next.js en una plataforma serverless o administrada, usar PostgreSQL administrado:

1. Crear una base PostgreSQL de producción y una base separada para pruebas/staging.
2. El proyecto ya declara `provider = "postgresql"` y contiene una migración inicial PostgreSQL. Si aparecen datos del sitio anterior, definir una importación aparte antes de producción.
3. Probar la migración inicial sobre la base de staging antes de producción.
4. Ejecutar `npx prisma migrate deploy` como paso de despliegue controlado. No usar `prisma db push` para actualizar producción ni correr seeds de desarrollo.
5. Verificar conexiones, límites del proveedor y estrategia de backup/restauración.
6. Conectar el repositorio a la plataforma, seleccionar la carpeta `su-bodega` como raíz del proyecto y usar Node.js LTS compatible con Next.js 15.
7. Configurar el comando de instalación/build de acuerdo con el proveedor. El build del proyecto es `npm run build`; el servidor Node tradicional arranca con `npm start`.
8. Configurar variables de entorno de forma independiente para Preview/Staging y Production.

### Alternativa: servidor con disco persistente

Se puede mantener SQLite si se usa una instancia Node.js con volumen persistente, permisos correctos, backups externos y restauración probada. Confirmar que el proceso escribe siempre en el mismo archivo y que no se escale a múltiples réplicas que accedan concurrentemente a SQLite. No asumir que el disco local de cualquier PaaS persiste tras reinicios o despliegues.

## Variables de producción

Definirlas en el gestor de secretos del proveedor; nunca subir valores reales al repositorio:

| Variable | Uso | Requisito de producción |
| --- | --- | --- |
| `DATABASE_URL` | Conexión de Prisma | URL de PostgreSQL tras la migración recomendada, o ruta absoluta/persistente para la alternativa SQLite |
| `ADMIN_PASSWORD` | Fallback de autenticación admin existente | Contraseña fuerte, única y no reutilizada; no dejar el valor de desarrollo. Idealmente retirar el fallback en favor de usuarios admin gestionados |
| `AUTH_COOKIE_SECRET` | Firma de cookies | Cadena aleatoria larga, distinta por entorno |
| `CLOUDINARY_CLOUD_NAME` | Cuenta de imágenes | Cuenta validada por el dueño |
| `CLOUDINARY_API_KEY` | Subida de imágenes | Credencial nueva, no filtrada |
| `CLOUDINARY_API_SECRET` | Subida de imágenes | Credencial nueva, no filtrada |
| `NEXT_PUBLIC_SITE_URL` | Metadata y URL canónica | Dominio final con `https://`, sin barra final |

No definir secretos con prefijo `NEXT_PUBLIC_`: Next.js los expone al navegador. Las variables `NEXT_PUBLIC_CLOUDINARY_*` no son necesarias para la carga actual de imágenes del lado servidor; no agregarlas salvo que se implemente expresamente una función que las requiera.

## Dominio propio y DNS

1. Elegir y registrar el dominio a nombre del negocio; habilitar renovación automática y MFA en la cuenta del registrador.
2. Añadir el dominio en el proveedor de hosting y seguir los registros DNS exactos que indique esa plataforma. No inventar valores A/CNAME: cambian según proveedor.
3. Configurar tanto el dominio raíz como `www` y decidir una URL canónica única. Redirigir la variante secundaria con redirección permanente.
4. Esperar propagación DNS y comprobar HTTPS/certificado TLS emitido antes de anunciar el sitio.
5. Actualizar `NEXT_PUBLIC_SITE_URL` al dominio canónico, desplegar de nuevo y validar enlaces sociales, metadata y previews.
6. Configurar el correo del negocio por separado si se necesita email con el dominio. El flujo de compra actual no envía confirmaciones automáticas por correo.

## Verificación de lanzamiento

### En staging

- [ ] `npm ci` instala desde el lockfile.
- [ ] `npx prisma generate` completa sin errores.
- [ ] `npx prisma migrate deploy` termina correctamente en una base vacía de staging.
- [ ] `npm run lint` y `npm run build` pasan.
- [ ] Admin: acceso correcto, logout, rechazo de sesión inválida y operaciones protegidas.
- [ ] Catálogo: productos visibles, fotos Cloudinary, filtros y detalle.
- [ ] WhatsApp: carrito con varios productos, cantidades, total y enlace al número comercial correcto.
- [ ] Móvil real: encabezado, catálogo, carrito y apertura de WhatsApp.
- [ ] Logs y monitoreo: errores de servidor visibles para el responsable, sin imprimir contraseñas ni secretos.
- [ ] Backup de base de datos creado y restauración probada.

### Publicación

- [ ] Crear backup final antes de migraciones o cambios de datos.
- [ ] Desplegar la versión revisada y ejecutar migraciones según el procedimiento del proveedor.
- [ ] Confirmar dominio canónico, HTTPS, redirección `www`, metadata, redes sociales y WhatsApp.
- [ ] Hacer una compra de prueba con el dueño, verificar mensaje y coordinación, y luego limpiar cualquier dato de prueba.
- [ ] Tener a mano un procedimiento para volver al despliegue anterior y restaurar la base de datos.
- [ ] Avisar al dueño cómo entrar al admin, cambiar stock/precios, cargar fotos y a quién contactar ante una falla.

## Operación continua

- Actualizar dependencias con revisión y build en staging; no aplicar actualizaciones forzadas directamente en producción.
- Revisar alertas, disponibilidad, logs, backups, caducidad del dominio, certificado y facturación del hosting/Cloudinary.
- Probar periódicamente la restauración de backups y los flujos de login, catálogo y WhatsApp.
- Rotar credenciales cuando cambien responsables o haya sospecha de exposición.
- Mantener inventario, precios, promociones, horarios y direcciones al día.

## Enlaces del proyecto

- [Setup local](SETUP.md)
- [README](README.md)
- [Schema Prisma](prisma/schema.prisma)
