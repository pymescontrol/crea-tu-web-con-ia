const fs = require('node:fs');
const path = require('node:path');

// Frozen list of the previous generated catalogue. It must not depend on the new sectors.
const retiredSectors = [
  'reformas-integrales', 'clinicas-dentales', 'placas-solares', 'arquitectos',
  'abogados-de-herencias', 'clinicas-de-estetica', 'asesorias-fiscales',
  'inmobiliarias-de-lujo', 'mudanzas-nacionales', 'instaladores-de-climatizacion'
];
const retiredCities = [
  'madrid', 'barcelona', 'valencia', 'sevilla', 'zaragoza', 'malaga',
  'murcia', 'palma-de-mallorca', 'bilbao', 'alicante'
];
const retiredFiles = Object.freeze([
  ...retiredSectors.flatMap(sector => retiredCities.map(city => `nichos-generados/${sector}-${city}.html`)),
  ...retiredSectors.map(sector => `sectores/${sector}.html`)
]);

function removeRetiredFiles(root) {
  const removed = [];
  for (const dir of ['nichos-generados', 'sectores']) {
    const directory = path.join(root, dir);
    if (fs.existsSync(directory) && !fs.lstatSync(directory).isDirectory()) {
      throw new Error(`No se retiran páginas a través de un enlace o ruta no válida: ${dir}.`);
    }
  }
  for (const relative of retiredFiles) {
    const file = path.join(root, relative);
    let stat;
    try { stat = fs.lstatSync(file); } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    if (!stat.isFile() && !stat.isSymbolicLink()) throw new Error(`La salida retirada no es un archivo: ${relative}.`);
    fs.unlinkSync(file);
    removed.push(relative);
  }
  return removed;
}

module.exports = {retiredFiles, removeRetiredFiles};
