const fs = require('fs')
const path = require('path')

// Synchronously backup a file to be restored later
function backup (path) {
  if(!fs.existsSync(path)) {
    console.log('Can\'t backup path ' + path + '\nnot a file')
  }
  return {
    name: path,
    content: fs.readFileSync(path),
    restore: function () {
      fs.writeFileSync(this.name, this.content)
    }
  }
}

// Synchronously copy a file or folder (recursively)
function copy (from, to) {
  if(!fs.existsSync(from)) {
    console.log('Can\'t copy from ' + from + '\nPath doesn\'t exists')
  }
  if(!fs.existsSync(to)) {
    fs.mkdirSync(to)
  }
  const isDirectory = fs.statSync(from).isDirectory()
  if (isDirectory) {
    const files = fs.readdirSync(from)
    files.map((file) => {
      var filePath = path.resolve(from, file)
      if (fs.statSync(filePath).isDirectory()) {
        copy(filePath, path.resolve(to, file))
      } else {
        copy(file, to)
      }
    })
  } else {
    const content = fs.readFileSync(from)
    fs.writeFileSync(path.resolve(to, from), content)
  }
}

// Asynchronously save a file or folder to later restore
function snapshot (origin) {
  if(!fs.existsSync(origin)) {
    console.log('Can\'t make a snapshot for ' + origin + '\nPath doesn\'t exists')
  }
  // create simple struct to represent the file/folder
  var s = createStruct(origin)
  console.log(JSON.stringify(s, null, 2))
  return {
    data: s,
    name: origin,
    restore: function (src) {
      src = src || origin || '.'
      if (this.data.type === 'dir') {
        // mkdir(src)
        // for (var child in children) {
        //   this.restore(path.resolve(src, child))
        // }
      } else {
        const data = src.split('/').reduce(function (_path) {
          // traverse obj to get the file data
        })
        fs.writeFileSync(src, data.data)
      }
    }
  }

  function createStruct (origin, obj) {
    obj = obj || {}

    if (fs.statSync(origin).isDirectory()) {
      var dirStruct = {
        type: 'dir',
        children: {}
      }
      const files = fs.readdirSync(origin)
      for (var file of files) {
        var filePath = path.resolve(origin, file)
        dirStruct.children[file] = createStruct(filePath)
      }
      return dirStruct
    } else {
      var fileStruct = {
        type: 'file',
        data: fs.readFileSync(origin, 'utf8')
      }
      return obj[path] = fileStruct
    }
  }
}

exports.backup = backup
exports.copy = copy
exports.snapshot = snapshot
