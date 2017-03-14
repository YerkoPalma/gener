const budo = require('budo')
const path = require('path')

var dest = global.dist
            ? path.resolve(process.cwd(), global.dist)
            : path.resolve(process.cwd())
const app = budo(path.resolve(dest, 'bundle.js'), { port: 8000 })

app
  // listen to CSS file changes with some chokidar options
  .watch(dest, { interval: 300, usePolling: true })

module.exports = app
