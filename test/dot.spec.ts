import * as dot from 'dot'
import { expect } from 'chai'
import * as fs from 'fs'
import * as path from 'path'

import parser from '../lib'

describe('doT compile result diff:', () => {

  it('compile bind template', () => {
    const tpl = '{{=it.a}}'
    judgeEqual(tpl)
  })

  it('compile loop template', () => {
    const tpl = `{{=it.a}}{{~it.array :value}}<div>{{!value}}</div>{{~}}`
    judgeEqual(tpl)
  })

  it('compile encode template', () => {
    const tpl = `{{!it.a}}`
    judgeEqual(tpl)
  })

  it('compile snippet template', () => {
    const tpl = `{{##def.snippet: <div>{{=it.a}}</div> #}}{{#def.snippet}}`
    judgeEqual(tpl)
  })

  it('compile evaluation template', () => {
    const tpl = `{{ for(let i = 0; i < it.data.length; i++) { }}<div>{{=prop}}</div>{{ } }}`
    judgeEqual(tpl)
  })

  it('compile if template', () => {
    const tpl = `{{? it.a}} <div>{{=it.b}}</div> {{?}}`
    judgeEqual(tpl)
  })

  it('compile if and else template', () => {
    const tpl = `{{? it.a}} <div>{{=it.b}}</div> {{??}} <div>{{!it.c}}<div>{{?}}`
    judgeEqual(tpl)
  })

  it('compile if and else if template', () => {
    const tpl = `{{? it.a}} <div>{{=it.b}}</div> {{?? !it.d}} <div>{{!it.c}}<div>{{?}}`
    judgeEqual(tpl)
  })

  it('compile snippet template', () => {
    const tpl = `{{##def.snippet:<div>{{!it.a}}<div>{{for(var a in it){}} <div>{{=a}}<div>{{}}}#}}{{#def.snippet}}`
    judgeEqual(tpl)
  })

  it('compile nested if', () => {
    const tpl = '{{?it.a}}{{?it.b}}{{=it.c}}{{?}}{{?}}'
    judgeEqual(tpl)
  })

  it('compile nested if with evaluation', () => {
    const tpl = '{{?it.a}}{{?it.b}}{{for(var a in it.c){}}<div>{{=a}}<div>{{}}}{{?}}{{?}}'
    judgeEqual(tpl)
  })

  it('compile snippet has param', () => {
    const tpl = `{{##def.snippet:data: <div>{{data.b}}<div>{{for(var a in data){}} <div>{{=a}}<div>{{}}}#}}{{~it.p :val}}{{#def.snippet:val}}{{~}}`
    judgeEqual(tpl)
  })

  it.skip('compile fixture template', () => {
    const fixture = fs.readFileSync(path.join(process.cwd(), 'test/fixture.dot'), 'utf-8')
    judgeEqual(fixture)
  })

})

function judgeEqual(input: string) {
  const result = parser(input)
  // console.log(result)
  // const fs = require('fs')
  // fs.writeFileSync('./out1.js', dot.template(input).toString(), 'utf-8')
  // fs.writeFileSync('./out2.js', result.toString(), 'utf-8')
  expect(dot.template(input).toString().replace(/\s/gm, '')).to.equal(result.toString().replace(/\s/gm, ''))
}
