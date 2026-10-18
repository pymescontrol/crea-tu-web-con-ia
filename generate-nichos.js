const fs = require('node:fs');
const path = require('node:path');
const {root, readConfig, escapeHtml: esc, seoTags} = require('./lib/site');
const {shell, price, offerCard, priceNote, editingBenefit} = require('./lib/marketing');
const {getPages, contactUrl} = require('./lib/catalogo');
const {removeRetiredFiles} = require('./lib/retiradas');

const list = items => `<ul class="checklist">${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;

function renderPage(page, pages, config) {
  const contact = contactUrl(page);
  const guide = page.guide;
  const worksheet = [
    `PYMES CONTROL — Preparar una web en ${page.city}`, guide.heading,
    'Ficha de trabajo. Completa únicamente los datos reales de tu negocio.', '',
    'Nombre comercial:', 'Actividad:', 'Localidad exacta:', 'Contacto:', '',
    ...guide.decisions.flatMap((item, index) => [`${index + 1}. ${item.label}`, item.text, 'Mi respuesta:', '', '']),
    'MATERIALES PARA PREPARAR', ...page.checklist.map(item => `- ${item}`), '',
    'FUENTES DE CONTEXTO LOCAL — consultadas el 18 de octubre de 2026',
    ...guide.sources.map(source => `${source.label}: ${source.url}`), '',
    'Esta ficha orienta la preparación del contenido; no es un presupuesto ni una reserva.'
  ].join('\n');
  const related = page.related.map(id => pages.find(candidate => candidate.id === id));
  const body = `<section class="hero"><div class="wrap">
    <p class="breadcrumbs"><a href="../index.html">Inicio</a> / <a href="../index.html#localidades">Localidades</a> / ${esc(page.city)}</p>
    <p class="eyebrow">${esc(page.angle)}</p><h1>${esc(guide.headline)}</h1>
    <p class="lead">${esc(page.intro)}</p><p>${esc(page.audience)}</p>
    <p class="lead">Creamos la web de tu negocio por <strong>${esc(price())}</strong>.</p><p class="small">${esc(priceNote())}</p>
    <div class="actions"><a class="button" href="../${esc(contact)}">Consultar mi web</a><a class="button secondary" href="#guia-local">Preparar mi contenido</a></div>
  </div></section>
  <div class="wrap layout section"><div class="article">
    <section id="guia-local" data-editorial="specific"><p class="eyebrow">Prepara tu propuesta en ${esc(page.city)}</p><h2>${esc(guide.heading)}</h2>
      ${guide.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}
      <div class="example">${guide.decisions.map(item => `<h3>${esc(item.label)}</h3><p>${esc(item.text)}</p>`).join('')}</div>
      <p><a class="button" href="data:text/plain;charset=utf-8,${esc(encodeURIComponent(worksheet))}" download="preparar-web-${esc(page.id)}.txt">Descargar ficha para mi negocio · TXT</a></p>
      <p class="small">Puedes completarla a tu ritmo para preparar la consulta.</p>
      <details class="local-sources"><summary>Fuentes del contexto local</summary><ul>${guide.sources.map(source => `<li><a href="${esc(source.url)}">${esc(source.label)}</a></li>`).join('')}</ul><p class="small">Consultadas el <time datetime="2026-10-18">18 de octubre de 2026</time>. Comprueba en la fuente los datos que puedan cambiar.</p></details>
    </section>
    ${page.sections.map(section => `<section data-editorial="specific"><h2>${esc(section.heading)}</h2>${section.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}${section.items.length ? list(section.items) : ''}</section>`).join('')}
    <section id="ejemplo" data-editorial="specific"><p class="eyebrow">Ejemplo orientativo</p><h2>${esc(page.example.title)}</h2>
      <p>${esc(page.example.description)}</p><div class="example">${page.example.items.map(item => `<h3>${esc(item.label)}</h3><p>${esc(item.text)}</p>`).join('')}</div>
    </section>
    <section data-editorial="specific"><h2>Qué preparar antes de crear tu web</h2>${list(page.checklist)}</section>
    <section class="faq" data-editorial="specific"><h2>Preguntas sobre esta propuesta</h2>${page.faq.map(item => `<details><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join('')}</section>
    <section><h2>Tu negocio cambia; tu web también</h2><p>${esc(editingBenefit())}</p><p><a href="../servicio.html">Consulta qué incluye el servicio y sus condiciones</a>.</p><a class="button" href="../${esc(contact)}">Quiero consultar mi web</a></section>
  </div><aside class="aside-stack" aria-label="Servicio y otras propuestas">
    ${offerCard({prefix: '../', contact, label: 'Consultar mi web'})}
    <section class="card"><h2>Propuestas relacionadas</h2><p>Consulta otros ejemplos de organización del contenido.</p><ul class="checklist">${related.map(item => `<li><a href="../${esc(item.file)}">${esc(item.city)} · ${esc(item.angle)}</a></li>`).join('')}</ul></section>
  </aside></div>`;
  return shell({file: page.file, title: guide.title, description: page.description, body, config, prefix: '../', indexable: page.indexable});
}

function redirect(target, label, config, destination) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(label)}</title>${seoTags(destination, config, false)}<meta http-equiv="refresh" content="0; url=${esc(target)}"></head><body><main><h1>${esc(label)}</h1><p><a href="${esc(target)}">Continuar</a></p></main></body></html>\n`;
}

function generate(config = readConfig()) {
  const pages = getPages();
  // Prepare all output before retiring the explicitly known previous catalogue.
  const outputs = pages.map(page => [page.file, renderPage(page, pages, config)]);
  const removed = removeRetiredFiles(root);
  fs.mkdirSync(path.join(root, 'localidades'), {recursive: true});
  for (const [file, html] of outputs) fs.writeFileSync(path.join(root, file), html);
  fs.writeFileSync(path.join(root, 'plantilla-nicho.html'), redirect('index.html#localidades', 'Propuestas de web por localidad', config, 'index.html'));
  fs.writeFileSync(path.join(root, 'consultoria-vip.html'), redirect('servicio.html', 'Creación de tu web', config, 'servicio.html'));
  const rows = pages.map(page => [page.file, page.city, page.angle, page.audience, page.indexable ? 'Revisión editorial aprobada' : 'Pendiente de revisión local; noindex', contactUrl(page)]);
  const inventory = ['pagina,ciudad,enfoque,audiencia,estado_seo,destino_consulta', ...rows.map(row => row.map(value => '"' + value.replaceAll('"', '""') + '"').join(','))].join('\n') + '\n';
  fs.mkdirSync(path.join(root, 'docs'), {recursive: true});
  fs.writeFileSync(path.join(root, 'docs/inventario-captacion.csv'), inventory);
  console.log(`${pages.length} páginas locales generadas; ${removed.length} salidas antiguas retiradas. La revisión editorial no certifica resultados en Google.`);
}

module.exports = generate;
if (require.main === module) require('./build-site')();
