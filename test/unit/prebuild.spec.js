import test from 'ava'
import { buildLayout, copyScripts } from '../../src/libs/prebuild'
import fs from 'fs'
import path from 'path'

test.cb.before(t => {
  global.source = 'test'
  buildLayout('layout', t.end)
})

test.after(t => {
  fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'layouts', 'layout.hbs'))
  fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'layouts', 'foo.hbs'))
  fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'defaults', '_server.js'))
})

test.cb('buildLayout should throw on invalid input', t => {
  t.throws(() => { buildLayout() }, Error)
  t.throws(() => { buildLayout({}) }, Error)
  buildLayout('foo', () => {
    t.pass()
    t.end()
  })
})

test('should copy only the right layouts', t => {
  t.truthy(fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'layouts', 'layout.hbs')))
  t.falsy(fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'layouts', 'bar.hbs')))
})

test('copyScripts should throw on invalid input', t => {
  t.throws(() => { copyScripts() }, Error)
  t.throws(() => { copyScripts({}) }, Error)
  t.notThrows(() => { copyScripts([]) })
})

test('should copy only the right scripts', t => {
  copyScripts(['_server.js'])
  t.truthy(fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', '_server.js')))
})
