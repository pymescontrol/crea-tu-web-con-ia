const {test, after} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const vm = require('node:vm');
const source = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'web-localidades-test-'));
after(() => fs.rmSync(temp, {recursive: true, force: true}));
fs.cpSync(source, temp, {recursive: true, filter: file => !['.git', 'node_modules', 'scratch'].includes(path.basename(file))});
const read = file => fs.readFileSync(path.join(temp, file), 'utf8');
const write = (file, contents) => fs.writeFileSync(path.join(temp, file), contents);
const files = () => fs.readdirSync(temp, {recursive: true}).filter(file => file.endsWith('.html'));
const canonical = html => html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
const sitemapUrls = () => [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const staging = {baseUrl: '', indexingEnabled: false};
const production = {baseUrl: 'https://example.com/prueba/', indexingEnabled: true};
const localSources = ['content/localidades-centro.json', 'content/localidades-entorno.json'];
const ids = ['riaza', 'segovia', 'aranda-de-duero', 'sepulveda', 'cuellar', 'el-espinar', 'la-granja', 'ayllon', 'pedraza', 'soria'];
const landingFiles = ids.map(id => `localidades/creacion-web-${id}.html`);
const aliases = ['consultoria-vip.html', 'plantilla-nicho.html'];
function build(config, command = 'build-site.js') {
  write('site.config.json', JSON.stringify(config));
  return spawnSync(process.execPath, [command], {cwd: temp, encoding: 'utf8'});
}
function expectBuild(config, command) {
  const result = build(config, command);
  assert.equal(result.status, 0, result.stderr);
}

// These checks cover site behavior and publication safeguards; they do not certify Google's policies.
test('build replaces the old catalogue with ten reachable local pages', () => {
  const {retiredFiles} = require(path.join(temp, 'lib/retiradas'));
  assert.equal(retiredFiles.length, 110);
  assert.equal(new Set(retiredFiles).size, 110);
  assert.equal(retiredFiles.filter(file => file.startsWith('nichos-generados/')).length, 100);
  assert.equal(retiredFiles.filter(file => file.startsWith('sectores/')).length, 10);
  for (const file of retiredFiles) {
    fs.mkdirSync(path.dirname(path.join(temp, file)), {recursive: true});
    write(file, '<p>Retired generated output</p>');
  }
  expectBuild(staging);
  for (const file of retiredFiles) assert.equal(fs.existsSync(path.join(temp, file)), false, file);
  assert.deepEqual(files().filter(file => file.startsWith('localidades/')).sort(), [...landingFiles].sort());
  assert.equal(files().length, 16);
  const titles = [];
  for (const [index, file] of landingFiles.entries()) {
    const html = read(file);
    assert.doesNotMatch(html, /http-equiv="refresh"/);
    assert.match(html, /data-editorial="specific"/);
    assert.ok(html.includes(`contacto.html?pagina=${ids[index]}`), file);
    assert.ok(read('index.html').includes(`href="${file}"`), file);
    assert.match(html, /Ejemplo orientativo/);
    titles.push(html.match(/<title>([^<]+)<\/title>/)?.[1]);
  }
  assert.equal(new Set(titles).size, 10);
  assert.equal(read('docs/inventario-captacion.csv').trim().split('\n').length, 11);
  assert.match(read('consultoria-vip.html'), /url=servicio.html/);
  assert.match(read('plantilla-nicho.html'), /url=index.html#localidades/);
});

test('retirement only removes named former outputs and preserves other files', () => {
  const {retiredFiles, removeRetiredFiles} = require(path.join(temp, 'lib/retiradas'));
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'web-retirement-test-'));
  try {
    const preserved = ['nichos-generados/pagina-personal.html', 'sectores/negocio-propio.html', 'sectores/notas.txt'];
    for (const file of [...retiredFiles, ...preserved]) {
      const full = path.join(fixture, file);
      fs.mkdirSync(path.dirname(full), {recursive: true});
      fs.writeFileSync(full, file);
    }
    assert.deepEqual(removeRetiredFiles(fixture).sort(), [...retiredFiles].sort());
    for (const file of preserved) assert.equal(fs.readFileSync(path.join(fixture, file), 'utf8'), file);
    assert.deepEqual(removeRetiredFiles(fixture), []);
  } finally {
    fs.rmSync(fixture, {recursive: true, force: true});
  }
});

