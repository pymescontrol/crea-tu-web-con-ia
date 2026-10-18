const {escapeHtml: esc, seoTags} = require('./site');
const offer = require('../content/servicio.json');

function price() {
  return new Intl.NumberFormat('es-ES', {style: 'currency', currency: offer.currency}).format(Number(offer.price));
}
function priceNote() {
  const parts = [];
  if (offer.billing === 'one_time') parts.push('Pago único');
  if (offer.billing === 'monthly') parts.push('Cuota mensual');
  if (offer.taxIncluded === true) parts.push('IVA incluido');
  if (offer.taxIncluded === false) parts.push('IVA no incluido');
  if (offer.financingMonths) parts.push(`Financiación disponible en ${offer.financingMonths} meses`);
  return parts.length ? parts.join(' · ') : 'Consulta las condiciones del servicio antes de contratar.';
}
function editingBenefit() {
  return 'Podrás editar textos, precios y horarios desde el chat de ChatGPT en tu móvil.';
}
function shell({file, title, description, body, config, prefix = '', indexable = true, extraHead = '', scripts = ''}) {
  return `<!DOCTYPE html>
<html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
${seoTags(file, config, indexable)}
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<link rel="stylesheet" href="${prefix}assets/css/venta.css">${extraHead}
</head><body>
<a class="skip" href="#contenido">Saltar al contenido</a>
<header class="site-header"><div class="wrap header-row"><a class="brand" href="${prefix}index.html"><span class="brand-icon" aria-hidden="true">P</span>Pymes Control</a>
<nav aria-label="Navegación principal"><a href="${prefix}index.html#localidades">Para tu negocio</a><a href="${prefix}servicio.html">Qué ofrecemos</a><a href="${prefix}metodologia.html">Cómo funciona</a><a class="button small-button" href="${prefix}contacto.html">Quiero mi web</a></nav></div></header>
<main id="contenido">${body}</main>
<footer><div class="wrap footer-row"><div><a class="brand" href="${prefix}index.html">Pymes Control</a><p>Tu web. Tu control.</p></div><nav aria-label="Enlaces de contacto"><a href="${prefix}contacto.html">Contacto</a><a href="mailto:${esc(offer.contactEmail)}">${esc(offer.contactEmail)}</a><a href="tel:${esc(offer.contactPhone)}">${esc(offer.contactPhone)}</a></nav></div></footer>
${scripts}</body></html>\n`;
}
function offerCard({prefix = '', contact = 'contacto.html', label = 'Consultar esta web'} = {}) {
  return `<section class="offer-card"><p class="eyebrow">Un único servicio</p><h2>Nosotros creamos tu web</h2><p class="price">${esc(price())}</p><p class="small muted">${esc(priceNote())}</p><p>Una web para presentar tu negocio y facilitar que te contacten.</p><p>${esc(editingBenefit())}</p><a class="button" href="${prefix}${esc(contact)}">${esc(label)}</a></section>`;
}
module.exports = {shell, price, priceNote, editingBenefit, offerCard, offer};
