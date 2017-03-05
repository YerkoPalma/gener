import test from 'ava'
import { buildConfig, buildLayout, copyScripts } from '../../src/libs/prebuild'
import fs from 'fs'
import path from 'path'

let defaultConfig = {}

test.cb.before(t => {
  global.source = 'test'
  defaultConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'config.json')))
  buildLayout('layout', t.end)
})

test.after.always(t => {
  fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'layouts', 'layout.hbs'))
  fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'layouts', 'foo.hbs'))
  fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'layouts', 'baz.hbs'))
  fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'layouts', 'baz-post.hbs'))
  fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'defaults', '_server.js'))
  fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'test.js'))
  fs.writeFileSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'config.json'), JSON.stringify(defaultConfig, null, 2))
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

test.cb('should copy only the right scripts', t => {
  copyScripts(['_server.js'], () => {
    t.truthy(fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', '_server.js')))
    t.end()
  })
})

test('buildConfig argument must be undefined or a function, otherwise throw', t => {
  t.throws(() => { buildConfig('') }, Error)
  t.throws(() => { buildConfig({}) }, Error)
  t.throws(() => { buildConfig([]) }, Error)
})

test.serial.cb('if layout is defined, should call "buildLayout"', t => {
  // write in config.json
  const tmp = {
    layout: 'baz'
  }
  fs.writeFile(path.resolve(__dirname, '..', 'config.json'), JSON.stringify(tmp, null, 2), err => {
    if (err) {
      console.error(err)
      t.end()
    }
    buildConfig(() => {
      t.truthy(fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'layouts', 'baz.hbs')))
      t.truthy(fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'layouts', 'baz-post.hbs')))
      t.end()
    })
  })
})

test.serial.cb('if scripts is defined, should call "copyScripts"', t => {
  const tmp = {
    scripts: ['test.js']
  }
  // write in config.json
  fs.writeFile(path.resolve(__dirname, '..', 'config.json'), JSON.stringify(tmp, null, 2), err => {
    if (err) {
      console.error(err)
      t.end()
    }
    buildConfig(() => {
      t.truthy(fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'test.js')))
      t.end()
    })
  })
})
