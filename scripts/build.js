#!/usr/bin/env node
'use strict'

var fs = require('fs')
var path = require('path')
const posts = require(path.resolve(process.cwd(), 'views/data.js'))
const layout = require(path.resolve(process.cwd(), 'config.json')).layout
var minify = require('html-minifier').minify

var postsClone = posts
var postArray = []
for (var prop in postsClone) {
  if (prop.charAt(0) === '/' || path.extname(prop) === '.md') {
    delete postsClone[prop]
  } else {
    var defaults = {
      slug: '/' + prop.split('.')[0],
      featuredImage: 'http://placehold.it/550x150',
      featuredImageDescription: ''
    }
    postArray.push(Object.assign(defaults, JSON.parse(postsClone[prop])))
  }
}

var postsLayout = fs.readFileSync(path.resolve(__dirname, '../layouts', layout + '.hbs'), 'utf8')
var from = postsLayout.indexOf('{{#each posts}}') + 15
var to = postsLayout.lastIndexOf('{{/each}}')
var postLayout = postsLayout.substring(from, to).replace(/{{/g, '{').replace(/}}/g, '}')

var start = minify(postsLayout.substring(0, from - 15), { collapseWhitespace: true, includeAutoGeneratedTags: false })
var end = postsLayout.substring(to + 9).trim().replace(/\n/g, '')

postLayout = postLayout.replace(/{#each tags}/g, '\' + pupa(\'')
postLayout = postLayout.replace(/{\/each}/g, '\', post.tags) + \'')

postLayout = minify(postLayout, { collapseWhitespace: true })

var fn = 'const pupa = require(\'@yerkopalma/pupa\')\n'
fn += 'function compile (acc, post) {\n'
fn += '\treturn acc + pupa(\'' + postLayout + '\', post)\n'
fn += '}\n'
fn += 'module.exports = function (posts) {\n'
fn += '\treturn \'' + start + '\' + posts.reduce(compile, \'\') + \'' + end + ' \'\n}\n'
var metaPosts = 'module.exports = ' + JSON.stringify(postArray)

fs.writeFile(path.resolve(process.cwd(), 'views/meta.js'), metaPosts)
fs.writeFile(path.resolve(process.cwd(), 'views/data-posts.js'), fn)

// finally copy index.js

if (path.resolve(__dirname, '../index.js') !== path.resolve(process.cwd(), 'index.js'))
fs.createReadStream(path.resolve(__dirname, '../index.js'))
  .pipe(fs.createWriteStream(path.resolve(process.cwd(), 'index.js')))
