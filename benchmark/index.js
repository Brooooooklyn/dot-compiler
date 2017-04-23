var suite = require('./suite')
var chalk = require('chalk')

// require('./str')
// require('./instanceof')
require('./perf')

suite
  .on('cycle', function (event) {
    parseBenchResult(String(event.target))
  })
  .run()

function parseBenchResult (str) {
  var title = str.split('x')[0]
  var rest = str.split('x')[1]
  var perfArrays = rest.split(' ')
  perfArrays.shift()
  var perf1 = perfArrays[0]
  var perf2 = perfArrays[1]
  var perf3 = perfArrays[2]
  var perf4 = perfArrays[3]
  var perf5 = perfArrays[4]
  var perf6 = perfArrays[5]
  var runs = perf4 + ' ' + perf5 + ' ' + perf6
  runs = '( ' + chalk.cyan(runs.substring(1, runs.length - 1)) + ' )'
  console.log(chalk.bgBlack(chalk.green(`${title}: `), chalk.yellow(perf1, perf2, perf3)), runs)
}
