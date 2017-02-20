import test from 'ava'
import execa from 'execa'
import path from 'path'
import fs from 'fs'

test('main', async t => {
  await execa('node', [path.resolve(__dirname, 'bin.js')])
  t.true(fs.existsSync(path.resolve(__dirname, 'index.html')))
})
