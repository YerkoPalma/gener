const budo = require('budo')
const path = require('path')

var bundle = global.dist
          ? path.resolve(process.cwd(), global.dist, 'bundle.js')
          : path.resolve(process.cwd(), 'bundle.js')

var indexPath = global.dist
          ? path.resolve(process.cwd(), global.dist)
          : path.resolve(process.cwd())
const app = budo(path.resolve(__dirname, '..', 'index.js'), {
  port: 8000,
  serve: bundle,
  dir: indexPath
})
var sourcePath = global.source
          ? path.resolve(process.cwd(), global.source)
          : path.resolve(process.cwd())
app
  // watch source files
  .watch(sourcePath, { interval: 300, usePolling: true })
module.exports = app
