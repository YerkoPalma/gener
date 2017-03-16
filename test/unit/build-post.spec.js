import test from 'ava'
import { buildPostsData } from '../../src/libs/build-post'
import fs from 'fs'
import path from 'path'
import { tmpConfig, safeDelete } from '../utils'

let defaultConfig = tmpConfig()

test.before(t => {
  global.dist = 'test'
  global.source = 'test'
})

test.after(t => {
  global.dist = undefined
  defaultConfig.restore()
  safeDelete(path.resolve(__dirname, '..', '..', 'src', 'views', 'data.js'))
})

test.cb('buildPostsData should create data.js file in views folder', t => {
  buildPostsData(() => {
    const src = path.resolve(__dirname, '..', '..', 'src', 'views', 'data.js')
    t.truthy(fs.existsSync(src))
    t.end()
  })
})

test('buildPostsData argument must be undefined or a function, otherwise throw', t => {
  t.throws(() => { buildPostsData('') }, Error)
  t.throws(() => { buildPostsData({}) }, Error)
  t.throws(() => { buildPostsData([]) }, Error)
})

test.cb('data.js file should expose an object with 3 properties for each post', t => {
  buildPostsData(() => {
    const data = require('../../src/views/data.js')
    t.true(data.hasOwnProperty('nra.json'))
    t.true(data.hasOwnProperty('nra.md'))
    t.true(data.hasOwnProperty('/nra'))
    t.true(data.hasOwnProperty('tools-and-frameworks.json'))
    t.true(data.hasOwnProperty('tools-and-frameworks.md'))
    t.true(data.hasOwnProperty('/tools-and-frameworks'))
    t.end()
  })
})
