import { Node } from './Node'
import { RootNode } from './Root'
import { ExpressionNode } from './Expression'
import { LoopNode } from './Loop'
import { IFNode } from './IF'
import { SnippetNode } from './Snippet'

let currentNode: Node
let tokens: string[]
let length: number
let root: RootNode
let loopCount = 0

export default function parseAst (tks: string[]) {
  root = new RootNode()
  currentNode = root
  tokens = tks
  length = tks.length
  walk(0)
  currentNode = (null as any)
  tokens = (null as any)
  length = (null as any)
  const result = root
  root = (null as any)
  loopCount = 0
  return result
}

function walk(position: number) {
  const current = tokens[position]
  let currentPostion: number
  if (current === '{{') {
    currentPostion = walkCurly(position)
  } else if (current === '#') {
    currentPostion = walkSnippetEnd(position)
  } else {
    currentPostion = walkExpression(position)
  }
  if (currentPostion < length) {
    walk(currentPostion)
  }
}

function walkExpression(position: number): number {
  const current = tokens[position]
  const next = tokens[position + 1]
  if (next === '{{' || next === '}}' || next === '#' || !next) {
    if (current.length > 0) {
      currentNode.addChild(new ExpressionNode('Scalar', currentNode, current))
    }
    return position + 1
  }
  return throwError(`unexpected token at ${current} ^^^^^`)
}

function walkCurly(position: number): number {
  const nextPos = position + 1
  const next = tokens[nextPos]
  if (next) {
    if (next === '=') {
      return walkBind(nextPos)
    }
    if (next === '!') {
      return walkEscape(nextPos)
    }
    if (next === '~') {
      return walkLoop(nextPos)
    }
    if (next === '?') {
      return walkIf(nextPos)
    }
    if (next === '??') {
      return walkElse(nextPos)
    }
    if (next === '##def') {
      return walkSnippetDef(nextPos)
    }
    if (next === '#def') {
      return walkSnippet(nextPos)
    }
    const nextTwo = tokens[position + 2]
    if (nextTwo) {
      if (nextTwo === '}}') {
        currentNode.addChild(new ExpressionNode('Exp', currentNode, next))
        return position + 3
      } else {
        return throwError(`unexpected token at ${next} ^^^^^ ${nextTwo}, expect: "}}"`)
      }
    } else {
      currentNode.addChild(new ExpressionNode('Scalar', currentNode, tokens[position] + next))
      return position + 2
    }
  } else {
    currentNode.addChild(new ExpressionNode('Scalar', currentNode, '{{'))
    return nextPos
  }
}

function walkBind(position: number): number {
  let nextPos = position + 1
  let next = tokens[nextPos]
  if (!next) {
    currentNode.addChild(new ExpressionNode('Scalar', currentNode, '{{='))
    return nextPos
  }
  nextPos += 1
  next = tokens[nextPos]
  if (!next) {
    currentNode.addChild(new ExpressionNode('Scalar', currentNode, `{{=${tokens[nextPos]}`))
    return nextPos
  }
  if (next === '}}') {
    currentNode.addChild(new ExpressionNode('Bind', currentNode, tokens[nextPos - 1]))
    return nextPos + 1
  }
  return throwError(`unexpected token at ${tokens[position]} ^^^^^`)
}

function walkEscape(position: number): number {
  let nextPos = position + 1
  let next = tokens[nextPos]
  if (!next) {
    currentNode.addChild(new ExpressionNode('Scalar', currentNode, '{{!'))
    return nextPos
  }
  nextPos += 1
  next = tokens[nextPos]
  if (!next) {
    currentNode.addChild(new ExpressionNode('Scalar', currentNode, `{{!${tokens[nextPos]}`))
    return nextPos
  }
  if (next === '}}') {
    currentNode.addChild(new ExpressionNode('Escape', currentNode, tokens[position + 1]))
    return nextPos + 1
  }
  return throwError(`unexpected token at ${tokens[position]} ^^^^^`)
}

function walkLoop(position: number): number {
  let nextPos = position + 1
  let next = tokens[nextPos]
  if (!next) {
    currentNode.addChild(new ExpressionNode('Scalar', currentNode, '{{~'))
    return nextPos
  }
  if (next === '}}') {
    if (currentNode.type !== 'Loop') {
      return throwError(`unexpected token at ^^^^^ ${tokens[position]}}}`)
    }
    currentNode = currentNode.parent
    return nextPos + 1
  }
  const loopTokenStack = [ tokens[position] ]
  while (next !== '}}' && nextPos < length) {
    next = tokens[nextPos]
    loopTokenStack.push(next)
    nextPos ++
  }
  loopTokenStack.pop()
  if (loopTokenStack.length === 4 || loopTokenStack.length === 6) {
    currentNode = currentNode.addChild(
      new LoopNode(loopTokenStack[1], currentNode, loopTokenStack[3], (loopCount += 1).toString(), loopTokenStack[5])
    )
    return nextPos
  }
  return throwError(`unexpected token at ${loopTokenStack.join('')} ^^^^^`)
}

