#!/usr/bin/env node
'use strict'

var fs = require('fs')
var path = require('path')
const posts = require('../views/data.js')
const Handlebars = require('handlebars')
const layout = require('../config.json').layout
var minify = require('html-minifier').minify

var postsClone = posts
var postArray = []
for (var prop in postsClone) {
  if (prop.charAt(0) === '/' || path.extname(prop) === '.md') {
    delete postsClone[prop]
  } else {
    var defaults = {
      slug: '/' + prop.split('.')[0],
      featuredImage: 'http://placehold.it/350x150',
      featuredImageDescription: ''
    }
    postArray.push(Object.assign(defaults, JSON.parse(postsClone[prop])))
  }
}

var postsLayout = fs.readFileSync(path.resolve(__dirname, '../layouts', layout + '.hbs'), 'utf8')
var template = Handlebars.compile(postsLayout)

fs.writeFile(path.resolve(__dirname, '../views/data-layout.js'), 'module.exports = \'' + minify(template({ posts: postArray }), {
  collapseWhitespace: true,
  removeComments: true
}) + '\'')
