import test from 'ava'
import { buildPostsViews, buildPostsMeta } from '../../src/libs/build'
import { buildPostsData } from '../../src/libs/build-post'
import fs from 'fs'
import path from 'path'

test.cb.before(t => {
  global.dist = 'test'
  global.source = 'test'
  buildPostsData(() => {
    t.end()
  })
})

test.after(t => {
  global.dist = undefined
  fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'views', 'data-posts.js'))
  fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'views', 'meta.js'))
  if (fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'views', 'data.js'))) {
    fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'views', 'data.js'))
  }
})

test('buildPostsViews argument must be undefined or a function, otherwise throw', t => {
  t.throws(() => { buildPostsViews('') }, Error)
  t.throws(() => { buildPostsViews({}) }, Error)
  t.throws(() => { buildPostsViews([]) }, Error)
})

test('buildPostsMeta argument must be undefined or a function, otherwise throw', t => {
  t.throws(() => { buildPostsMeta('') }, Error)
  t.throws(() => { buildPostsMeta({}) }, Error)
  t.throws(() => { buildPostsMeta([]) }, Error)
})

test.cb('buildPostsViews should build data-posts.js in views folder', t => {
  buildPostsViews(() => {
    const src = path.resolve(__dirname, '..', '..', 'src', 'views', 'data-posts.js')
    t.truthy(fs.existsSync(src))
    t.end()
  })
})

test.cb('buildPostsMeta should build meta.js in views folder', t => {
  buildPostsMeta(() => {
    const src = path.resolve(__dirname, '..', '..', 'src', 'views', 'meta.js')
    t.truthy(fs.existsSync(src))
    t.end()
  })
})

test.cb('meta.js should have slug, featuredImage and featuredImageDescription', t => {
  buildPostsMeta(() => {
    const meta = require('../../src/views/meta.js')
    t.is(meta.length, 2)
    meta.forEach(_meta => {
      t.true(_meta.hasOwnProperty('slug'))
      t.true(_meta.hasOwnProperty('abstract'))
      t.false(_meta.hasOwnProperty('featuredImage'))
      t.false(_meta.hasOwnProperty('featuredImageDescription'))
    })
    t.end()
  })
})
