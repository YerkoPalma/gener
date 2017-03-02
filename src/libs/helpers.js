const assert = require('assert')

// handlebars helper
function formatDate (d) {
  assert.equal(typeof d, 'object')
  assert.ok(d.year)
  assert.ok(d.month)
  assert.ok(d.day)
  assert.equal(typeof d.year, 'number')
  assert.equal(typeof d.month, 'number')
  assert.equal(typeof d.day, 'number')

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
