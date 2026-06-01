# Pymes Control - Web nacional Hub & Spoke

Estructura incluida:

- `index.html`: página principal Hub.
- `plantilla-nicho.html`: plantilla Spoke para duplicar por nicho.
- `contacto.html`: página de cualificación.
- `assets/css/styles.css`: estilos responsive mobile-first.
- `assets/js/main.js`: menú móvil.
- `robots.txt` y `sitemap.xml`: base SEO técnico.

## Cómo crear 100 nichos

Duplica `plantilla-nicho.html` y renombra cada archivo con una URL limpia, por ejemplo:

- `clientes-reformas-madrid.html`
- `clientes-dentistas-valladolid.html`
- `web-para-instaladores-segovia.html`

Después sustituye los placeholders:

- `[NICHO]`
- Meta title
- Meta description
- H1
- FAQs
- Texto de servicios y ciudad
- Canonical

## Recomendación

Para producción real, usa carpetas limpias tipo:

- `/reformas/madrid/`
- `/dentistas/valladolid/`
- `/instaladores/segovia/`

Y actualiza el `sitemap.xml` con todas las URLs finales.
