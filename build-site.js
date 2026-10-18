const {readConfig} = require('./lib/site');
function build() {
  const config=readConfig();
  require('./generate-pages')(config);
  require('./generate-nichos')(config);
  require('./generate-sitemap')(config);
}
module.exports=build;
if(require.main===module) build();