test('each local page provides a usable preparation download and its cited sources', () => {
  const worksheets = new Set();
  for (const [index, file] of landingFiles.entries()) {
    const html = read(file);
    const download = html.match(/href="data:text\/plain;charset=utf-8,([^"]+)" download="([^"]+)"/);
    assert.ok(download, `${file}: missing download`);
    assert.equal(download[2], `preparar-web-${ids[index]}.txt`);
    const content = decodeURIComponent(download[1].replaceAll('&amp;', '&'));
    assert.ok(content.includes('Mi respuesta:'), file);
    assert.ok(content.includes('FUENTES DE CONTEXTO LOCAL'), file);
    assert.doesNotMatch(content, /\[object Object\]|undefined/);
    const heading = html.match(/<h1>([^<]+)<\/h1>/)?.[1];
    assert.ok(heading, file);
    const firstLine = content.split('\n')[0];
    const city = firstLine.slice(firstLine.lastIndexOf(' en ') + 4);
    assert.ok(heading.includes(city), `${file}: wrong locality in download`);
    for (const url of content.match(/https:\/\/\S+/g) || []) {
      assert.ok(html.includes(`href="${url}"`), `${file}: source missing from page`);
    }
    worksheets.add(content);
  }
  assert.equal(worksheets.size, 10);
});

test('prelaunch has noindex and all links, assets, fragments and scripts resolve', () => {
  assert.deepEqual(sitemapUrls(), []);
  assert.doesNotMatch(read('robots.txt'), /Disallow:\s*\//);
  for (const file of files()) {
    const html = read(file);
    assert.match(html, /name="robots" content="noindex, follow"/, file);
    assert.equal(canonical(html), undefined, file);
    assert.doesNotMatch(html, /pymescontrol\.(com|github\.io)|\[NICHO\]|\[CIUDAD\]|Mentoría|2\.000|2,000|2000/, file);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, file);
    for (const [, rawHref] of html.matchAll(/(?:href|src)="([^"]*)"/gi)) {
      const href = rawHref.replaceAll('&amp;', '&');
      if (/^(?:[a-z]+:|\/\/)/i.test(href)) continue;
      const [route, fragment] = href.split('#');
      const pathname = route.split('?')[0];
      const target = pathname ? path.resolve(temp, path.dirname(file), decodeURIComponent(pathname)) : path.join(temp, file);
      assert.ok(target.startsWith(temp + path.sep), `${file}: escapes site`);
      assert.ok(fs.existsSync(target), `${file}: missing ${href}`);
      if (fragment) assert.ok(fs.readFileSync(target, 'utf8').includes(`id="${fragment}"`), `${file}: missing #${fragment}`);
    }
    for (const [, attrs, script] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (/application\/ld\+json/.test(attrs)) JSON.parse(script);
      else new vm.Script(script, {filename: file});
    }
  }
  new vm.Script(read('assets/js/contacto.js'));
});

test('enabling the site does not automatically index unreviewed local pages', () => {
  expectBuild(production);
  const urls = sitemapUrls();
  assert.equal(urls.length, 3);
  assert.deepEqual(urls, [production.baseUrl, production.baseUrl + 'servicio.html', production.baseUrl + 'metodologia.html']);
  for (const url of urls) {
    const file = url.slice(production.baseUrl.length) || 'index.html';
    assert.equal(canonical(read(file)), url);
    assert.match(read(file), /name="robots" content="index, follow"/);
  }
  for (const file of [...landingFiles, 'contacto.html', ...aliases]) {
    assert.match(read(file), /name="robots" content="noindex, follow"/, file);
  }
  for (const file of landingFiles) assert.equal(canonical(read(file)), production.baseUrl + file);
  assert.match(read('robots.txt'), /Sitemap: https:\/\/example.com\/prueba\/sitemap.xml/);
});

