#!/usr/bin/env node
'use strict'

const meow = require('meow')
const fs = require('fs')
const path = require('path')
const buildConfig = require('./libs/prebuild').buildConfig

const cli = meow(`
    Usage
      $ gener

    Options
      --source, -s  Change the source directory (Default: current directory)
      --dist, -d    Change the distribution directory (Default: current directory)

    Examples
      $ gener
      $ gener --dist /public
      $ gener -s src -d dist

`, {
  alias: {
    d: 'dist',
    s: 'source'
  }
})

if (cli.flags['h'] || cli.flags['help']) {
  cli.showHelp()
  process.exit(0)
}

if (cli.input.length === 0) {
  var dist = cli.flags['d'] || cli.flags['dist'] || null
  var source = cli.flags['s'] || cli.flags['source'] || null
  var dev = cli.flags['dev'] || false
  // make them global
  global.dist = dist
  global.source = source
  global.dev = dev
  if (dist && !fs.existsSync(path.resolve(process.cwd(), global.dist))) {
    fs.mkdirSync(path.resolve(process.cwd(), global.dist))
  }

  // clear
  rm(['index.html', 'src/defaults/_scripts.js', 'src/views/data.js', 'src/views/data-posts.js', 'src/views/meta.js', 'bundle.js'], function () {
    buildConfig()
  })
}

function rm (files, cb) {
  files.forEach(function (file) {
    const filePath = path.resolve(__dirname, file)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  })
  cb()
}
