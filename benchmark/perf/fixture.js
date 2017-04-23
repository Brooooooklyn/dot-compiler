var dot = require('dot')
var parser = require('../../lib').default
var suite = require('../suite')
var fs = require('fs')
var path = require('path')

var content = fs.readFileSync(path.join(process.cwd(), 'benchmark/fixture.dot'), 'utf-8')

module.exports = suite
  .add('dot parse "￥"', function () {
    dot.template(content).toString()
  })
  .add('parser parse "￥"', function () {
    parser(content).toString()
  })
