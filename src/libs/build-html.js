var fs = require('fs')
var path = require('path')
var config = require('../defaults/config.json')
const Handlebars = require('handlebars')
var minify = require('html-minifier').minify
const assert = require('assert')
const buildPostsData = require('./build-post').buildPostsData

function buildIndex (cb) {
  cb = typeof cb !== 'undefined' ? cb : buildScripts
  assert.equal(typeof cb, 'function')

  fs.readFile(path.resolve(__dirname, '..', 'defaults', '_index.hbs'), 'utf8', function (err, data) {
    if (err) throw err

    var template = Handlebars.compile(data)

    var html = minify(template(config))
    var dest = global.dist
              ? path.resolve(process.cwd(), global.dist, 'index.html')
              : path.resolve(process.cwd(), 'index.html')
    fs.writeFile(
      dest,
      html,
      'utf8',
      cb
    )
  })
}

function buildScripts (cb) {
  cb = cb !== null ? cb : buildPostsData
  assert.equal(typeof cb, 'function', 'Wooow' + JSON.stringify(cb))

  // read scripts
  if (config.scripts && Array.isArray(config.scripts)) {
    var scripts = config.scripts.reduce((acc, script) => {
      return acc + fs.readFileSync(path.resolve(__dirname, '..', 'defaults', script), 'utf8') + '\n'
    }, '')
    fs.writeFile(
      path.resolve(__dirname, '..', 'defaults', '_scripts.js'),
      'module.exports = function () { \n' + scripts + '}',
      'utf8',
      cb
    )
  }
}

exports.buildIndex = buildIndex
exports.buildScripts = buildScripts
