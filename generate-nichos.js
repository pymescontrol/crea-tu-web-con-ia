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
            "Tu negocio es tuyo, tu web también debería serlo. La mayoría de agencias te atan con cuotas de mantenimiento mensual que acaban costándote cientos de euros al año por un trabajo casi inexistente. Con nuestra mentoría intensiva personalizada, te ayudamos a configurar tu propia web en una infraestructura independiente sin cuotas mensuales y te enseñamos a gestionarla por ti mismo. Propiedad completa, rentabilidad real.",
            "Recupera el control total de tu escaparate digital. Tener que enviar un correo a tu soporte técnico y esperar días para actualizar un precio o un servicio es ineficiente. Con nuestro acompañamiento práctico, aprenderás a editar y actualizar cualquier contenido de tu web de forma autónoma en minutos, usando Inteligencia Artificial para redactar y modificar el código de manera sencilla.",
            "Una web lenta ahuyenta a tus potenciales clientes. Si tu página tarda demasiado en cargar en teléfonos móviles, las visitas se marchan y buscan a otro profesional. Construimos contigo una web ligera, rápida y bien estructurada que carga de forma instantánea en cualquier red móvil, mejorando tu presencia y visibilidad en Google sin pagar hosting recurrente."
        ];
        const variation = variations[generatedCount % 3];
        pageHtml = pageHtml.replace(/\[EXPLICACION_SERVICIO\]/g, variation);

        // Sector-specific unique B2B content
        const sectorData = {
            "Reformas Integrales": {
                problema: "En el sector de las reformas, los clientes buscan ver fotos de calidad de trabajos anteriores, opiniones y una forma clara de pedir presupuesto. Si tu web no transmite confianza técnica de inmediato, el cliente se va a otra empresa.",
                solucion: "Tu web mostrará un porfolio visual limpio de tus proyectos terminados, opiniones destacadas y un formulario de presupuesto directo, diseñado para captar clientes locales interesados en obras reales."
            },
            "Clínicas Dentales": {
                problema: "En las clínicas dentales, la confianza y la cercanía son vitales. Los pacientes quieren conocer al equipo, los tratamientos y las facilidades de contacto directo para pedir cita.",
                solucion: "Estructuramos tu web para mostrar de manera clara tus especialidades (implantes, ortodoncia, estética), el perfil del equipo médico y botones directos de cita o contacto por WhatsApp."
            },
            "Placas Solares": {
                problema: "Los clientes de placas solares buscan claridad sobre el ahorro energético, el proceso de instalación y las subvenciones disponibles. Una web confusa que no responda a esto perderá el interés del usuario al instante.",
                solucion: "La web explicará el paso a paso de la instalación, ejemplos de ahorro estimado en viviendas y naves, y un botón de contacto para solicitar un estudio de viabilidad sin compromiso."
            },
            "Arquitectos": {
                problema: "Un estudio de arquitectura necesita transmitir diseño, profesionalidad y rigor técnico. Si la web es lenta o tiene un diseño descuidado, dañará seriamente la imagen y reputación del estudio.",
                solucion: "Te ayudamos a estructurar una web minimalista y elegante que resalte tus proyectos residenciales o comerciales, tu filosofía de diseño y una forma directa de concertar una reunión técnica."
            },
            "Abogados de Herencias": {
                problema: "El derecho de sucesiones requiere transmitir máxima seriedad, confidencialidad y empatía. Las personas que buscan un abogado de herencias suelen estar pasando por momentos difíciles y necesitan respuestas claras.",
                solucion: "Estructuramos una web enfocada en resolver dudas comunes de herencias y testamentos, mostrando tu experiencia y ofreciendo una primera consulta de valoración muy accesible."
            },
            "Clínicas de Estética": {
                problema: "Las clínicas de medicina estética necesitan mostrar tratamientos seguros, tecnología homologada y resultados realistas. La falta de información clara sobre el personal cualificado genera desconfianza.",
                solucion: "La web presentará tus tratamientos faciales y corporales de forma rigurosa, destacando la seguridad de los procesos, el equipo médico y enlaces para reservar una primera valoración."
            },
            "Asesorías Fiscales": {
                problema: "Pymes y autónomos buscan asesorías que les quiten dolores de cabeza y hablen su mismo idioma. Una web que solo use jerga legal aburrida no conseguirá conectar con los clientes locales.",
                solucion: "Diseñamos la estructura para explicar tus servicios fiscales, laborales y contables con total transparencia, destacando cómo ayudas a ahorrar tiempo y evitar sanciones de Hacienda."
            },
            "Inmobiliarias de Lujo": {
                problema: "En el mercado inmobiliario de gama alta, la presentación visual y la discreción lo son todo. Fotos de baja calidad o webs desorganizadas espantarán de inmediato a los propietarios y compradores premium.",
                solucion: "La estructura destacará la exclusividad de tu cartera de propiedades, servicios de valoración profesional y asesoramiento personalizado para inversores nacionales e internacionales."
            },
            "Mudanzas Nacionales": {
                problema: "Los clientes que cambian de hogar o de oficina temen las pérdidas de objetos o los retrasos. Si tu web no da garantías de seguridad y seguros contratados, elegirán a otro transportista.",
                solucion: "La web transmitirá tranquilidad detallando vuestros seguros de carga, vuestra flota de vehículos y un cotizador de mudanzas intuitivo para agilizar la captación de presupuestos."
            },
            "Instaladores de Climatización": {
                problema: "Cuando una caldera o aire acondicionado falla, la rapidez es crítica. Un cliente que no encuentre de forma inmediata el teléfono de urgencias o los tipos de instalación que hacéis se irá al siguiente resultado.",
                solucion: "La web priorizará el contacto rápido por teléfono o WhatsApp, explicando las marcas con las que trabajáis, los servicios de instalación y el soporte de mantenimiento preventivo."
            }
        };

        const sData = sectorData[niche] || { problema: "", solucion: "" };
        pageHtml = pageHtml.replace(/\[PROBLEMA_SECTOR\]/g, sData.problema);
        pageHtml = pageHtml.replace(/\[SOLUCION_SECTOR\]/g, sData.solucion);

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

