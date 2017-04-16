
export const tokens = {
  OPEN_CURLY: '{',
  CLOSE_CURLY: '}',

  COLON: ':',
  EXP_IF: '?',
  EXP_LOOP: '~',
  ESCAPE_BIND: '!',
  BIND: '=',
  SNIPPET: '#'
}

export const tokensArray: string[] = Object.keys(tokens).map(k => tokens[k])

export const NORMAL_OPERATOR_ARR: string[] = [
  tokens.ESCAPE_BIND,
  tokens.BIND
]
