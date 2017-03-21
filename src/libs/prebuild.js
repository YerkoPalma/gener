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

function copyScripts (scripts, cb) {
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
  if (cb && typeof cb === 'function') cb()
}

function copyMedia (cb) {
  var mediaFolder = global.source
            ? path.resolve(process.cwd(), global.source)
            : path.resolve(process.cwd())
  mediaFolder = path.resolve(mediaFolder, 'posts', 'media')

  if (fs.existsSync(mediaFolder)) {
    var destiny = global.dist
              ? path.resolve(process.cwd(), global.dist, 'src', 'media')
              : path.resolve(process.cwd(), 'src', 'media')
    copy(mediaFolder, destiny)
  }
  if (cb && typeof cb === 'function') cb()
}

// Synchronously copy a file or folder (recursively)
function copy (from, to) {
  if (!fs.existsSync(from)) {
    console.log('Can\'t copy from ' + from + '\nPath doesn\'t exists')
    return
  }
  const isDirectory = fs.statSync(from).isDirectory()
  if (isDirectory && !fs.existsSync(to)) {
    fs.mkdirSync(to)
  }
  if (isDirectory) {
    const files = fs.readdirSync(from)
    files.map((file) => {
      var filePath = path.resolve(from, file)
      copy(filePath, path.resolve(to, file))
    })
  } else {
    const content = fs.readFileSync(from)
    fs.writeFileSync(to, content)
  }
}

function buildConfig (cb) {
  cb = typeof cb !== 'undefined' ? cb : buildIndex
  assert.equal(typeof cb, 'function')
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
      // same for styles
      if (config.styles && Array.isArray(config.styles)) {
        copyScripts(config.styles)
      }
      // copy media
      if (fs.existsSync(path.resolve(layoutSrc, '..', 'posts', 'media'))) {
        copyMedia()
      }
      fs.writeFile(
        path.resolve(__dirname, '../defaults/config.json'),
        JSON.stringify(config, null, 2),
        'utf8',
        cb
      )
    })
  } else {
    cb()
  }
}

exports.buildConfig = buildConfig
exports.buildLayout = buildLayout
exports.copyScripts = copyScripts
exports.copyMedia = copyMedia
