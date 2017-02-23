import test from 'ava'
import execa from 'execa'
import path from 'path'
import fs from 'fs'
import axios from 'axios'
import {createServer} from './_server'

var url
var server

test.before(async () => {
  console.log('Generatin files...')
  await execa('node', [path.resolve(__dirname, '..', 'src', 'bin.js')], { cwd: __dirname })
  // run server on recently generated files
  console.log('Starting server...')
  server = await createServer()
  url = server.url
})

test.after(() => {
  console.log('Attempting to close server...')
  server.close()
})

test('main', async t => {
  console.log('Checking files...')
  t.true(fs.existsSync(path.resolve(__dirname, 'index.html')))
  t.true(fs.existsSync(path.resolve(__dirname, 'bundle.js')))

  // check responde of the server
  console.log('Checking response...')
  const response = await axios.get(url)
  t.truthy(response)
  t.is(response.status, 200)

  console.log('Checking routes...')
})

test('custom config', t => {
  console.log('custom config...')
  console.log('custom scripts...')
  console.log('custom styles...')
  console.log('custom layouts...')
})
