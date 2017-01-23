const pupa = require('pupa')
function compile (acc, post) {
  return acc + pupa('<article class="bt bb b--black-10"><a data-route="{slug}" class="db pv4 ph3 ph0-l no-underline black dim" href="#"><div class="flex flex-column flex-row-ns"><div class="pr3-ns mb4 mb0-ns w-100 w-40-ns"><img src="{featuredImage}" class="db" alt="{featuredImageDescription}"></div><div class="w-100 w-60-ns pl3-ns"><h1 class="f3 fw1 baskerville mt0 lh-title">{title}</h1><p class="f6 f5-l lh-copy">{abstract}</p><p class="f6 lh-copy mv0">By {author.name}</p></div></div></a></article>', post)
}
module.exports = function (posts) {
  return '<section class="mw7 center avenir"><h2 class="baskerville fw1 ph3 ph0-l">Posts</h2><a href="#" data-route="/tags">tags</a>' + posts.reduce(compile, '') + '</section> '
}
