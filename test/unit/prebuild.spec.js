import test from 'ava'
import { buildConfig, buildLayout, copyScripts, copyMedia } from '../../src/libs/prebuild'
import fs from 'fs'
import path from 'path'
import { tmpConfig, safeDelete } from '../utils'

let defaultConfig = {}

test.cb.before(t => {
  global.source = 'test'
  defaultConfig = tmpConfig()
  buildLayout('layout', t.end)
})

test.after.always(t => {
  safeDelete(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'layouts', 'layout.hbs'))
  safeDelete(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'layouts', 'foo.hbs'))
  safeDelete(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'layouts', 'baz.hbs'))
  safeDelete(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'layouts', 'baz-post.hbs'))
  safeDelete(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'utils.js'))
  safeDelete(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'style.css'))
  safeDelete(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'test.js'))
  safeDelete(path.resolve(__dirname, '..', '..', 'media'))
  defaultConfig.restore()
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
  copyScripts(['utils.js'], () => {
    t.truthy(fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'utils.js')))
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
  fs.writeFile(path.resolve(__dirname, '..', 'config.json'), JSON.stringify(tmp, null, 2), 'utf8', err => {
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
    scripts: ['config.json']
  }
  // write in config.json
  fs.writeFile(path.resolve(__dirname, '..', 'config.json'), JSON.stringify(tmp, null, 2), 'utf8', err => {
    if (err) {
      console.error(err)
      t.end()
    }
    buildConfig(() => {
      t.truthy(fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'config.json')))
      t.end()
    })
  })
})

test.serial.cb('if styles are defined as local files, should copy the files', t => {
  const tmp = {
    styles: [
      'style.css',
      'https://unpkg.com/tachyons@4.6.1/css/tachyons.min.css'
    ]
  }
  // write in config.json
  fs.writeFile(path.resolve(__dirname, '..', 'config.json'), JSON.stringify(tmp, null, 2), 'utf8', err => {
    if (err) {
      console.error(err)
      t.end()
    }
    buildConfig(() => {
      t.truthy(fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'style.css')))
      t.falsy(fs.existsSync('https://unpkg.com/tachyons@4.6.1/css/tachyons.min.css'))
      t.end()
    })
  })
})

test.serial.cb('should copy media folder', t => {
  copyMedia(() => {
    t.truthy(fs.existsSync(path.resolve(__dirname, '..', '..', 'media')))
    t.truthy(fs.existsSync(path.resolve(__dirname, '..', '..', 'media', 'pic.jpg')))
    t.end()
  })
})