test('local indexing requires explicit editorial approval and recorded evidence', () => {
  const originals = new Map(localSources.map(file => [file, read(file)]));
  const setReview = review => {
    for (const [file, original] of originals) {
      write(file, JSON.stringify(JSON.parse(original).map(page => ({...page, localReview: review}))));
    }
  };
  try {
    for (const review of [{approved: true, evidence: []}, {approved: true, evidence: [' ']}, {approved: false, evidence: ['Internal test evidence']}]) {
      setReview(review);
      expectBuild(production);
      assert.equal(sitemapUrls().length, 3);
      for (const file of landingFiles) assert.match(read(file), /name="robots" content="noindex, follow"/, file);
    }
    setReview({approved: true, evidence: ['Internal test fixture: explicit editorial review; not an actual business claim.']});
    expectBuild(production);
    const urls = sitemapUrls();
    assert.equal(urls.length, 13);
    assert.equal(new Set(urls).size, 13);
    for (const file of landingFiles) {
      assert.ok(urls.includes(production.baseUrl + file), file);
      assert.equal(canonical(read(file)), production.baseUrl + file);
      assert.match(read(file), /name="robots" content="index, follow"/, file);
    }
    for (const file of ['contacto.html', ...aliases]) assert.match(read(file), /name="robots" content="noindex, follow"/, file);
    expectBuild(staging);
    assert.deepEqual(sitemapUrls(), []);
    for (const file of landingFiles) assert.match(read(file), /name="robots" content="noindex, follow"/, file);
  } finally {
    for (const [file, original] of originals) write(file, original);
    expectBuild(production);
  }
});

test('all generator entry points produce identical output repeatedly', () => {
  const generated = [...files(), 'assets/js/contacto.js', 'sitemap.xml', 'robots.txt', 'docs/inventario-captacion.csv'];
  const before = new Map(generated.map(file => [file, read(file)]));
  for (const command of ['build-site.js', 'generate-nichos.js', 'generate-sitemap.js']) {
    expectBuild(production, command);
    assert.deepEqual(files().sort(), generated.filter(file => file.endsWith('.html')).sort());
    for (const [file, content] of before) assert.equal(read(file), content, `${command}: changed ${file}`);
  }
});

test('invalid publishing configuration fails before changing generated output', () => {
  const before = new Map([...files(), 'sitemap.xml', 'robots.txt'].map(file => [file, read(file)]));
  for (const invalid of [
    {baseUrl: '', indexingEnabled: true},
    {baseUrl: 'http://example.com/', indexingEnabled: true},
    {baseUrl: 'https://example.com/?x=1', indexingEnabled: true},
    {baseUrl: 'https://user:password@example.com/', indexingEnabled: true},
    {baseUrl: '', indexingEnabled: 'false'}
  ]) {
    assert.notEqual(build(invalid).status, 0);
    for (const [file, content] of before) assert.equal(read(file), content, file);
  }
});

test('confirmed offer is consistent without invented financing or SEO guarantees', () => {
  const offer = JSON.parse(read('content/servicio.json'));
  assert.equal(offer.price, '99.99');
  assert.equal(offer.billing, 'one_time');
  assert.equal(offer.taxIncluded, true);
  assert.equal(offer.financingMonths, 3);
  for (const file of files().filter(file => !aliases.includes(file))) {
    const html = read(file);
    assert.match(html, /99,99/, file);
    assert.match(html, /Pago único|pago único/, file);
    assert.match(html, /IVA incluido/, file);
    assert.match(html, /Financiación disponible en 3 meses/, file);
    assert.doesNotMatch(html, /Estamos validando|conexión necesaria|flujo de edición previsto|\bTAE\b|\bTIN\b|sin intereses|33,33|posicionamiento garantizado|primera posición garantizada|alojamiento gratuito de por vida|indestructible/i, file);
  }
  assert.match(read('servicio.html'), /desde el chat de ChatGPT en tu móvil/);
});
