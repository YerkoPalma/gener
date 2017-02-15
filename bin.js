#!/usr/bin/env node
'use strict'

const meow = require('meow')
const execa = require('execa')
const fs = require('fs')
const path = require('path')

const cli = meow(`
    Usage
      $ gener <input>

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

if (cli.input.length === 0) {
  // clear
  rm(['index.html', '_scripts.js', 'views/data.js', 'views/data-posts.js', 'views/meta.js'], function () {
    execa('node', ['./scripts/build-html.js']).then(function (html) {
      execa('node', ['./scripts/build-post.js']).then(function (html) {
        execa('node', ['./scripts/build.js']).then(function (html) {
          console.log('Generated!')
        })
      })
    })
  })
}

function rm (files, cb) {
  files.forEach(function (file) {
    const filePath = path.resolve(__dirname, file)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  })
  cb()
}
