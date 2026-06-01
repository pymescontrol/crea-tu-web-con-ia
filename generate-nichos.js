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

        // Write file
        fs.writeFileSync(outputPath, pageHtml, 'utf8');
        generatedCount++;
    }

    console.log(`Generación completada con éxito. Se crearon ${generatedCount} archivos HTML en la carpeta 'nichos-generados'.`);
}

generate();
