var fs = require('fs')
var path = require('path')
var browserify = require('browserify')
var uglifyify = require('uglifyify')

function buildBundle (cb) {
  var dest = global.dist
              ? path.resolve(process.cwd(), global.dist, 'bundle.js')
              : path.resolve(process.cwd(), 'bundle.js')
  var rs = browserify(path.resolve(__dirname, '../index.js'))
    .transform(uglifyify)
    .bundle()
  // split the readeable stream to call the end event handler with a callback
  // just for testing
  if (cb && typeof cb === 'function') {
    rs.on('end', cb)
  }
  // dev server called if there is the dev flag present
  if (global.dev) {
    const app = require('./server')
    app.live()
  }
  rs.pipe(fs.createWriteStream(dest))
}

exports.buildBundle = buildBundle
