
import { Node } from './Node'
import { SnippetNode } from './Snippet'
import tpls from './tpls'

export class RootNode extends Node {
  type = 'Root'
  parent = null as any

  hasEscape = false
  private snippetNodes = new Map<string, SnippetNode>()

  addChild(node: Node) {
    if (node.type === 'Snippet') {
      this.snippetNodes.set((node as SnippetNode).name, <SnippetNode>node)
      return node
    } else {
      return super.addChild(node)
    }
  }

  getSnippet(name: string): SnippetNode | void {
    if (this.snippetNodes.has(name)) {
      return this.snippetNodes.get(name)
    }
  }

  toString() {
    const head = `function anonymous(it /**/) {${this.hasEscape ? tpls.encode : ''}var out=`
    return head + this.getChildContent() + 'return out;}'
  }
}
