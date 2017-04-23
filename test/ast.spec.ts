import { expect } from 'chai'
import * as _ from 'lodash'

import parseAst from '../lib/ast'
import { Node } from '../lib/ast/Node'
import { ExpressionNode } from '../lib/ast/Expression'
import { IFNode } from '../lib/ast/IF'

describe('AST Spec', () => {
  it('should parse "=" expression', () => {
    const tokens = ['{{', '=', 'it.a', '}}']
    const result = parseAst(tokens)
    expect(getNodes(result)).to.deep.equal(['Expression'])
    judgeNodes(result)
  })

  it('should parse "!" expression', () => {
    const result = parseAst(['{{', '!', 'it.a', '}}'])
    expect(getNodes(result)).to.deep.equal(['Expression'])
    judgeNodes(result)
  })

  it('should parse "~" expression', () => {
    const result = parseAst(['{{', '~', ' it.array ', ':', 'value', ':', 'index', '}}', 'div', '{{', '~', '}}'])
    expect(getNodes(result)).to.deep.equal(['Loop'])
    expect(getNodes(result.children[0])).to.deep.equal(['Expression'])
    judgeNodes(result)
  })

  it('should parse "?" expression', () => {
    const tokens = ['{{', '?', ' it.normal ', '}}', '<div>123</div>', '{{', '?', '}}']
    const result = parseAst(tokens)
    expect(getNodes(result)).to.deep.equal(['IF'])
    expect(getNodes(result.children[0])).to.deep.equal(['Expression'])
    expect((result.children[0].children[0] as ExpressionNode).subType).to.equal('Scalar')
    judgeNodes(result)
  })

  it('should parse "??" else if expression', () => {
    const tokens = [
      '{{', '?', ' it.normal ', '}}',
      '<div>123</div>',
      '{{', '??', ' it.danger', '}}',
      '{{', '=', 'it.foo', '}}',
      '{{', '?', '}}'
    ]
    const result = parseAst(tokens)
    expect(getNodes(result)).to.deep.equal(['IF', 'IF'])
    const [ exp1, exp2 ] = (result.children as IFNode[])
    expect(exp1.subType).to.equal('If')
    expect(exp1.children[0].type).to.equal('Expression')
    expect((exp1.children[0] as ExpressionNode).subType).to.equal('Scalar')
    expect(exp2.subType).to.equal('ElseIf')
    expect(exp2.children[0].type).to.equal('Expression')
    expect((exp2.children[0] as ExpressionNode).subType).to.equal('Bind')
    judgeNodes(result)
  })

  it('should parse "??" else expression', () => {
    const tokens = [
      '{{', '?', ' it.normal ', '}}',
      '<div>123</div>',
      '{{', '??', '}}',
      '{{', '=', 'it.foo', '}}',
      '{{', '?', '}}'
    ]
    const result = parseAst(tokens)
    expect(getNodes(result)).to.deep.equal(['IF', 'IF'])
    const [ exp1, exp2 ] = (result.children as IFNode[])
    expect(exp1.subType).to.equal('If')
    expect(exp1.children[0].type).to.equal('Expression')
    expect((exp1.children[0] as ExpressionNode).subType).to.equal('Scalar')
    expect(exp2.subType).to.equal('Else')
    expect(exp2.children[0].type).to.equal('Expression')
    expect((exp2.children[0] as ExpressionNode).subType).to.equal('Bind')
    judgeNodes(result)
  })

  it('should parse "~" expression', () => {
    const tokens = [
      '{{', '~', ' it.array ', ':', 'value', ':', 'index', '}}',
      '<div>', '{{', '=', 'value', '}}', '</div>',
      '{{', '~', '}}'
    ]
    const result = parseAst(tokens)
    expect(getNodes(result)).to.deep.equal(['Loop'])
    expect(getNodes(result.children[0])).to.deep.equal(['Expression', 'Expression', 'Expression'])
    expect(result.children[0].children.map(c => (c as ExpressionNode).subType))
      .to.deep.equal(['Scalar', 'Bind', 'Scalar'])

    judgeNodes(result)
  })

  it('should parse evaluation expression', () => {
    const tokens = [
      '{{', ' for(var prop in it) { ', '}}',
      '<div>', '{{', '=', 'prop', '}}', '</div>',
      '{{', ' } ', '}}'
    ]
    const result = parseAst(tokens)
    expect(getNodes(result)).to.deep.equal(['Expression', 'Expression', 'Expression', 'Expression', 'Expression'])
    const children = (result.children as ExpressionNode[])
    expect(children.map(c => c.subType)).to.deep.equal([
      'Exp', 'Scalar', 'Bind', 'Scalar', 'Exp'
    ])
    judgeNodes(result)
  })

  it('should parse "#" expression', () => {
    const tokens = [
      '{{', '##def', 'snippet:',
      '<div>', '{{', '=', 'it.name', '}}',
      '</div>', '{{', '!', 'it.joke', '}}', '#', '}}',
      '{{', '=', '#', '}}',
      '{{', '#def', 'snippet', '}}',
      '<div>haha</div>'
    ]
    const result = parseAst(tokens)
    expect(getNodes(result)).to.deep.equal(['Expression', 'Expression', 'Expression', 'Expression', 'Expression', 'Expression'])
    expect(result.children.map(c => (c as ExpressionNode).subType)).to.deep.equal([
      'Bind', 'Scalar', 'Bind', 'Scalar', 'Escape', 'Scalar'
    ])
    judgeNodes(result)
  })

  it('should parse "#" expression with param', () => {
    const tokens = [
      '{{', '##def', 'snippet:', 'param:',
      '<div>', '{{', '=', 'it.name', '}}',
      '</div>', '{{', '!', 'it.joke', '}}', '#', '}}',
      '{{', '#def', 'snippet', '}}'
    ]
    const result = parseAst(tokens)
    expect(getNodes(result)).to.deep.equal(['Expression', 'Expression', 'Expression', 'Expression'])
    expect(result.children.map(c => (c as ExpressionNode).subType)).to.deep.equal([
      'Scalar', 'Bind', 'Scalar', 'Escape'
    ])
    judgeNodes(result)
  })

  it('should parse "#" expression in other block', () => {
    const tokens = [
      '{{', '##def', 'snippet:', 'param:',
      '<div>', '{{', '=', 'it.name', '}}',
      '</div>', '{{', '!', 'it.joke', '}}', '#', '}}',
      '{{', '~', 'it.arr', ':', 'value', '}}',
        '{{', '?', 'it.a', '}}',
        '{{', '??', 'it.b', '}}',
        '{{', '??', '}}',
        '{{', '#def', 'snippet', '}}',
        ' ', '{{', '?', '}}',
      '{{', '~', '}}'
    ]
    const result = parseAst(tokens)
    expect(getNodes(result)).to.deep.equal(['Loop'])
    expect(result.children[0].children.map(c => (c as ExpressionNode).subType)).to.deep.equal([
      'If', 'ElseIf', 'Else'
    ])
    expect(result.children[0].children[2].children.map(c => (c as ExpressionNode).subType)).to.deep.equal([
      'Scalar', 'Bind', 'Scalar', 'Escape', 'Scalar'
    ])
    judgeNodes(result)
  })
})

function getNodes(node: Node) {
  return node.children.map(r => r.type)
}

function judgeNodes(root: Node) {
  let current: Node | null = _.first(root.children)
  if (root.children.length) {
    _.forEach(root.children, child => judgeNodes(child))
  }
  while (current) {
    const next: Node | null = current.next
    if (next) {
      expect(next.prev).to.equal(current)
    }
    current = next
  }
}
