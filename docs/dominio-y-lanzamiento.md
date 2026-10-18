# Dominio y preparación del lanzamiento

Se prepara **una web con diez páginas de captación**, cuatro generales y dos accesos antiguos. La marca visible es Pymes Control. No hay dominio definitivo elegido ni registrado en esta tarea.

## Dominio

Prioridad indicada por el titular el 18 de octubre: investigar y actualizar las diez páginas y subir la web; la elección del dominio se abordará después. No bloquear esa preparación por la decisión de dominio. La indexación sigue desactivada.

`site.config.json` mantiene `baseUrl` vacío. No se generan canonicals ni `og:url` hacia un dominio ajeno. Evitar introducir `pymescontrol.com` sin propiedad confirmada. Las propuestas anteriores `tuwebporchat.com`, `tuwebeditable.com` y `webentumovil.com` no tienen disponibilidad verificada; no son dominios reservados ni una recomendación final.

Elegir un nombre claro y recordable, comprobar disponibilidad y posibles conflictos de marca. Las palabras del dominio por sí solas no garantizan posiciones en Google. No comprar, configurar DNS ni cambiar el dominio sin la decisión del titular.

La consulta de disponibilidad .com mediante `rdap.verisign.com` estaba bloqueada por la política de red; el dominio se añadió a un borrador de configuración, sin constancia de aplicación. Comprobar el estado actual antes de consultar. Una denegación del proxy no informa sobre si el dominio está libre. Confirmar finalmente con un registrador.

## Condiciones confirmadas y pendientes

Confirmado: creación web, 99,99 € con IVA, pago único y financiación posible en tres meses. Beneficio de edición desde el chat de ChatGPT en el móvil. El titular explicará la implementación más adelante; no mostrar esos detalles en el sitio.

Pendiente: alcance contractual concreto, condiciones detalladas de financiación, dominio y alojamiento, datos del titular y textos legales aplicables, validación del servicio de edición con las indicaciones del titular. No inventar intereses, cuotas, garantía de treinta días ni costes externos gratuitos.

## Revisión de las diez páginas

Las fuentes están en `content/localidades-centro.json` y `content/localidades-entorno.json`. Cada una conserva `localReview.approved: false` y `evidence: []`. Hace falta investigar el contexto y justificar la utilidad local. Véase `docs/marca-y-diez-paginas.md`.

El campo de aprobación editorial no representa una certificación de Google. Registrar referencias y razones comprobadas para la decisión. No aprobar una página por longitud, variedad de sinónimos o diferencias de color.

## Publicación e indexación

1. Elegir, registrar y conectar el dominio HTTPS y acordar el alojamiento.
2. Configurar `baseUrl` con ese dominio, manteniendo `indexingEnabled: false` durante la revisión.
3. Ejecutar `node build-site.js` y las pruebas. Desplegar con sincronización de eliminaciones para retirar también las 110 salidas antiguas del servidor.
4. Comprobar en la versión publicada el contenido, el formulario, la edición ofrecida, la respuesta HTTP y los canonicals. Las URL antiguas retiradas deben responder 404/410 cuando no tienen equivalente; no redirigirlas en bloque a la portada.
5. Tras la revisión general y local, activar las páginas aprobadas y la opción global, regenerar y verificar sitemap. Contacto y alias permanecen fuera.
6. Verificar el dominio en Search Console y revisar el resultado real antes de ampliar el catálogo.

Sitemap: cero URLs con indexación desactivada; tres generales si solo se activa la opción global; hasta trece cuando las diez localidades estén aprobadas. Robots permite rastrear para leer `noindex`; esta medida no hace privados los borradores.

No se ha publicado el sitio, subido cambios a GitHub, comprado un dominio ni solicitado indexación en esta tarea.
