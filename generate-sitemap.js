const fs = require('node:fs');
const path = require('node:path');
const {root, readConfig, pageUrl, escapeHtml: esc} = require('./lib/site');
const {getPages} = require('./lib/catalogo');

function generateSitemap(config = readConfig()) {
  const pages = ['index.html', 'servicio.html', 'metodologia.html', ...getPages().filter(page => page.indexable).map(page => page.file)];
  const urls = config.indexingEnabled ? pages.map(file => {
    if (!fs.existsSync(path.join(root, file))) throw new Error(`No existe ${file}.`);
    return `  <url><loc>${esc(pageUrl(file, config))}</loc></url>`;
  }) : [];
  fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\n${config.indexingEnabled ? `Sitemap: ${config.baseUrl}sitemap.xml\n` : ''}`);
  console.log(`Sitemap: ${urls.length} URLs; indexación ${config.indexingEnabled ? 'activada' : 'desactivada'}.`);
}

module.exports = generateSitemap;
if (require.main === module) require('./build-site')();
