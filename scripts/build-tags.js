#!/usr/bin/env node
'use strict'

var fs = require('fs')
var path = require('path')
const posts = require('../views/data.js')
const Handlebars = require('handlebars')
const layout = require('../config.json').layout
var minify = require('html-minifier').minify

var tags = {}
for (var post in posts) {
  if (path.extname(post) === '.json') {
    var postTags = JSON.parse(posts[post]).tags
    if (postTags) {
      postTags.forEach(function (postTag) {
        if (!tags[postTag]) tags[postTag] = []
        tags[postTag].push(post)
      })
    }
  }
}

var tagsArr = Object.keys(tags)
var templateTags = tagsArr.map(function (tag) {
  return { name: tag, count: tags[tag].length }
})

var tagsLayout = fs.readFileSync(path.resolve(__dirname, '../layouts', layout + '-tags.hbs'), 'utf8')
var template = Handlebars.compile(tagsLayout)

fs.writeFile(path.resolve(__dirname, '../views/data-tags.js'), 'module.exports = \'' + minify(template({ tags: templateTags }), {
  collapseWhitespace: true,
  removeComments: true
}) + '\'')
