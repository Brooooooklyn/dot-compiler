import tokenizer from './tokenizer'

export type State = 'BEGIN' |
  'EXPERSSION_START' |
  'EXPERSSION_END' |
  'BLOCK_START' |
  'BLOCK_END' |
  'END'

export default function parser (content: string) {
  const tokenTree = tokenizer(content)
  return tokenTree
}
