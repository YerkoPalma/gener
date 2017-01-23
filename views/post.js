const posts = require('./data.js')
const domify = require('domify')

module.exports = function (params) {
  const post = posts['/' + params.post]
  return domify(post)
}
