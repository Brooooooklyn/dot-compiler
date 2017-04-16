const suite = require('./str')
const chalk = require('chalk')

suite
  .on('cycle', event => {
    parseBenchResult(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()

function parseBenchResult (str) {
  const [ title, rest ] = str.split('x')
  const perfArrays = rest.split(' ')
  perfArrays.shift()
  const [ perf1, perf2, perf3, perf4, perf5, perf6 ] = perfArrays
  let runs = perf4 + ' ' + perf5 + ' ' + perf6
  runs = '( ' + chalk.cyan(runs.substring(1, runs.length - 1)) + ' )'
  console.log(chalk.bgBlack(chalk.green(`${title}: `), chalk.yellow(perf1, perf2, perf3)), runs)
}
