const SingletonRouter = require('singleton-router')
const PostsView = require('./views/posts')
const PostView = require('./views/post')

const router = SingletonRouter()
var event = new Event('rendered')

router.addRoute('/', PostsView, function () { window.dispatchEvent(event)})
router.addRoute('/:post', PostView)
router.setRoot('/')
router.start('#app')

window.addEventListener('rendered', function (e) {
  var search = document.getElementById('search')
  var parent = search.parentNode
  
  // hide search input on dom loaded
  // document.addEventListener('DOMContentLoaded', function () {
    search.querySelector('input').style.width = "0px"
    
    parent.style.transition = 'all .25s ease'
    parent.style.WebkitTransition  = 'all .25s ease'
    parent.style.MozTransition   = 'all .25s ease'
  // })
  // toggle input on search button click
  search.addEventListener('click', function (e) {
    e.stopPropagation()
    search.querySelector('input').style.width = "195px"
    search.parentNode.classList.remove('w4')
    search.parentNode.classList.add('w5')
  })
  // hide search input on any document click
  window.addEventListener('click', function (e) {
    e.stopPropagation()
    var el = e.target
    console.log(search.contains(el))
    if (el !== search || !search.contains(el)) {
      search.querySelector('input').style.width = "0px"
      search.parentNode.classList.add('w4')
      search.parentNode.classList.remove('w5')
    }
  })
}, false)
