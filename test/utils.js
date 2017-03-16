const fs = require('fs')
const path = require('path')

// Synchronously backup a file to be restored later
function backup (path) {
  if (!fs.existsSync(path)) {
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
  if (!fs.existsSync(from)) {
    console.log('Can\'t copy from ' + from + '\nPath doesn\'t exists')
  }
  if (!fs.existsSync(to)) {
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
  if (!fs.existsSync(origin)) {
    console.log('Can\'t make a snapshot for ' + origin + '\nPath doesn\'t exists')
  }
  // create simple struct to represent the file/folder
  var s = createStruct(origin)

  return {
    data: s,
    name: origin,
    restore: function (srcNode, src) {
      src = src || origin || '.'
      srcNode = srcNode || s
      if (srcNode.type === 'dir') {
        safeMkdir(src)
        for (var child in srcNode.children) {
          this.restore(srcNode.children[child], path.resolve(src, child))
        }
      } else {
        fs.writeFileSync(src, srcNode.data)
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
      obj[path] = fileStruct
      return fileStruct
    }
  }
}

function safeMkdir (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

function safeDelete (file) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
  }
}

function tmpConfig () {
  const defaultConfig = backup(path.resolve('src', 'defaults', 'config.json'))
  return defaultConfig
}

exports.backup = backup
exports.copy = copy
exports.snapshot = snapshot
exports.safeMkdir = safeMkdir
exports.safeDelete = safeDelete
exports.tmpConfig = tmpConfig
