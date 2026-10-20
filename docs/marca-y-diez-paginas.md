# Marca aplicada y diez propuestas locales

Revisión del 18 de octubre de 2026. Referencia: PDF «PYMES_CONTROL_Identidad_Marca_Buyer_Persona», 16 páginas. El documento se ha leído como material de marca; sus recomendaciones no sustituyen las decisiones expresas del titular en el chat.

## Qué se ha aplicado

- Mensaje «Tu web. Tu control.» y creación de la web del cliente.
- Un buyer común: propietario de un pequeño negocio local que quiere explicar su oferta y actualizar contenidos con facilidad.
- Tono de tú a tú, claro y práctico; diseño azul profundo, cian, menta y blanco.
- Precio confirmado de 99,99 €, pago único con IVA incluido y financiación posible en tres meses.
- Beneficio de editar contenidos desde el chat de ChatGPT en el móvil, sin explicar el funcionamiento técnico.
- Diez propuestas para el primer grupo de localidades elegido por el titular.

Las propuestas del PDF no se convirtieron automáticamente en compromisos. Posteriormente el titular confirmó condiciones de páginas, materiales, plazo objetivo, cambios y devolución recogidas en `docs/condiciones-servicio-borrador.md`; estas instrucciones prevalecen sobre el PDF. El cliente paga el dominio. Alojamiento compatible y financiación detallada siguen pendientes. No se publican incrementos de clientes, retorno de inversión ni posiciones garantizadas.

## Contenido propio de cada página

| Localidad | Necesidad desarrollada | Recurso práctico |
|---|---|---|
| Riaza | Explicar un alojamiento o pequeño negocio antes de consultar | Ficha orientativa de capacidad, servicios y condiciones |
| Segovia | Ordenar varias líneas de servicio | Elección de estructura según la decisión del cliente |
| Aranda de Duero | Presentar carta, menú y atención a grupos | Modelo de información y preparación de consultas |
| Sepúlveda | Ayudar a preparar la primera visita a un negocio | Recorrido desde qué ofrece hasta cómo acudir y contactar |
| Cuéllar | Reunir información dispersa en redes | Conversión de publicaciones en contenidos estables |
| El Espinar | Explicar cobertura y requisitos para presupuestar | Ficha de zona atendida y datos necesarios para una consulta |
| La Granja | Mostrar una actividad o servicio por cita | Duración, destinatarios y condiciones previas a consultar |
| Ayllón | Priorizar la primera web de un negocio pequeño | Selección de información esencial y decisiones de alcance |
| Pedraza | Explicar productos o trabajos a través de imágenes | Galería orientativa con detalles y pies de foto útiles |
| Soria | Recibir consultas informadas sobre servicios profesionales | Explicación de alcance y preparación del encargo |

Cada página contiene varias secciones, un ejemplo identificado como orientativo, cuatro puntos de preparación y tres preguntas frecuentes. Precio, identidad y beneficio común pueden repetirse: describen el mismo servicio. El diseño se comparte para mantener una sola marca.

## Qué falta para considerar la parte local lista

El esquema del titular es el origen de la selección, no un estudio de demanda. Estos contenidos aportan decisiones distintas, pero varios podrían ser útiles en otra localidad. **Cambiar de tema no prueba por sí solo que cada URL geográfica esté justificada.**

Para cada una:

1. Comprobar qué necesita el público real de esa localidad mediante búsquedas actuales y conversaciones con negocios. No inventar volúmenes ni atribuir preferencias a toda la población.
2. Revisar fuentes municipales, empresariales u otras fuentes fiables y registrar fecha, enlace y la información utilizada. Añadir solo contexto que ayude a elegir o preparar la web; evitar turismo de relleno.
3. Incorporar un ejemplo local contrastado, una necesidad recogida de primera mano o una comparación útil verificable. Un ejemplo ficticio claramente marcado sirve para explicar, pero no demuestra experiencia local.
4. Verificar si otra página ya resuelve la misma necesidad. Agrupar o replantear cuando sea mejor que sostener dos destinos casi equivalentes.
5. Registrar la decisión y sus evidencias en `localReview` cuando la revisión esté realmente completada. Esto permite incluir esa URL al activar la indexación global; no garantiza indexación ni posiciones.

Actualización del 18 de octubre: se consultaron fuentes municipales y regionales y se añadieron diez guías con fuentes y fichas de preparación descargables. Véase `docs/investigacion-local-realizada.md`. Las evidencias están registradas y las diez aprobaciones siguen desactivadas. No se han realizado entrevistas, mediciones de demanda ni un estudio de competencia; todavía debe contrastarse la utilidad comercial de cada propuesta.

## Recuperación y migración

El entorno volvió a permitir ejecución y lectura del PDF el 18 de octubre. Se verificó que los cambios anteriores seguían en el checkout y se creó una copia completa previa fuera de la raíz pública: `/workspace/scratch/recuperacion-2026-10-18/proyecto-antes-de-diez-paginas-082127.tar.gz`.

La migración retira de la copia de trabajo las 100 salidas de sector/ciudad y los 10 directorios anteriores. Se conservan dos alias generales equivalentes; no se redirigen las localidades antiguas a otras sin relación. Al desplegar, el destino deberá sincronizar también las eliminaciones. No se ha subido el código ni publicado el sitio durante esta recuperación.

Resultado: diez páginas de captación, cuatro generales y dos alias. Los borradores siguen sin indexar y sin un dominio definitivo.

## Verificación de esta versión

- Generación: diez páginas locales, cuatro generales y dos alias; las 110 salidas anteriores se han retirado.
- `node --test tests/site.test.js`: nueve pruebas correctas, cero fallos; incluye comprobación del contenido y localidad de las fichas descargables.
- `git diff --check`: sin errores.
- Navegador: diez tarjetas y diez destinos locales; las catorce páginas de contenido sin desbordamiento horizontal a 320 px; todas las locales comprobadas a 390 px y una muestra a 1440 px.
- Formulario: localidad y propuesta correctas, elección de actividad, borrador de correo con saltos de línea y codificación correcta, entradas desconocidas ignoradas. No se envió correo.
- Enlaces, preguntas desplegables y alias comprobados; las 110 URL retiradas responden 404 en el servidor de desarrollo.
- Cero errores JavaScript y cero peticiones externas en la comprobación de navegador.
- Instrucciones de arranque `start_skill` actualizadas en el borrador del entorno para reflejar las diez páginas. Guardar ese borrador no publica el sitio ni sube código.

El informe de navegador y las capturas están fuera del sitio en `/workspace/scratch/recuperacion-2026-10-18/`. Estas pruebas no comprueban posiciones, indexación real ni una aprobación de Google.
