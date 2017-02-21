#!/usr/bin/env node
'use strict'
var fs = require('fs')
var path = require('path')

// create config file
// in this case, a merge of options
var userConfig = {}
var defaultConfig = require('../defaults/config.json')

if (fs.existsSync(path.resolve(process.cwd(), 'config.json'))) {
  fs.readFile(path.resolve(process.cwd(), 'config.json'), 'utf8', function (err, data) {
    if (err) throw err
    console.log('reading user config')
    userConfig = JSON.parse(data)
    // copy layout files if they are present
    if (userConfig.layout && fs.existsSync(path.resolve(process.cwd(), 'layouts'))) {
      console.log('copying user layouts')
      fs.readdir(path.resolve(process.cwd(), 'layouts'), function (err, files) {
        if (err) throw err
        files = files.filter(function (file) {
          return file.indexOf(userConfig.layout) > -1
        })
        files.forEach(function (file) {
          fs.createReadStream(path.resolve(process.cwd(), 'layouts', file))
            .pipe(fs.createWriteStream(path.resolve(__dirname, '..', 'defaults', 'layouts', file)))
        })
      })
    }
    var config = Object.assign(defaultConfig, userConfig)
    fs.writeFile(path.resolve(__dirname, '../defaults/config.json'), JSON.stringify(config, null, 2), 'utf8', function () {})
  })
}
