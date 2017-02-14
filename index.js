const SingletonRouter = require('singleton-router')
const PostsView = require('./views/posts')
const PostView = require('./views/post')

const router = SingletonRouter()
var event = new Event('rendered')

router.addRoute('/', PostsView, function () { window.dispatchEvent(event)})
router.addRoute('/:post', PostView, function () { window.dispatchEvent(event)})
router.setRoot('/')
router.start('#app')

window.addEventListener('rendered', function (e) {
  //rendered
  require('./_scripts.js')()
}, false)
