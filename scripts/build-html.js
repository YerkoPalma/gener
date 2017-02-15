#!/usr/bin/env node
'use strict'

var fs = require('fs')
var path = require('path')
var config = require('../config.json')
const Handlebars = require('handlebars')
var minify = require('html-minifier').minify

fs.readFile(path.resolve(__dirname, '../_index.hbs'), 'utf8', function (err, data) {
  if (err) throw err

  var template = Handlebars.compile(data)

  var html = minify(template(config))
  fs.writeFileSync(path.resolve(process.cwd(), 'index.html'), html, 'utf8')
})

// read scripts
if (config.scripts && Array.isArray(config.scripts)) {
  var scripts = config.scripts.reduce((acc, script) => {
    return acc + fs.readFileSync(path.resolve(__dirname, '..', script), 'utf8') + '\n'
  }, '')
  fs.writeFileSync(path.resolve(process.cwd(), '_scripts.js'), 'module.exports = function () { \n' + scripts + '}', 'utf8')
}
