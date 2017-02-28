#!/usr/bin/env node
'use strict'

const meow = require('meow')
// const execa = require('execa')
const fs = require('fs')
const path = require('path')
const buildConfig = require('./libs/prebuild').buildConfig
const buildIndex = require('./libs/build-html').buildIndex
const buildScripts = require('./libs/build-html').buildScripts
const buildPostsData = require('./libs/build-post').buildPostsData
const buildPostsViews = require('./libs/build').buildPostsViews
const buildPostsMeta = require('./libs/build').buildPostsMeta
const buildBundle = require('./libs/build-min').buildBundle

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
  var dist = cli.flags['d'] || cli.flags['dist'] || '.'
  var source = cli.flags['s'] || cli.flags['source'] || '.'

  // clear
  rm(['index.html', 'src/defaults/_scripts.js', 'src/views/data.js', 'src/views/data-posts.js', 'src/views/meta.js', 'bundle.js'], function () {
    console.log(typeof buildConfig)
    buildConfig(
      buildIndex(
        buildPostsData(
          buildPostsViews(
            buildPostsMeta(
              buildBundle
            )
          )
        )
      )
    )
  })
}

function rm (files, cb) {
  files.forEach(function (file) {
    const filePath = path.resolve(__dirname, file)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  })
  cb()
}
