const marked = require('marked')
const classes = require('../defaults/config.json').classes

// marked
var renderer = new marked.Renderer()

renderer.paragraph = function (text) {
  var css = classes.p
  return '<p class="' + css + '">' + text + '</p>'
}

renderer.blockquote = function (quote) {
  quote = quote.replace(/class="(.*)"/g, '')
  var css = classes.blockquote
  return '<blockquote class="' + css + '">' + quote + '</blockquote>'
}

renderer.heading = function (text, level) {
  var css
  switch (level) {
    case 1:
      css = classes.h1
      return '<h1 class="' + css + '" id="' + text.toLowerCase().replace(/[^\w]+/g, '-') + '">' + text + '</h1>'
    case 2:
      css = classes.h2
      return '<h2 class="' + css + '" id="' + text.toLowerCase().replace(/[^\w]+/g, '-') + '">' + text + '</h2>'
    case 3:
      css = classes.h3
      return '<h3 class="' + css + '" id="' + text.toLowerCase().replace(/[^\w]+/g, '-') + '">' + text + '</h3>'
    default:
      css = classes['h' + level]
      return '<h' + level + ' class="' + css + '" id="' + text.toLowerCase().replace(/[^\w]+/g, '-') + '">' + text + '</h' + level + '>'
  }
}

renderer.code = function (code) {
  var css = classes.code
  return '<pre class="' + css + '"><code>' + code + '</code></pre>'
}

renderer.hr = function () {
  var css = classes.hr
  return '<hr class="' + css + '">'
}

renderer.list = function (body, ordered) {
  var css = ordered ? classes.ol : classes.ul
  return ordered
          ? '<ol class="' + css + '">' + body + '</ol>'
          : '<ul class="' + css + '">' + body + '</ul>'
}

renderer.strong = function (text) {
  var css = classes.strong
  return '<strong class="' + css + '">' + text + '</strong>'
}

renderer.codespan = function (code) {
  var css = classes.codespan
  return '<code class="' + css + '">' + code + '</code>'
}

renderer.link = function (href, title, text) {
  var css = classes.link
  return '<a href="' + href + '" class="' + css + '">' + text + '</a>'
}

module.exports = renderer
