import test from 'ava'
import { buildPostsViews, buildPostsMeta } from '../../src/libs/build'

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

test('buildPostsViews should build data-posts.js in views folder')

test('buildPostsMeta should build meta.js in views folder')

test('meta.js should have slug, featuredImage and featuredImageDescription')

test('meta.js should use default values if they are not set')