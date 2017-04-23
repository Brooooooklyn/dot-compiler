var suite = require('./suite')

var str = '1234567890'

module.exports = suite
  .add('String#position', function () {
    var tmp
    for (var j = 0; j < str.length; j++) {
      tmp = str[j]
    }
    return tmp
  })
  .add('String#substring', function () {
    var tmp
    for (var j = 1; j <= str.length; j++) {
      tmp = str.substring(j - 1, j)
    }
    return tmp
  })
  .add('String#charAt', function () {
    var tmp
    for (var j = 0; j < str.length; j++) {
      tmp = str.charAt(j)
    }
    return tmp
  })
  .add('String#add', function () {
    var tmp = ''
    for (var i = 0; i++; i < 1000) {
      tmp += i
    }
  })
  .add('String#join', function () {
    var tmp = []
    for (var i = 0; i++; i < 1000) {
      tmp.push(i)
    }
    tmp.join('')
  })
