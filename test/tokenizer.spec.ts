import tokenizer from '../lib/tokenizer'
import { expect } from 'chai'

describe('tokenizer test suit', () => {
  it('should parse nomal experssion', () => {
    const result = tokenizer(`{{ it.normal }}`)
    expect(result).to.deep.equal(['{{', ' it.normal ', '}}'])
  })

  it('should parse "="', () => {
    const result = tokenizer(`{{= it.normal }}`)
    expect(result).to.deep.equal(['{{', '=', ' it.normal ', '}}'])
  })

  it('should parse "!"', () => {
    const result = tokenizer(`{{! it.normal }}`)
    expect(result).to.deep.equal(['{{', '!', ' it.normal ', '}}'])
  })

  it('should parse "?', () => {
    const result = tokenizer(`{{? it.normal }}<div>123</div>{{?}}`)
    expect(result).to.deep.equal(['{{', '?', ' it.normal ', '}}', '<div>123</div>' , '{{', '?', '}}'])
  })

  it('should throw error in "?"', () => {
    try {
      tokenizer(`{{?! it.normal }}<div>123</div>{{?}}`)
      throw 1
    } catch (e) {
      expect(e.message).to.equal('unexpected token at ?!')
    }
  })

  it('should parse "??', () => {
    const result = tokenizer(`{{? it.normal }}<div>123</div>{{?? it.danger}}<span>321</span>{{?}}`)
    expect(result).to.deep.equal([
      '{{', '?', ' it.normal ', '}}',
      '<div>123</div>' ,
      '{{', '??', ' it.danger', '}}',
      '<span>321</span>',
      '{{', '?', '}}'
    ])
  })

  it('should parse "~"', () => {
    const result = tokenizer(`{{~ it.array :value:index}}<div>{{=value}}</div>{{~}}`)
    expect(result).to.deep.equal([
      '{{', '~', ' it.array ', ':', 'value', ':', 'index', '}}',
      '<div>', '{{', '=', 'value', '}}', '</div>',
      '{{', '~', '}}'
    ])
  })

  it('should throw unexpected token in "~"', () => {
    const parse = () => tokenizer(`{{~ it.array :value=index}}<div>{{=value}}</div>{{~}}`)
    expect(parse).to.throw(`unexpected token at value^^^^^`)
  })

  it('should throw unexpected token at loop expression in "~"', () => {
    const parse = () => tokenizer(`{{~ it.array :value:index:whatever}}<div>{{=value}}</div>{{~}}`)
    expect(parse).to.throw(`unexpected token at loop expression: ~ it.array :value:index: ^^^^^`)
  })

  it('should parse "#"', () => {
    const result = tokenizer(`{{##def.snippet:<div>{{=it.name}}</div>{{#def.joke}}#}}{{#def.snippet}}`)
    expect(result).to.deep.equal([
      '{{', '##def', 'snippet:',
      '<div>', '{{', '=', 'it.name', '}}',
      '</div>', '{{', '#def', 'joke', '}}', '#', '}}',
      '{{', '#def', 'snippet', '}}'
    ])
  })

  it('should parse "#" with param', () => {
    const result = tokenizer(`{{##def.snippet:data:<div>{{=data.name}}</div>{{#def.joke}}#}}{{#def.snippet}}`)
    expect(result).to.deep.equal([
      '{{', '##def', 'snippet:', 'data:',
      '<div>', '{{', '=', 'data.name', '}}',
      '</div>', '{{', '#def', 'joke', '}}', '#', '}}',
      '{{', '#def', 'snippet', '}}'
    ])
  })

  it('should throw unexpected token if "def." not valid in "#"', () => {
    const parse = () => tokenizer(`{{##deg.snippet:data:<div>{{=data.name}}</div>{{#def.joke}}#}}{{#def.snippet}}`)
    expect(parse).to.throw(`unexpected token at {{## ^^^^^ deg., expected 'def.'`)
  })

  it('should throw unexpected token if reference of "def." not valid in "#"', () => {
    const parse = () => tokenizer(`{{##def.snippet:data:<div>{{=data.name}}</div>{{#def.joke}}#}}{{#deg.snippet}}`)
    expect(parse).to.throw(`unexpected token at {# ^^^^^ d, expected 'def.' or '}}'`)
  })

  it('should throw unexpected token in snippet def in "#"', () => {
    const parse = () => tokenizer(`{{##def.snippet:data:haha:<div>{{=data.name}}</div>{{#def.joke}}#}}{{#def.snippet}}`)
    expect(parse).to.throw(`unexpected token in snippetDef at "snippet:data:haha: ^^^^^"`)
  })

  it('should throw unexpected token in snippet def when illegal symbol after ":" in "#"', () => {
    const parse = () => tokenizer(`{{##def.snippet:~<div>{{=data.name}}</div>{{#def.joke}}#}}{{#def.snippet}}`)
    expect(parse).to.throw(`unexpected token at: ##def.snippet: ^^^^^ ~`)
  })
})
