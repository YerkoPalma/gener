var fs = require('fs')
var path = require('path')
var config = require('../defaults/config.json')
const Handlebars = require('handlebars')
var minify = require('html-minifier').minify
var assert = require('assert')

function buildIndex (cb) {
  // assert.equal(typeof cb, 'function')

  console.log(path.resolve(__dirname, '..', 'defaults', '_index.hbs'))
  fs.readFile(path.resolve(__dirname, '..', 'defaults', '_index.hbs'), 'utf8', function (err, data) {
    if (err) throw err
  
    var template = Handlebars.compile(data)
  
    var html = minify(template(config))
    fs.writeFile(
      path.resolve(process.cwd(), 'index.html'),
      html,
      'utf8',
      buildScripts(cb)
    )
  })
}

function buildScripts (cb) {
  // assert.equal(typeof cb, 'function')

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
