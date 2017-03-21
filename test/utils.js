const fs = require('fs')
const path = require('path')

// Synchronously backup a file to be restored later
function backup (dir) {
  if (!fs.existsSync(dir)) {
    console.log('Can\'t backup path ' + dir + '\nnot a file')
  }
  return {
    name: dir,
    content: fs.readFileSync(dir, 'utf8'),
    restore: function () {
      fs.writeFileSync(this.name, this.content, 'utf8')
    }
  }
}

// Synchronously copy a file or folder (recursively)
function copy (from, to) {
  if (!fs.existsSync(from)) {
    console.log('Can\'t copy from ' + from + '\nPath doesn\'t exists')
    return
  }
  const isDirectory = fs.statSync(from).isDirectory()
  if (isDirectory && !fs.existsSync(to)) {
    fs.mkdirSync(to)
  }
  if (isDirectory) {
    const files = fs.readdirSync(from)
    files.map((file) => {
      var filePath = path.resolve(from, file)
      copy(filePath, path.resolve(to, file))
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
    if (fs.statSync(file).isFile()) {
      fs.unlinkSync(file)
    } else {
      // is directory, check if is empty
      const subfiles = fs.readdirSync(file)
      if (subfiles.length === 0) {
        fs.rmdirSync(file)
      } else {
        subfiles.map(function (subfile) {
          safeDelete(path.resolve(file, subfile))
        })
      }
    }
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
