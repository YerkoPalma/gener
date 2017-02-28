var fs = require('fs')
var path = require('path')
var browserify = require('browserify')
var uglifyify = require('uglifyify')

function buildBundle () {
  browserify(path.resolve(__dirname, '../index.js'))
    .transform(uglifyify)
    .bundle()
    .pipe(fs.createWriteStream(path.resolve(process.cwd(), 'bundle.js')))
}

exports.buildBundle = buildBundle
