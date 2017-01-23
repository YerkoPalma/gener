const marked = require('marked')

// marked
var renderer = new marked.Renderer()

renderer.paragraph = function (text) {
  return '<p class="f5 f3-ns lh-copy measure georgia">' + text + '</p>'
}

renderer.blockquote = function (quote) {
  quote = quote.replace(/class="(.*)"/g, '')
  return '<blockquote class="f6 f5-ns lh-copy measure i pl4 bl bw1 b--gold mb4">' + quote + '</blockquote>'
}
module.exports = renderer
