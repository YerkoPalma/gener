const posts = require('./data-posts')
const domify = require('domify')

module.exports = function (params) {
  var meta = require('./meta')
  if (params && params.tag) {
    meta = meta.filter(function (metaPost) {
      return metaPost.tags && metaPost.tags.indexOf(params.tag) > -1
    })
  }
  return domify(posts(meta))
}
