const {escapeHtml: esc} = require('./site');
const demo = require('../content/testimonios-demo.json');

function card(item) {
  return `<article class="review-card" data-review-demo="${esc(item.id)}">
    <p class="demo-badge">Ejemplo ficticio · no es una reseña real</p>
    <p class="review-rating"><span aria-hidden="true">★★★★★</span><span>5/5 · valoración simulada</span></p>
    <blockquote><p>«${esc(item.texto)}»</p></blockquote>
    <div class="review-person"><span class="review-avatar" aria-hidden="true">${esc(item.persona.charAt(0))}</span><div><h3>${esc(item.persona)} <span>· personaje ficticio</span></h3><p>${esc(item.actividad)} · ${esc(item.localidad)}</p></div></div>
  </article>`;
}

module.exports = function renderTestimoniosDemo(config) {
  // Demo content must not become testimonials on the indexable version.
  if (config.indexingEnabled) return '';
  if (demo.demo !== true) throw new Error('Los testimonios de maqueta deben estar identificados como ficticios.');
  return `<section class="section reviews-demo" id="casos-de-exito" aria-labelledby="reviews-title">
    <div class="wrap">
      <div class="section-heading"><p class="eyebrow">Maqueta · contenido de ejemplo</p><h2 id="reviews-title">Casos de éxito <span class="review-heading-note">— vista previa</span></h2><p class="lead">Así se verá este espacio cuando tengamos testimonios reales autorizados.</p></div>
      <div class="demo-notice"><strong>${demo.items.length} reseñas ficticias para probar el diseño.</strong><p>Los nombres, negocios, opiniones y estrellas son inventados. Las localidades solo ambientan los ejemplos: no representan clientes, trabajos realizados ni resultados obtenidos.</p></div>
      <div class="grid review-grid">${demo.items.slice(0, 6).map(card).join('\n')}</div>
      <details class="review-more"><summary>Ver los otros ${demo.items.length - 6} ejemplos ficticios</summary><div class="grid review-grid">${demo.items.slice(6).map(card).join('\n')}</div></details>
    </div>
  </section>`;
};
