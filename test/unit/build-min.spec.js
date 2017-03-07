import test from 'ava'
import { buildBundle } from '../../src/libs/build-min'
import { buildIndex, buildScripts } from '../../src/libs/build-html'
import { buildPostsData } from '../../src/libs/build-post'
import { buildPostsViews, buildPostsMeta } from '../../src/libs/build'
import fs from 'fs'
import path from 'path'

test.before(t => {
  global.dist = 'test'
  global.source = 'test'
})

test.after(t => {
  var bundle = global.dist
              ? path.resolve(process.cwd(), global.dist, 'bundle.js')
              : path.resolve(process.cwd(), 'bundle.js')
  var index = global.dist
              ? path.resolve(process.cwd(), global.dist, 'index.html')
              : path.resolve(process.cwd(), 'index.html')
  global.dist = undefined
  global.source = undefined
  fs.unlink(index)
  fs.unlink(bundle)
  fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'defaults', '_scripts.js'))
  if (fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'views', 'data.js'))) {
    fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'views', 'data.js'))
  }
  fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'views', 'data-posts.js'))
  fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'views', 'meta.js'))
})

test.cb('buildBundle should create bundle.js file', t => {
  buildIndex(() => {
    buildScripts(() => {
      buildPostsData(() => {
        buildPostsData(() => {
          buildPostsViews(() => {
            buildPostsMeta(() => {
              buildBundle(() => {
                const src = path.resolve(process.cwd(), global.dist, 'bundle.js')
                t.truthy(fs.existsSync(src))
                t.end()
              })
            })
          })
        })
      })
    })
  })
})
