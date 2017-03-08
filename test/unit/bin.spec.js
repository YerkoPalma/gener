import test from 'ava'
import execa from 'execa'
import path from 'path'
import fs from 'fs'

const binPath = path.resolve(__dirname, '..', '..', 'src', 'bin.js')
let defaultConfig = {}

test.before(t => {
  defaultConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'config.json')))
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
  if (fs.existsSync(index)) fs.unlink(index)
  if (fs.existsSync(bundle)) fs.unlink(bundle)
  if (fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', '_scripts.js'))) {
    fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'defaults', '_scripts.js'))
  }
  if (fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'views', 'data.js'))) {
    fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'views', 'data.js'))
  }
  if (fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'views', 'data-posts.js'))) {
    fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'views', 'data-posts.js'))
  }
  if (fs.existsSync(path.resolve(__dirname, '..', '..', 'src', 'views', 'meta.js'))) {
    fs.unlink(path.resolve(__dirname, '..', '..', 'src', 'views', 'meta.js'))
  }
  fs.writeFileSync(path.resolve(__dirname, '..', '..', 'src', 'defaults', 'config.json'), JSON.stringify(defaultConfig, null, 2))
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

test('if dist folder doesn\'t exists, it must be created', async t => {
  await execa('node', [binPath, '-d', 'dist'])
  const distCreated = fs.existsSync(path.resolve(process.cwd(), 'dist'))
  t.true(distCreated)
})

test.todo('if all goes well, should create index and bundle files')

test.todo('if dev flag is present, should start a local server')
