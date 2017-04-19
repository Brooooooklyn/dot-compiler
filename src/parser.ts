import tokenizer from './tokenizer'
import parseAst from './ast'
import { RootNode } from './ast/Root'

export default function parser (content: string): RootNode {
  const tokens = tokenizer(content)
  return parseAst(tokens)
}
