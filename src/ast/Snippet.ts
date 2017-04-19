import * as _ from 'lodash'

import { Node } from './Node'

export class SnippetNode extends Node {

  type = 'Snippet'

  param: string | undefined

  constructor(
    public parent: Node,
    public lastNode: Node,
    public name: string,
    public paramName?: string
  ) {
    super()
  }

  mount(node: Node) {
    _.forEach(this.children, c => {
      node.addChild(c);
      (node as any).param = this.param
      c.parent = node
    })
  }

  toString(): never {
    throw new TypeError(`should not call this`)
  }
}
