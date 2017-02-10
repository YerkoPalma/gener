const layout = require('./data-tags.js')
const domify = require('domify')

module.exports = function (params) {
  console.log('[tags-view]')
  // now postsClone has only the json metadata of each post
  return domify(layout)
}
