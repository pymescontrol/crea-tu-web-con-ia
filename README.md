# Pymes Control — Tu web. Tu control.

Una web de venta de creación web para pequeños negocios. Oferta confirmada: **99,99 €, pago único, IVA incluido y posibilidad de financiar en tres meses**. El cliente podrá editar contenido desde el chat de ChatGPT en su móvil; el titular explicará la implementación más adelante. No se vende formación.

## Estado actual

- **10 páginas de captación**: Riaza, Segovia, Aranda de Duero, Sepúlveda, Cuéllar, El Espinar, La Granja, Ayllón, Pedraza y Soria.
- **4 páginas generales**: inicio, servicio, proceso y contacto.
- **2 accesos antiguos** con redirección HTML: `consultoria-vip.html` al servicio y `plantilla-nicho.html` al directorio de localidades.
- Total: 14 páginas de contenido y 2 alias; **16 archivos HTML**.
- Se retiraron las 100 páginas de sector/ciudad y los 10 directorios de la versión anterior. La lista exacta está en `lib/retiradas.js`. Una URL retirada no se redirige a una localidad sin relación.

Las diez propuestas incluyen contexto local contrastado, fuentes visibles, decisiones prácticas y una ficha descargable distinta para preparar el negocio. El buyer es común: dueño de un pequeño negocio que quiere una web hecha y poder mantener su contenido al día. La investigación documental se realizó el 18 de octubre de 2026; todavía falta contrastar su utilidad comercial con negocios reales. No se han inventado oficinas, clientes, testimonios, estadísticas ni estudios de competencia.

`docs/inventario-captacion.csv` enumera las diez páginas y sus destinos de consulta. `docs/marca-y-diez-paginas.md` recoge la lectura del PDF y lo que queda pendiente.

`docs/investigacion-local-realizada.md` registra las fuentes leídas, el recurso propio de cada página y los límites de la investigación. Las fichas TXT se descargan desde el contenido de cada página, sin crear nuevas URL públicas ni enviar datos.

## Desarrollo

Node.js y Python 3. Sin dependencias de aplicación que instalar. CSS y JavaScript locales.

```sh
node build-site.js
node --test tests/site.test.js
python3 -m http.server 8000 --bind 127.0.0.1
```

Editar fuentes y regenerar; los HTML son salidas:

| Fuente | Contenido |
|---|---|
| `content/servicio.json` | Oferta, precio y contacto |
| `content/localidades-centro.json` | Riaza, Segovia, Aranda de Duero, Sepúlveda y Cuéllar |
| `content/localidades-entorno.json` | El Espinar, La Granja, Ayllón, Pedraza y Soria |
| `content/guias-locales.json` | Contexto contrastado, decisiones, títulos y fuentes de las diez guías |
| `content/sectores.json` | Actividades seleccionables en el formulario; no genera páginas |
| `lib/catalogo.js` | Validación de contenido, rutas y estado de revisión editorial |
| `lib/retiradas.js` | Manifiesto cerrado de las 110 salidas antiguas que se retiran |
| `generate-pages.js` | Inicio, servicio, proceso, contacto y JavaScript del formulario |
| `generate-nichos.js` | Diez páginas locales, dos alias e inventario |
| `generate-sitemap.js` | Sitemap y robots de acuerdo con las opciones de indexación |
| `lib/marketing.js` | Oferta, cabecera y pie comunes |
| `assets/css/venta.css` | Identidad azul profundo, cian, menta y contenido blanco |

Los comandos antiguos `node generate-nichos.js` y `node generate-sitemap.js` ejecutan la generación completa. Se eliminan únicamente los archivos antiguos identificados por el manifiesto; los archivos ajenos a esa lista se conservan. Conservar una copia fuera de la raíz del sitio antes de aplicar esta migración a otra copia con cambios propios.

Las pruebas trabajan en una copia temporal y cubren retirada limitada, navegación, activos, indexación, canonicals, generación repetible, configuración inválida y condiciones de la oferta. Acreditan funcionamiento técnico, **no aprobación de Google**.

## Contacto y alcance

El formulario recibe `?pagina=riaza` u otro identificador conocido, muestra la propuesta y rellena la localidad. La actividad la elige la persona. Los identificadores desconocidos se ignoran. Prepara un borrador `mailto:` que la persona revisa y envía desde su aplicación; no transmite solicitudes ni procesa pagos.

No se han inventado intereses, importe de cuotas, proveedor de financiación, plazos de entrega o inclusión del dominio/alojamiento. La integración de edición sigue `pending`; la redacción comercial no implementa esa función. No explicar el flujo técnico en la web por petición del titular. Las propuestas del PDF sobre garantía, soporte, formación y transferencia no se añaden automáticamente al alcance contratado.

## Indexación y dominio

`site.config.json` mantiene `baseUrl: ""` e `indexingEnabled: false`: todas las páginas llevan `noindex, follow`, no señalan un dominio inventado y el sitemap está vacío. Robots permite rastrear para leer esa indicación; no es un control de acceso privado.

Hay una segunda condición para cada localidad: `localReview.approved` y una lista de `localReview.evidence` con referencias documentadas. Las fuentes ya están registradas y las aprobaciones siguen en `false`, pendientes de contrastar utilidad comercial y solapamiento. Activar la indexación global no publica automáticamente estos borradores en el sitemap:

- Sitio sin indexación: 0 URLs.
- Indexación global activada, diez localidades sin revisar: 3 URLs generales.
- Diez localidades revisadas y aprobadas, indexación global activada: 13 URLs.
- Contacto y los dos alias quedan siempre fuera.

La revisión editorial es una decisión humana basada en evidencia, no una puntuación de similitud ni un certificado SEO. Registrar fuentes y razonamiento reales, nunca textos de relleno para activar el campo. Las pruebas usan aprobaciones y dominio de ejemplo solo en copias temporales.

Antes de indexar: dominio elegido y conectado; alcance y condiciones de venta definidos; edición ofrecida validada con las instrucciones del titular; información del titular y textos legales aplicables; revisión local individual; comprobación de la versión publicada. Los scripts no compran dominios, cambian DNS, suben código ni solicitan indexación.
