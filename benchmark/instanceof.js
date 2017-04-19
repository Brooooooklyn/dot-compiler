var suite = require('./suite')

function Foo() {
  this.a = '1'
}

var foo = new Foo()

module.exports = suite
  .add('Class#instanceof', function () {
    foo instanceof Foo
  })
  .add('Class#property', function () {
    foo.a === '1'
  })
