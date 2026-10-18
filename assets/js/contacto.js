'use strict';
(function initialiseContact({choices, email, price, months}) {
  const selectedId = new URLSearchParams(window.location.search).get('pagina');
  const selected = Object.hasOwn(choices, selectedId) ? choices[selectedId] : null;
  const form = document.getElementById('contact-form');
  if (selected) {
    document.getElementById('city').value = selected.city;
    document.getElementById('proposal-source').textContent = selected.label;
    document.getElementById('proposal-source').hidden = false;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const business = document.getElementById('business').value.trim();
    const sector = document.getElementById('sector');
    const city = document.getElementById('city').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!business || !city || !message) return;
    const subject = 'Consulta de creación web: ' + business;
    const body = ['Negocio: ' + business, 'Actividad: ' + sector.options[sector.selectedIndex].text, 'Zona: ' + city,
      ...(selected ? ['Propuesta consultada: ' + selected.label] : []), '', message, '',
      `Solicito información del servicio de creación web de ${price} EUR, pago único con IVA incluido, y de la financiación en ${months} meses.`].join('\n');
    const link = document.createElement('a');
    link.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    link.textContent = 'Abrir mi correo para revisar y enviar la consulta';
    link.className = 'button';
    const result = document.getElementById('contact-result');
    result.replaceChildren(document.createTextNode('Consulta preparada. Todavía no se ha enviado. '), link);
    result.hidden = false;
  });
})({"choices":{"riaza":{"city":"Riaza","label":"Riaza · Una web que responde antes de la primera consulta"},"segovia":{"city":"Segovia","label":"Segovia · Ordena tus servicios para que cada persona encuentre el suyo"},"aranda-de-duero":{"city":"Aranda de Duero","label":"Aranda de Duero · Carta, menús y consultas para grupos sin confusiones"},"sepulveda":{"city":"Sepúlveda","label":"Sepúlveda · Ayuda a preparar la visita a tu negocio"},"cuellar":{"city":"Cuéllar","label":"Cuéllar · Convierte tus publicaciones en una presentación estable del negocio"},"el-espinar":{"city":"El Espinar","label":"El Espinar · Una web que aclare dónde trabajas y qué necesitas para preparar un presupuesto"},"la-granja":{"city":"La Granja","label":"La Granja · Presenta tus actividades o servicios por cita con la información que necesita quien pregunta"},"ayllon":{"city":"Ayllón","label":"Ayllón · Empieza con una web que responda a las preguntas esenciales de tu negocio"},"pedraza":{"city":"Pedraza","label":"Pedraza · Convierte tus fotografías en una presentación útil de lo que ofreces"},"soria":{"city":"Soria","label":"Soria · Explica el alcance de tu servicio profesional antes de recibir el encargo"}},"email":"dasmesantoto@gmail.com","price":"99.99","months":3});
