var dot = require('dot')
var parser = require('../../lib').default
var suite = require('../suite')

var content = '{{##def.snippet:data: <div>{{data.b}}<div>{{for(var a in data){}} <div>{{=a}}<div>{{}}}#}}{{~it.p :val}}{{#def.snippet:val}}{{~}}'

module.exports = suite
  .add('dot parse "#"', function () {
    dot.template(content).toString()
  })
  .add('parser parse "#"', function () {
    parser(content).toString()
  })
