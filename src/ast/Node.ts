import * as _ from 'lodash'
import { RootNode } from './Root'
import { ExpressionNode } from './Expression'
import { SnippetNode } from './Snippet'

export abstract class Node {
  abstract type: string
  abstract parent: Node

  prev: Node | null = null
  next: Node | null = null

  getChildContent() {
    return _.chain(this.children)
      .map(c => c.pipe(c.toString()))
      .join('')
      .value()
  }

  pipe (origin: string) {
    return origin
  }

  children: Node[] = []

  addChild(child: Node): Node {
    if (this.children.length) {
      const last = _.last(this.children)
      child.prev = last
      last.next = child
    }
    this.children.push(child)
    if (child.type === 'Expression') {
      const paramName = (this as any as SnippetNode).paramName
      const param = (this as any as SnippetNode).param
      if (typeof paramName === 'string') {
        (child as ExpressionNode).paramName = paramName
      }
      if (typeof param === 'string') {
        (child as ExpressionNode).param = param
      }
      if ((child as ExpressionNode).subType === 'Escape') {
        this.findRoot(this).hasEscape = true
      }
    }
    return child
  }

  abstract toString(): string

  private findRoot(node: Node): RootNode {
    if (node.type === 'Root') {
      return node as RootNode
    }
    const parent = node.parent
    if (parent.type === 'Root') {
      return (parent as RootNode)
    }
    return this.findRoot(parent)
  }
}
