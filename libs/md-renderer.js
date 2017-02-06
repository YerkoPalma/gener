const marked = require('marked')

// marked
var renderer = new marked.Renderer()

renderer.paragraph = function (text) {
  return '<p class="black-80 fw1 lh-copy georgia f4">' + text + '</p>'
}

renderer.blockquote = function (quote) {
  quote = quote.replace(/class="(.*)"/g, '')
  return '<blockquote class="lh-copy bl bw2 b--black-80 mh0 pl4 mv2 f4 georgia fw4 i tracked-tight black-80">' + quote + '</blockquote>'
}

renderer.heading = function (text, level) {
  switch (level) {
    case 1:
      return '<h1 class="f2 mb2 black-80" id="' + text.toLowerCase().replace(/[^\w]+/g, '-') + '">' + text + '</h1>'
    case 2:
      return '<h2 class="f3 mt2 fw1 silver black-80" id="' + text.toLowerCase().replace(/[^\w]+/g, '-') + '">' + text + '</h2>'
    case 3:
      return '<h3 class="f3 black-80" id="' + text.toLowerCase().replace(/[^\w]+/g, '-') + '">' + text + '</h3>'
    default:
      return '<h' + level + ' class="f3 black-80" id="' + text.toLowerCase().replace(/[^\w]+/g, '-') + '">' + text + '</h' + level + '>'
  }
}

renderer.code = function (code) {
  return '<pre class="courier f5"><code>' + code + '</code></pre>'
}

renderer.hr = function () {
  return '<hr class="light-silver mb4">'
}

renderer.list = function (body, ordered) {
  return ordered ?
          '<ol class="fw1 lh-copy georgia f4">' + body + '</ol>' :
          '<ul class="fw1 lh-copy georgia f4">' + body + '</ul>'
}

renderer.strong = function (text) {
  return '<strong class="b">' + text + '</strong>'
}

renderer.codespan = function (code) {
  return '<code class="courier">' + code + '</code>'
}

renderer.link = function (href, title, text) {
  return '<a href="' + href + '" class="link underline black-80">' + text + '</a>'
}

module.exports = renderer
