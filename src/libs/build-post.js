#!/usr/bin/env node
'use strict'

var fs = require('fs')
var path = require('path')
var marked = require('marked')
const Handlebars = require('handlebars')
const renderer = require('../libs/md-renderer.js')
const layout = require('../defaults/config.json').layout
const formatDate = require('../libs/helpers').formatDate
var minify = require('html-minifier').minify
const buildPostsViews = require('./build').buildPostsViews
const assert = require('assert')

function buildPostsData (cb) {
  cb = cb !== null ? cb : buildPostsViews
  assert.equal(typeof cb, 'function')
  // 0 Declare variables
  var viewFolder = path.resolve(__dirname, '../views')
  var datajs = path.resolve(__dirname, '../views/data.js')
  var postLayoutFile = path.resolve(__dirname, '../defaults/layouts', layout + '-post.hbs')
  var postsFolder = global.source
                    ? path.resolve(process.cwd(), global.source, 'posts')
                    : path.resolve(process.cwd(), 'posts')
  var postFile = function (filename) { return path.resolve(postsFolder, filename) }
  var stringifyProp = function (key, value) { return '\'' + key + '\': \'' + value + '\'' }
  // 1 Create data.js
  if (!fs.existsSync(viewFolder)) fs.mkdirSync(viewFolder)
  fs.writeFileSync(datajs, '', 'utf8')
  // 2 Read layouts
  const postLayout = fs.readFileSync(postLayoutFile, 'utf8')
  Handlebars.registerHelper('formatDate', formatDate)
  var template = Handlebars.compile(postLayout)
  // 3 Read posts
  fs.readdir(postsFolder, function (err, posts) {
    if (err) throw err

    // 4 Create streams
    var ws = fs.createWriteStream(datajs, { flags: 'r+' })
    ws.write('module.exports = {\n')
    var obj = {}
    var postsPaths = []
    posts.map(function (post, i) {
      var rs = fs.createReadStream(postFile(post), 'utf8')
      var postContent = ''
      rs.on('data', function (chunk) {
        postContent += chunk
      })
      rs.on('end', function () {
        var tmpPath = '/' + post.split('.')[0]
        if (postsPaths.indexOf(tmpPath) === -1) postsPaths.push(tmpPath)

        if (path.extname(post) === '.json') {
          obj[post] = JSON.stringify(JSON.parse(postContent))
          ws.write(stringifyProp(post, JSON.stringify(JSON.parse(postContent))))
        }
        if (path.extname(post) === '.md') {
          obj[post] = marked(postContent, { renderer: renderer })
          var tmpContent = marked(postContent, { renderer: renderer })
          tmpContent = tmpContent.replace(/\n/g, '')
          ws.write(stringifyProp(post, tmpContent))
        }
        if (Object.keys(obj).length === posts.length) {
          postsPaths.map(function (postPath, i) {
            var jsonData = obj[postPath.substring(1) + '.json']
            var mdData = obj[postPath.substring(1) + '.md']
            // final content to be rendered
            var content = minify(template(Object.assign({content: mdData}, JSON.parse(jsonData))), {
              collapseWhitespace: true,
              removeComments: true
            })
            ws.write(',\n' + stringifyProp(postPath, content))
          })
          ws.write('\n}', cb)
          // callback
          // cb()
        } else {
          ws.write(',\n')
        }
      })
    })
  })
}

exports.buildPostsData = buildPostsData