function walkIf(position: number): number | never {
  const nextPos = position + 1
  const next = tokens[nextPos]
  if (!next) {
    currentNode.addChild(new ExpressionNode('Scalar', currentNode, tokens[position]))
    return position
  }
  if (next === '}}') {
    if (currentNode.type === 'IF') {
      currentNode = currentNode.parent
      return nextPos + 1
    }
    return throwError(`unexpected token at ^^^^^ ${tokens[position]}}}`)
  }
  const nextTwoPos = nextPos + 1
  const nextTwo = tokens[nextTwoPos]
  if (!nextTwo) {
    currentNode.addChild(new ExpressionNode('Scalar', currentNode, `{{?${next}`))
    return nextTwoPos
  }
  if (nextTwo === '}}') {
    currentNode = currentNode.addChild(new IFNode(currentNode, 'If', next))
    return nextTwoPos + 1
  }
  return throwError(`unexpected token at ${next} ^^^^^ ${nextTwo}`)
}

function walkElse(position: number): number | never {
  const nextPos = position + 1
  const next = tokens[nextPos]
  if (!next) {
    currentNode.addChild(new ExpressionNode('Scalar', currentNode, tokens[position]))
    return nextPos
  }
  if (next === '}}') {
    if (currentNode.type !== 'IF') {
      return throwError(`undexpected token at {{?? ^^^^^ }}`)
    }
    const parent = currentNode.parent
    currentNode = parent.addChild(new IFNode(parent, 'Else'))
    return nextPos + 1
  }
  const nextTwoPos = nextPos + 1
  const nextTwo = tokens[nextTwoPos]
  if (!nextTwo) {
    currentNode.addChild(new ExpressionNode('Scalar', currentNode, `{{??${next}`))
    return nextTwoPos
  }
  if (nextTwo === '}}') {
    currentNode = currentNode.parent.addChild(new IFNode(currentNode.parent, 'ElseIf', next))
    return nextTwoPos + 1
  }
  return throwError(`unexpected token at {{??${next} ^^^^^ ${nextTwo}`)
}

function walkSnippetDef(position: number): number | never {
  const nextPos = position + 1
  const next = tokens[nextPos]
  if (!next) {
    currentNode.addChild(new ExpressionNode('Scalar', currentNode, '{{##def.'))
    return nextPos
  }
  if (next.substr(-1) !== ':') {
    throwError(`unexpected token at {{##def. ^^^ ${next}, expect end with ":"`)
  }
  const nextTwoPos = nextPos + 1
  const nextTwo = tokens[nextTwoPos]
  if (nextTwo.substr(-1) !== ':') {
    currentNode = root.addChild(new SnippetNode(root, currentNode, next.substring(0, next.length - 1)))
    return nextTwoPos
  }
  currentNode = root.addChild(new SnippetNode(root, currentNode, next.substring(0, next.length - 1), nextTwo.substring(0, nextTwo.length - 1)))
  return nextTwoPos + 1
}

function walkSnippet(position: number): number | never {
  const nextPos = position + 1
  const next = tokens[nextPos]
  if (!next) {
    currentNode.addChild(new ExpressionNode('Scalar', currentNode, '{{#def.'))
    return nextPos
  }
  const nextTwoPos = nextPos + 1
  const nextTwo = tokens[nextTwoPos]
  if (nextTwo === '}}') {
    const [ snippetName, param ] = next.split(':')
    const snippet = root.getSnippet(snippetName)
    if (snippet) {
      snippet.param = param
      snippet.mount(currentNode)
      return nextTwoPos + 1
    } else {
      return throwError(`undefined snippet ${next}`)
    }
  }
  return throwError(`unexpected token at {{#def.${next} ^^^^^ ${nextTwo}`)
}

function walkSnippetEnd(position: number): number | never {
  const nextPos = position + 1
  const next = tokens[nextPos]
  if (!next) {
    currentNode.addChild(new ExpressionNode('Scalar', currentNode, '#'))
    return nextPos
  }
  if (next === '}}') {
    if (currentNode.type !== 'Snippet') {
      return throwError(`unexpecetd token at ${tokens[position - 1]} ^^^^^ #}}`)
    }
    currentNode = (currentNode as SnippetNode).lastNode
    return nextPos + 1
  }
  return throwError(`unexpected token at ${tokens[position - 1]}# ^^^^^ ${next}`)
}

function throwError(msg: string): never {
  currentNode = (null as any)
  tokens = (null as any)
  length = (null as any)
  throw new TypeError(msg)
}
