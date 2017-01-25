const pupa = require('pupa')
function compile (acc, post) {
	return acc + pupa('<article class="mb3 ba b--black-10 bg-white tc pv2 flex flex-row flex-wrap items-center"><div class="w-100 db flex flex-row flex-wrap"><div class="tc dib ml2"><img src="http://tachyons.io/img/logo.jpg" class="br-100 pa1 ba b--black-10 h2 w2" alt="avatar"></div><div class="tl ml2 dib"><p class="mb0 mt2 f6 light-silver v-mid"><a class="link green" href="#">{author.name}</a></p><p class="fw1 mb2 mt0 f6 light-silver v-mid"><a class="light-silver link dim" href="">4 days ago</a> · 2 mins read</p></div></div><a data-route="{slug}" href="#" class="link f5 pa3 silver tl"><h3 class="mt1 mb3 f2 black-80 db w-100 tl">{title}</h3><img class="w-100 mw-100" alt="{featuredImageDescription}" src="{featuredImage}"> Read more...</a></article>', post)
}
module.exports = function (posts) {
	return '<div class="mw9 center ph3-ns"><div class="ph2-ns flex flex-row flex-wrap justify-center"><section class="pa2 fl w-80 w-50-l">' + posts.reduce(compile, '') + '</section>  </div></div> '
}
