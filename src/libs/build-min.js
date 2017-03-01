var fs = require('fs')
var path = require('path')
var browserify = require('browserify')
var uglifyify = require('uglifyify')

function buildBundle () {
  var dest = global.dist
              ? path.resolve(process.cwd(), global.dist, 'bundle.js')
              : path.resolve(process.cwd(), 'bundle.js')
  browserify(path.resolve(__dirname, '../index.js'))
    .transform(uglifyify)
    .bundle()
    .pipe(fs.createWriteStream(dest))
}

exports.buildBundle = buildBundle
