const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
function readConfig() {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'site.config.json'), 'utf8'));
  if (typeof config.baseUrl !== 'string' || typeof config.indexingEnabled !== 'boolean') {
    throw new Error('baseUrl debe ser texto e indexingEnabled debe ser booleano.');
  }
  if (config.baseUrl) {
    const url = new URL(config.baseUrl);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
      throw new Error('baseUrl debe ser una URL HTTPS pública sin credenciales, consulta ni fragmento.');
    }
    config.baseUrl = url.href.replace(/\/$/, '') + '/';
  }
  if (config.indexingEnabled && !config.baseUrl) {
    throw new Error('Antes de activar la indexación, configura el dominio registrado en baseUrl.');
  }
  return config;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
}
function pageUrl(file, config) {
  return config.baseUrl ? new URL(file === 'index.html' ? '' : file, config.baseUrl).href : '';
}
function seoTags(file, config, indexable = true) {
  const url = pageUrl(file, config);
  return `<meta name="robots" content="${config.indexingEnabled && indexable ? 'index' : 'noindex'}, follow">` +
    (url ? `\n    <link rel="canonical" href="${escapeHtml(url)}">\n    <meta property="og:url" content="${escapeHtml(url)}">` : '');
}
module.exports = {root, readConfig, escapeHtml, pageUrl, seoTags};
