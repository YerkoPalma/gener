const budo = require('budo')
const path = require('path')

var bundle = global.dist
          ? path.resolve(process.cwd(), global.dist, 'bundle.js')
          : path.resolve(process.cwd(), 'bundle.js')

var indexPath = global.dist
          ? path.resolve(process.cwd(), global.dist)
          : path.resolve(process.cwd())
const app = budo(path.resolve(__dirname, '..', 'index.js'), {
  port: process.env.PORT || 8080,
  host: process.env.IP || '0.0.0.0',
  serve: bundle,
  dir: indexPath
})
var sourcePath = global.source
          ? path.resolve(process.cwd(), global.source)
          : path.resolve(process.cwd())
app
  // watch source files
  .watch(sourcePath, { interval: 300, usePolling: true })
  .on('watch', function (type, file) {
    // tell LiveReload to inject some CSS
    console.log(file + ' modified...')
  })
  .on('connect', function (event) {
    console.log('Server running on ' + event.uri)
  })
module.exports = app
