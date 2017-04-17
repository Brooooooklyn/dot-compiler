import * as fs from 'fs'
import * as path from 'path'
import { Observable, Observer } from 'rxjs'
import * as Mocha from 'mocha'

const fileWacher = require('node-watch')

function watch (paths: string[]) {
  return Observable.from(paths)
    .map(p => path.join(process.cwd(), p))
    .mergeMap(path => Observable.create((observer: Observer<string>) => {
      fileWacher(path, (_: any, fileName: string) => {
        observer.next(fileName)
      })
    }))
    .debounceTime(500)
}

watch(['spec-js', 'lib'])
  .subscribe(() => {
    runMocha()
  }, err => {
    console.error(err)
  })

function runMocha() {
  Object.keys(require.cache)
    .forEach((k: string) => delete require.cache[k])
  const mocha = new Mocha()
  fs.readdirSync(path.join(process.cwd(), 'spec-js'))
    .filter(f => f.substr(-3) === '.js')
    .forEach(f => {
      mocha.addFile(path.join(process.cwd(), 'spec-js', f))
    })
  mocha.run(failures => {
    process.on('exit', function () {
      process.exit(failures)
    })
  })
}

process.on('uncaughtException', (err: any) => {
  console.info(`Caught exception: ${err.stack}`)
})

console.info('\x1b[1m\x1b[34mwatch start\x1b[39m\x1b[22m')
