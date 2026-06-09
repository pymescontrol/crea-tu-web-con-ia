const fs = require('fs');
const path = require('path');

// Helper to clean string for URL slugs and HTML class values
function cleanString(str) {
    return str.toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "") // remove accents
              .replace(/[^a-z0-9]/g, "-")       // replace non-alphanumeric with -
              .replace(/-+/g, "-")              // collapse duplicate dashes
              .replace(/^-|-$/g, "");           // trim leading/trailing dashes
}

// Mirroring the original label function for niche clean classes
function nicheLabel(niche) {
    const lower = niche.toLowerCase();
    if (lower.includes("reformas")) return "reformas";
    if (lower.includes("dentist") || lower.includes("dentales")) return "dentistas";
    if (lower.includes("abogado")) return "abogados";
    if (lower.includes("pintor")) return "pintores";
    if (lower.includes("instalador")) return "instaladores";
    return niche;
}

function generate() {
    const templatePath = path.join(__dirname, 'plantilla-nicho.html');
    const outputDir = path.join(__dirname, 'nichos-generados');

    // 1. Read template
    if (!fs.existsSync(templatePath)) {
        console.error(`Error: plantilla-nicho.html no existe en ${templatePath}`);
        process.exit(1);
    }
    let templateHtml = fs.readFileSync(templatePath, 'utf8');

    // 2. Clean template (Remove preview-panel and preview script at the end)
    // Regex matches from <!-- PANEL FLOTANTE DE PREVISUALIZACIÓN DE NICHOS up to </script> before </body>
    const previewRegex = /<!-- PANEL FLOTANTE DE PREVISUALIZACIÓN DE NICHOS[\s\S]*<\/script>/i;
    if (previewRegex.test(templateHtml)) {
        templateHtml = templateHtml.replace(previewRegex, '');
        console.log("Se ha eliminado el panel de previsualización y su script asociado.");
    } else {
        console.warn("Advertencia: No se encontró el bloque de previsualización en la plantilla.");
    }

    // 3. Define the 100 niche-city pairs
    const niches = [
        "Reformas Integrales",
        "Clínicas Dentales",
        "Placas Solares",
        "Arquitectos",
        "Abogados de Herencias",
        "Clínicas de Estética",
        "Asesorías Fiscales",
        "Inmobiliarias de Lujo",
        "Mudanzas Nacionales",
        "Instaladores de Climatización"
    ];

    const cities = [
        "Madrid",
        "Barcelona",
        "Valencia",
        "Sevilla",
        "Zaragoza",
        "Málaga",
        "Murcia",
        "Palma de Mallorca",
        "Bilbao",
        "Alicante"
    ];

    const items = [];
    for (const niche of niches) {
        for (const city of cities) {
            items.push({ niche, city });
        }
    }

    // 4. Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`Carpeta creada: ${outputDir}`);
    }

    // 5. Generate files
    let generatedCount = 0;
    for (const item of items) {
        const { niche, city } = item;
        const cleanNicheName = cleanString(niche);
        const cleanCityName = cleanString(city);
        
        // Generate clean slug
        const slug = `${cleanNicheName}-${cleanCityName}`;
        const outputFilename = `${slug}.html`;
        const outputPath = path.join(outputDir, outputFilename);

        // Perform replacements on the cleaned template
        let pageHtml = templateHtml;

        // Global replace for placeholders
        pageHtml = pageHtml.replace(/\[NICHO\]/g, niche);
        pageHtml = pageHtml.replace(/\[CIUDAD\]/g, city);

        // Clean values for dynamic clean spans
        const nicheCleanText = cleanString(nicheLabel(niche));
        const cityCleanText = cleanString(city);

        pageHtml = pageHtml.replace(/<span class="dynamic-nicho-clean">nicho<\/span>/g, `<span class="dynamic-nicho-clean">${nicheCleanText}</span>`);
        pageHtml = pageHtml.replace(/<span class="dynamic-ciudad-clean">ciudad<\/span>/g, `<span class="dynamic-ciudad-clean">${cityCleanText}</span>`);

        // Canonical URL and Schema ID URL replacements
        pageHtml = pageHtml.replace(/plantilla-nicho\.html/g, `nichos-generados/${outputFilename}`);

        // Semantic variability variations
        const variations = [
            "Tu negocio es tuyo, tu web también debería serlo. La mayoría de agencias te atrapan con cuotas fijas de mantenimiento que acaban costándote miles de euros al año por un trabajo inexistente. Es hora de cortar esa sangría. En nuestra Mentoría VIP de 2 horas, te instalamos una infraestructura propia, alojada gratis de por vida, y te enseñamos a gestionarla sin depender de nadie. Cero cuotas, rentabilidad total.",
            "Recupera el control total de tu escaparate digital. ¿Tienes que mandar un email a tu informático y esperar días solo para cambiar una foto o el precio de un servicio? Ese modelo está obsoleto. Desplegamos para ti un ecosistema independiente de alta tecnología. En solo 2 horas, aprenderás a actualizar cualquier oferta en segundos, simplemente chateando con la Inteligencia Artificial. Tú mandas.",
            "Deja de perder clientes por culpa de una web lenta. Si tu página tarda más de 3 segundos en cargar, Google te oculta y tu competencia se lleva las llamadas. Reemplazamos tu viejo WordPress por código puro que carga en 0.2 segundos, posicionándote de forma letal en las búsquedas locales. Te entregamos el sistema llave en mano y te enseñamos a dominarlo en una sesión de 2 horas."
        ];
        const variation = variations[generatedCount % 3];
        pageHtml = pageHtml.replace(/\[EXPLICACION_SERVICIO\]/g, variation);

        // Generate footer cluster links (cities of the same niche)
        const otherCitiesLinks = [];
        for (const otherCity of cities) {
            if (otherCity !== city) {
                const cleanNicheName = cleanString(niche);
                const cleanCityName = cleanString(otherCity);
                const otherSlug = `${cleanNicheName}-${cleanCityName}.html`;
                otherCitiesLinks.push(`<li><a href="${otherSlug}" class="hover:text-emerald-400 transition-colors">Diseño Web para ${niche} en ${otherCity}</a></li>`);
            }
        }
        // Add global pillar link
        otherCitiesLinks.push(`<li class="col-span-2 sm:col-span-3 md:col-span-5 pt-2 border-t border-slate-900/60"><a href="/expertos-${cleanString(niche)}" class="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">Ver soluciones globales para ${niche}</a></li>`);
        
        const clusterHtml = otherCitiesLinks.join('\n            ');
        pageHtml = pageHtml.replace(/\[ENLAZADO_CLUSTER\]/g, clusterHtml);

        // Write file
        fs.writeFileSync(outputPath, pageHtml, 'utf8');
        generatedCount++;
    }

    console.log(`Generación completada con éxito. Se crearon ${generatedCount} archivos HTML en la carpeta 'nichos-generados'.`);

    // Automatically generate sitemap.xml
    try {
        const generateSitemap = require('./generate-sitemap');
        generateSitemap();
    } catch (err) {
        console.error('Error al generar el sitemap automáticamente:', err);
    }
}

generate();

