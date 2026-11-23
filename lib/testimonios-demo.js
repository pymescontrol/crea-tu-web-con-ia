const {escapeHtml: esc} = require('./site');
const demo = require('../content/testimonios-demo.json');

function card(item) {
  return `<article class="review-card" data-review-demo="${esc(item.id)}">
    <p class="review-rating"><span aria-hidden="true">★★★★★</span><span>5/5</span></p>
    <blockquote><p>«${esc(item.texto)}»</p></blockquote>
    <div class="review-person"><span class="review-avatar" aria-hidden="true">${esc(item.persona.charAt(0))}</span><div><h3>${esc(item.persona)}</h3><p>${esc(item.actividad)} · ${esc(item.localidad)}</p></div></div>
  </article>`;
}

module.exports = function renderTestimoniosDemo(config) {
  // Demo content must not become testimonials on the indexable version.
  if (config.indexingEnabled) return '';
  if (demo.demo !== true) throw new Error('Los testimonios de maqueta deben estar identificados como ficticios.');
  return `<section class="section reviews-demo" id="casos-de-exito" aria-labelledby="reviews-title">
    <div class="wrap">
      <div class="section-heading"><h2 id="reviews-title">Reseñas · demo</h2></div>
      <div class="grid review-grid">${demo.items.slice(0, 6).map(card).join('\n')}</div>
      <details class="review-more"><summary>Ver ${demo.items.length - 6} reseñas más</summary><div class="grid review-grid">${demo.items.slice(6).map(card).join('\n')}</div></details>
    </div>
  </section>`;
};
