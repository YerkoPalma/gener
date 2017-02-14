const SingletonRouter = require('singleton-router')
const PostsView = require('./views/posts')
const PostView = require('./views/post')

const router = SingletonRouter()

router.addRoute('/', PostsView)
router.addRoute('/:post', PostView)
router.setRoot('/')
router.start('#app')