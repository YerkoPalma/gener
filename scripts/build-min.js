#!/usr/bin/env node
'use strict'

var fs = require("fs")
var path = require('path')
var browserify = require('browserify')
var uglifyify = require('uglifyify')

browserify(path.resolve(__dirname, '../index.js'))
  .transform(uglifyify)
  .bundle()
  .pipe(fs.createWriteStream(path.resolve(process.cwd(), 'bundle.js')))
