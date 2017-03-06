import test from 'ava'
import { buildPostsData } from '../../src/libs/build-post'
import fs from 'fs'
import path from 'path'
import config from '../../src/defaults/config.json'
let defaultConfig = config

test.before(t => {
  global.dist = 'test'
  global.source = 'test'
})

test.after(t => {
  global.dist = undefined
  fs.writeFileSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'config.json'), JSON.stringify(defaultConfig, null, 2))
  if (fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'views', 'data.js'))) {
    fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'views', 'data.js'))
  }
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
