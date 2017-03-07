var fs = require('fs')
var path = require('path')
const layout = require('../defaults/config.json').layout
var minify = require('html-minifier').minify
const buildBundle = require('./build-min').buildBundle
const assert = require('assert')

function buildPostsViews (cb) {
  cb = typeof cb !== 'undefined' ? cb : buildPostsMeta
  assert.equal(typeof cb, 'function')

  var postsLayout = fs.readFileSync(path.resolve(__dirname, '../defaults/layouts', layout + '.hbs'), 'utf8')
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
  fs.writeFile(
    path.resolve(__dirname, '../views/data-posts.js'),
    fn,
    'utf8',
    cb
  )
}

function buildPostsMeta (cb) {
  cb = typeof cb !== 'undefined' ? cb : buildBundle
  assert.equal(typeof cb, 'function')
  var postArray = []

  const posts = require('../views/data.js')
  var postsClone = posts

  for (var prop in postsClone) {
    if (path.extname(prop) === '.json') {
      var defaults = {
        slug: '/' + prop.split('.')[0],
        abstract: ''
      }
      postArray.push(Object.assign(defaults, JSON.parse(postsClone[prop])))
    }
  }

  var metaPosts = 'module.exports = ' + JSON.stringify(postArray)

  fs.writeFile(
    path.resolve(__dirname, '../views/meta.js'),
    metaPosts,
    'utf8',
    cb
  )
}

exports.buildPostsViews = buildPostsViews
exports.buildPostsMeta = buildPostsMeta
