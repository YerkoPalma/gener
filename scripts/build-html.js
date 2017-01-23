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
  fs.writeFileSync(path.resolve(__dirname, '../index.html'), html, 'utf8')
})
