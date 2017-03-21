import test from 'ava'
import { buildIndex, buildScripts } from '../../src/libs/build-html'
import fs from 'fs'
import path from 'path'
import cheerio from 'cheerio'
import { tmpConfig, safeDelete, copy } from '../utils'

let config = {}
let defaultConfig = {}

test.before(t => {
  global.dist = 'test'
  config = require('../../src/defaults/config.json')
  defaultConfig = tmpConfig()
  var from = path.resolve(__dirname, '..', 'posts')
  var to = path.resolve(__dirname, '..', '..', 'posts')
  copy(from, to)
})

test.after(t => {
  var dest = global.dist
              ? path.resolve(process.cwd(), global.dist, 'index.html')
              : path.resolve(process.cwd(), 'index.html')
  global.dist = undefined
  defaultConfig.restore()
  safeDelete(path.resolve(__dirname, '..', '..', 'src', 'defaults', '_scripts.js'))
  safeDelete(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'utils.js'))
  safeDelete(dest)
})

test.cb('buildIndex should build index.html in dist directory', t => {
  buildIndex(() => {
    const src = path.resolve(process.cwd(), global.dist, 'index.html')
    t.truthy(fs.existsSync(src))
    t.end()
  })
})

test.cb('index.html should have properties from global config', t => {
  buildIndex(() => {
    const src = path.resolve(process.cwd(), global.dist, 'index.html')
    const index = fs.readFileSync(src)
    let $ = cheerio.load(index)

    let expectedName = config.name
    let actualName = $('title').text()
    t.is(actualName, expectedName)
    let expectedAuthor = config.author
    let actualAuthor = $('meta[name="author"]').attr('content')
    t.is(actualAuthor, expectedAuthor)
    let expectedStyles = config.styles
    let head = $('head').html()

    expectedStyles.forEach(style => {
      t.true(head.indexOf(style) > -1)
    })
    t.end()
  })
})

test('buildIndex and buildScript can only be functions or undefined', t => {
  t.notThrows(() => { buildIndex('') })
  t.throws(() => { buildIndex({}) }, Error)
  t.throws(() => { buildIndex([]) }, Error)
})

test.cb('buildScripts should build scripts if there are in config', t => {
  buildScripts(() => {
    const src = path.resolve(__dirname, '..', '..', 'src', 'defaults', '_scripts.js')
    t.truthy(fs.existsSync(src))
    t.end()
  })
})
