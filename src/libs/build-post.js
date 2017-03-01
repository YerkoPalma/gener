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

function buildPostsData () {
  console.log('building post-data...')
  // 0 Declare variables
  var viewFolder = path.resolve(__dirname, '../views')
  var datajs = path.resolve(__dirname, '../views/data.js')
  var postLayoutFile = path.resolve(__dirname, '../defaults/layouts', layout + '-post.hbs')
  var postsFolder = path.resolve(process.cwd(), 'posts')
  var postFile = function (filename) { return path.resolve(postsFolder, filename) }
  var stringifyProp = function (key, value) { return '\'' + key + '\': \'' + value + '\'' }
  // 1 Create data.js
  if (!fs.existsSync(viewFolder)) fs.mkdirSync(viewFolder)
  fs.writeFileSync(datajs, '', 'utf8')
  console.log('created ' + datajs)
  // 2 Read layouts
  const postLayout = fs.readFileSync(postLayoutFile, 'utf8')
  console.log('readed ' + postLayoutFile)
  Handlebars.registerHelper('formatDate', formatDate)
  var template = Handlebars.compile(postLayout)
  // 3 Read posts
  console.log('reading ' + postsFolder)
  fs.readdir(postsFolder, function (err, posts) {
    if (err) throw err

    console.log('found ' + posts)
    // 4 Create streams
    var ws = fs.createWriteStream(datajs, { flags: 'r+' })
    ws.write('module.exports = {\n')
    var obj = {}
    var postsPaths = []
    posts.map(function (post, i) {
      console.log('creating readstream on ' + postFile(post))
      var rs = fs.createReadStream(postFile(post), 'utf8')
      var postContent = ''
      rs.on('data', function (chunk) {
        postContent += chunk
      })
      rs.on('end', function () {
        console.log('finished reading from ' + postFile(post))
        var tmpPath = '/' + post.split('.')[0]
        if (postsPaths.indexOf(tmpPath) === -1) postsPaths.push(tmpPath)

        if (path.extname(post) === '.json') {
          obj[post] = JSON.stringify(JSON.parse(postContent))
          ws.write(stringifyProp(post, JSON.stringify(JSON.parse(postContent))))
        }
        if (path.extname(post) === '.md') {
          obj[post] = marked(postContent, { renderer: renderer })
          ws.write(stringifyProp(post, marked(postContent, { renderer: renderer })))
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
          ws.write('\n}')
          // callback
          buildPostsViews()
        } else {
          ws.write(',\n')
        }
      })
    })
  })
}

exports.buildPostsData = buildPostsData
