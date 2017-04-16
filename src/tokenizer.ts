import { forEach } from 'lodash'
import { tokens, NORMAL_OPERATOR_ARR, tokensArray } from './token'

let tokenStack: string[] = []
let content = ''

export default function tokenizer (input: string, currentPos = 0): string[] {
  content = input
  const current = content.charAt(currentPos)
  const { length } = content
  if (current === tokens.OPEN_CURLY) {
    currentPos = readOpenCurly(currentPos)
  } else if (current === tokens.CLOSE_CURLY) {
    currentPos = readCloseCurly(currentPos)
  } else if (current === tokens.SNIPPET) {
    currentPos = readSnippet(currentPos)
  } else if (current === tokens.EXP_IF) {
    currentPos = readIf(currentPos)
  } else if (current === tokens.EXP_LOOP) {
    currentPos = readLoop(currentPos)
  } else if (NORMAL_OPERATOR_ARR.indexOf(current) !== -1) {
    tokenStack.push(current)
    currentPos += 1
  } else {
    currentPos = readExpression(currentPos)
  }

  if (currentPos === length) {
    const result = tokenStack
    tokenStack = []
    return result
  }
  return tokenizer(content, currentPos)
}

function readOpenCurly (pos: number, token = ''): number {
  const current = content.charAt(pos)
  if (token.length < 2) {
    token = token += current
    pos += 1
    return readOpenCurly(pos, token)
  }
  tokenStack.push(token)
  return pos
}

function readExpression (pos: number, token = ''): number {
  const current = content.charAt(pos)
  const { length } = content
  if (
    pos !== length &&
    current !== tokens.CLOSE_CURLY &&
    current !== tokens.OPEN_CURLY &&
    current !== tokens.SNIPPET &&
    current !== tokens.COLON
  ) {
    pos ++
    token += current
    return readExpression(pos, token)
  }
  tokenStack.push(token)
  return pos
}

function readCloseCurly (pos: number, token = ''): number {
  const current = content.charAt(pos)
  if (token.length < 2) {
    token += current
    pos += 1
    return readOpenCurly(pos, token)
  }
  tokenStack.push(token)
  return pos
}

function readIf (pos: number): number | never {
  const next = content.charAt(pos + 1)
  if (next === tokens.EXP_IF) {
    tokenStack.push('??')
    return pos + 2
  } else if (Math.abs(tokensArray.indexOf(next)) !== 1) {
    return throwError(`unexpected token at ?${next}`)
  } else {
    tokenStack.push('?')
    return pos + 1
  }
}

function readLoop (pos: number, tmpStack: string[] = [], token = ''): number | never {
  if (tmpStack.length > 5) {
    return throwError(`unexpected token at loop expression: ${tmpStack.join('')} ^^^^^`)
  }
  const current = content.charAt(pos)
  if (notEquals(current, [tokens.EXP_LOOP, tokens.COLON, tokens.CLOSE_CURLY])) {
    return throwError(`unexpected token at ${token}^^^^^`)
  }
  if (current === tokens.CLOSE_CURLY) {
    if (tmpStack.length) {
      forEach(tmpStack, v => {
        tokenStack.push(v)
      })
    }
    if (token.length) {
      tokenStack.push(token)
    }
    return pos
  } else if (current === tokens.EXP_LOOP) {
    tmpStack.push(current)
    return readLoop(pos + 1, tmpStack)
  } else if (current === tokens.COLON) {
    tmpStack.push(token)
    tmpStack.push(current)
    return readLoop(pos + 1, tmpStack)
  } else {
    return readLoop(pos + 1, tmpStack, token + current)
  }
}

function readSnippet (pos: number): number | never {
  const next = content.charAt(pos + 1)
  if (next === tokens.SNIPPET) {
    const DEF = content.substring(pos + 2, pos + 6)
    if (DEF === 'def.') {
      tokenStack.push('##def')
      return readSnippetDef(pos + 6)
    }
    return throwError(`unexpected token at {{## ^^^^^ ${DEF}, expected 'def.'`)
  } else {
    if (next === tokens.CLOSE_CURLY) {
      tokenStack.push(tokens.SNIPPET)
      return pos + 1
    } else if (content.substring(pos + 1, pos + 5) === 'def.') {
      tokenStack.push('#def')
      return pos + 5
    } else {
      return throwError(`unexpected token at {# ^^^^^ ${next}, expected 'def.' or '}}'`)
    }
  }
}

function readSnippetDef (pos: number, tmpStack: string[] = [], token = ''): number | never {
  if (tmpStack.length > 2) {
    return throwError(`unexpected token in snippetDef at "${tmpStack.join('')} ^^^^^"`)
  }
  const current = content.charAt(pos)
  if (current === tokens.COLON) {
    tmpStack.push(token + current)
    const next = content.charAt(pos + 1)
    if (tokensArray.indexOf(next) >= 0) {
      throwError(`unexpected token at: ##def.${token}: ^^^^^ ${next}`)
    }
    return readSnippetDef(pos + 1, tmpStack)
  } else if (tokensArray.indexOf(current) >= 0) {
    if (tmpStack.length) {
      forEach(tmpStack, v => tokenStack.push(v))
    }
    return pos - token.length
  } else {
    return readSnippetDef(pos + 1, tmpStack, token + current)
  }
}

function throwError (msg: string): never {
  content = ''
  tokenStack = []
  throw new TypeError(msg)
}

function notEquals(input: string, exclude: string[]) {
  return tokensArray.indexOf(input) >= 0 && exclude.indexOf(input) === -1
}
