import { Node } from './Node'

export class IFNode extends Node {
  type = 'IF'

  constructor(
    public parent: Node,
    public subType: 'If' | 'Else' | 'ElseIf',
    private expression?: string
  ) {
    super()
  }

  toString() {
    let prefix: string
    if (this.subType === 'If') {
      const exp = `(${this.expression!})`
      prefix = `if${exp}`
    } else if (this.subType === 'Else') {
      prefix = 'else'
    } else if (this.subType === 'ElseIf') {
      const exp = `(${this.expression!})`
      prefix = `else if${exp}`
    } else {
      throw new TypeError(`unexpected subtype in IFNode, expect 'If' 'Else' or 'ElseIf' but got: ${this.subType}`)
    }
    if (this.parent.type === 'Root') {
      if (this.prev === null) {
        prefix = `'';` + prefix
      }
    }
    return `${prefix}{${this.getChildContent()}}`
  }
}
