const fs = require('fs');
const path = require('path');

const baseUrl = 'https://pymescontrol.github.io/crea-tu-web-con-ia/';
const lastMod = new Date().toISOString().split('T')[0];

function generateSitemap() {
    const sitemapPath = path.join(__dirname, 'sitemap.xml');
    const nichosDir = path.join(__dirname, 'nichos-generados');

    const urls = [];

    // Add main files
    const mainFiles = [
        { file: 'index.html', priority: '1.0' },
        { file: 'consultoria-vip.html', priority: '0.8' },
        { file: 'metodologia.html', priority: '0.8' },
        { file: 'contacto.html', priority: '0.8' }
    ];

    for (const main of mainFiles) {
        const filePath = path.join(__dirname, main.file);
        if (fs.existsSync(filePath)) {
            urls.push({
                loc: `${baseUrl}${main.file}`,
                lastmod: lastMod,
                changefreq: 'weekly',
                priority: main.priority
            });
        }
    }

    // Add generated niche files
    if (fs.existsSync(nichosDir)) {
        const files = fs.readdirSync(nichosDir);
        // Sort files alphabetically to ensure deterministic sitemap generation order
        files.sort().forEach(file => {
            if (file.endsWith('.html')) {
                urls.push({
                    loc: `${baseUrl}nichos-generados/${file}`,
                    lastmod: lastMod,
                    changefreq: 'monthly',
                    priority: '0.6'
                });
            }
        });
    }

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const item of urls) {
        xml += '  <url>\n';
        xml += `    <loc>${item.loc}</loc>\n`;
        xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
        xml += `    <priority>${item.priority}</priority>\n`;
        xml += '  </url>\n';
    }

    xml += '</urlset>\n';

    fs.writeFileSync(sitemapPath, xml, 'utf8');
    console.log(`Sitemap generado con éxito en ${sitemapPath} con ${urls.length} URLs.`);
}

// Allow running directly
if (require.main === module) {
    generateSitemap();
}

module.exports = generateSitemap;
