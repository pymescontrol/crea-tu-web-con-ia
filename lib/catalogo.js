const sectorData = require('../content/sectores.json');
const centro = require('../content/localidades-centro.json');
const entorno = require('../content/localidades-entorno.json');
const guides = require('../content/guias-locales.json');

const ids = ['riaza', 'segovia', 'aranda-de-duero', 'sepulveda', 'cuellar', 'el-espinar', 'la-granja', 'ayllon', 'pedraza', 'soria'];
const sectors = sectorData.map(({slug, name}) => ({slug, name}));
const hasText = value => typeof value === 'string' && value.trim().length > 0;
const textList = value => Array.isArray(value) && value.length > 0 && value.every(hasText);
function isPublicHttps(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch { return false; }
}

function getPages() {
  const records = [...centro, ...entorno];
  if (records.length !== ids.length || new Set(records.map(page => page.id)).size !== ids.length || records.some(page => !ids.includes(page.id))) {
    throw new Error('El catálogo debe contener las diez localidades previstas, sin duplicados.');
  }
  return ids.map(id => {
    const page = records.find(record => record.id === id);
    const valid = ['city', 'angle', 'audience', 'description', 'intro'].every(key => hasText(page[key])) &&
      Array.isArray(page.sections) && page.sections.length > 0 && page.sections.every(section =>
        hasText(section.heading) && textList(section.paragraphs) && Array.isArray(section.items) && section.items.every(hasText)) &&
      page.example && hasText(page.example.title) && hasText(page.example.description) &&
      Array.isArray(page.example.items) && page.example.items.length > 0 && page.example.items.every(item => hasText(item.label) && hasText(item.text)) &&
      textList(page.checklist) && Array.isArray(page.faq) && page.faq.length === 3 &&
      page.faq.every(item => hasText(item.question) && hasText(item.answer)) &&
      Array.isArray(page.related) && page.related.length === 2 && new Set(page.related).size === 2 &&
      page.related.every(related => related !== id && ids.includes(related));
    if (!valid) throw new Error(`Contenido incompleto de la localidad: ${id}.`);
    const guide = guides[id];
    if (!guide || !['headline', 'title', 'heading', 'scope'].every(key => hasText(guide[key])) ||
      !textList(guide.paragraphs) || !Array.isArray(guide.decisions) || guide.decisions.length < 3 ||
      !guide.decisions.every(item => hasText(item.label) && hasText(item.text)) ||
      !Array.isArray(guide.sources) || !guide.sources.length ||
      !guide.sources.every(item => hasText(item.label) && isPublicHttps(item.url))) {
      throw new Error(`Guía local o fuentes incompletas: ${id}.`);
    }
    // This is an explicit editorial decision, never inferred from text length or uniqueness.
    const indexable = page.localReview?.approved === true && textList(page.localReview.evidence);
    return {...page, guide, file: `localidades/creacion-web-${id}.html`, indexable};
  });
}

function contactUrl(page) {
  return `contacto.html?pagina=${encodeURIComponent(page.id)}`;
}

module.exports = {sectors, getPages, contactUrl};
