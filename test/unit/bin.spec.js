import test from 'ava'
import execa from 'execa'
import path from 'path'
import fs from 'fs'
import { tmpConfig, safeDelete } from '../utils'

const binPath = path.resolve(__dirname, '..', '..', 'src', 'bin.js')
let defaultConfig = tmpConfig()

test.before(t => {
  global.dist = undefined
  global.source = undefined
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
  safeDelete(index)
  safeDelete(bundle)
  safeDelete(path.resolve(__dirname, '..', '..', 'src', 'defaults', '_scripts.js'))
  safeDelete(path.resolve(__dirname, '..', '..', 'src', 'views', 'data.js'))
  safeDelete(path.resolve(__dirname, '..', '..', 'src', 'views', 'data-posts.js'))
  safeDelete(path.resolve(__dirname, '..', '..', 'src', 'views', 'meta.js'))
  defaultConfig.restore()
})

test('cli should show help with -h and --help flags', async t => {
  const result = await execa('node', [binPath, '-h', 'foo'])
  t.is(result.stdout, `
  Simple static site generator

  Usage
    $ gener

  Options
    --source, -s  Change the source directory (Default: current directory)
    --dist, -d    Change the distribution directory (Default: current directory)

  Examples
    $ gener
    $ gener --dist /public
    $ gener -s src -d dist`)
})

test.cb('if dist folder doesn\'t exists, it must be created', t => {
  fs.writeFile(path.resolve(__dirname, '..', 'config.json'), JSON.stringify(defaultConfig, null, 2), err => {
    if (err) {
      console.error(err)
      t.end()
    }
    execa.sync('node', [binPath, '-d', 'dist'], { cwd: path.resolve(__dirname, '..') })
    const distCreated = fs.existsSync(path.resolve(__dirname, '..', 'dist'))
    t.true(distCreated)
    t.end()
  })
})

test.cb('if all goes well, should create index and bundle files', t => {
  fs.writeFile(path.resolve(__dirname, '..', 'config.json'), JSON.stringify(defaultConfig, null, 2), err => {
    if (err) {
      console.error(err)
      t.end()
    }
    execa('node', [binPath, '-d', 'dist'], { cwd: path.resolve(__dirname, '..') }).then(() => {
      // make some ping to localhost
      const indexCreated = fs.existsSync(path.resolve(__dirname, '..', 'dist', 'index.html'))
      const bundleCreated = fs.existsSync(path.resolve(__dirname, '..', 'dist', 'bundle.js'))
      t.true(indexCreated)
      t.true(bundleCreated)
      t.end()
    })
  })
})
