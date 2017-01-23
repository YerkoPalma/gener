const SingletonRouter = require('singleton-router')
const PostsView = require('./views/posts')
const PostView = require('./views/post')
const TagsView = require('./views/tags')

const router = SingletonRouter()

router.addRoute('/', PostsView)
router.addRoute('/tags', TagsView)
router.addRoute('/tags/:tag', PostsView)
router.addRoute('/:post', PostView)
router.setRoot('/')
router.start('#app')
