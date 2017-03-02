var fs = require('fs')
var path = require('path')
const assert = require('assert')
const buildIndex = require('./build-html').buildIndex

function buildLayout (layout, cb) {
  assert.equal(typeof layout, 'string')

  var src = global.source
              ? path.resolve(process.cwd(), global.source, 'layouts')
              : path.resolve(process.cwd(), 'layouts')
  if (fs.existsSync(src)) {
    fs.readdir(src, function (err, files) {
      if (err) {
        throw err
      }
      files = files.filter(function (file) {
        return file.indexOf(layout) > -1
      })
      files.forEach(function (file) {
        fs.createReadStream(path.resolve(src, file))
          .pipe(fs.createWriteStream(path.resolve(__dirname, '..', 'defaults', 'layouts', file)))
      })
      if (cb && typeof cb === 'function') cb()
    })
  }
}

function copyScripts (scripts) {
  assert.ok(Array.isArray(scripts))

  var src = global.source
            ? path.resolve(process.cwd(), global.source)
            : path.resolve(process.cwd())
  scripts.forEach((script) => {
    // if there are script files present, copy to default folder
    if (fs.existsSync(path.resolve(src, script))) {
      fs.createReadStream(path.resolve(src, script))
        .pipe(fs.createWriteStream(path.resolve(__dirname, '..', 'defaults', script)))
    }
  })
}

function buildConfig () {
  // create config file
  // in this case, a merge of options
  var userConfig = {}
  var defaultConfig = require('../defaults/config.json')
  var src = global.source
              ? path.resolve(process.cwd(), global.source, 'config.json')
              : path.resolve(process.cwd(), 'config.json')
  var layoutSrc = global.source
              ? path.resolve(process.cwd(), global.source, 'layouts')
              : path.resolve(process.cwd(), 'layouts')
  if (fs.existsSync(src)) {
    fs.readFile(src, 'utf8', function (err, data) {
      if (err) throw err
      userConfig = JSON.parse(data)
      // copy layout files if they are present
      if (userConfig.layout && fs.existsSync(layoutSrc)) {
        buildLayout(userConfig.layout)
      }
      var config = Object.assign(defaultConfig, userConfig)
      // read scripts
      if (config.scripts && Array.isArray(config.scripts)) {
        copyScripts(config.scripts)
      }
      fs.writeFile(
        path.resolve(__dirname, '../defaults/config.json'),
        JSON.stringify(config, null, 2),
        'utf8',
        buildIndex
      )
    })
  } else {
    buildIndex()
  }
}

exports.buildConfig = buildConfig
exports.buildLayout = buildLayout
exports.copyScripts = copyScripts
