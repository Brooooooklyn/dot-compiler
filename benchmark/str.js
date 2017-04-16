const suite = require('./suite')

const str = '1234567890'

module.exports = suite
  .add('String#position', () => {
    let tmp
    for (let j = 0; j < str.length; j++) {
      tmp = str[j]
    }
    return tmp
  })
  .add('String#substring', () => {
    let tmp
    for (let j = 1; j <= str.length; j++) {
      tmp = str.substring(j - 1, j)
    }
    return tmp
  })
  .add('String#charAt', () => {
    let tmp
    for (let j = 0; j < str.length; j++) {
      tmp = str.charAt(j)
    }
    return tmp
  })
