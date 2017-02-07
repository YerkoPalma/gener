// handlebars helper
function formatDate (d) {
  var year = d.year
  var month = d.month
  var day = d.day
  var monthName = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'November',
    'December'
  ]
  return day + ' ' + monthName[month - 1] + ', ' + year
}
exports.formatDate = formatDate

function getIndicesOf (searchStr, str, caseSensitive) {
  var searchStrLen = searchStr.length
  if (searchStrLen == 0) {
    return []
  }
  var startIndex = 0, index, indices = []
  if (!caseSensitive) {
    str = str.toLowerCase()
    searchStr = searchStr.toLowerCase()
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index)
    startIndex = index + searchStrLen
  }
  return indices
}

function replaceBlock (tpl) {
  // get all the starts blocks
  var starts = getIndicesOf('{{#each tags}}', tpl)

  // get all the ends blocks
  var ends = getIndicesOf('{{/each}}', tpl)

  var i = 0
  while (ends.length) {
    var end = ends[i]
    var start = null
    var j = starts.length
    var chunks = []
    while (!start) {
      if (end > starts[--j]) {
        start = starts[j]
        starts.splice(j, 1)
        ends.splice(i, 1)
        var sub = tpl.substring(start, end)
                  .replace('{{#each tags}}', '\' + pupa(\'')
                  .replace('{{/each}}', '\', tags) + \'')
        chunks.push(sub)
      }
    }
  }
}

exports.replaceBlock = replaceBlock
