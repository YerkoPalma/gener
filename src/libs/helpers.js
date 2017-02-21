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
