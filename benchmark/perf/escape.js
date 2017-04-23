var dot = require('dot')
var parser = require('../../lib').default
var suite = require('../suite')

var content = '{{!it.name}}'

module.exports = suite
  .add('dot parse "!"', function () {
    dot.template(content).toString()
  })
  .add('parser parse "!"', function () {
    parser(content).toString()
  })
