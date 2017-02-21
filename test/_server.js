'use strict'
const path = require('path')
const fs = require('fs')
const http = require('http')
const getPort = require('get-port')
const pify = require('pify')

const host = exports.host = 'localhost'

function createServer (fn) {
  return () => getPort().then(port => {
    const server = http.createServer(fn)

    server.host = host
    server.port = port
    server.url = `http://${host}:${port}`
    server.protocol = 'http'
    server.listen(port)
    server.close = pify(server.close)

    return server
  })
}

exports.createServer = createServer((req, res) => {
  res.writeHead(200, {'content-type': 'text/html'})
  res.end(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8'))
})
