import { Node } from './Node'

let i = 0

export class ExpressionNode extends Node {

  i = i++
  type = 'Expression'

  // expression in Snippet
  param: string | undefined

  paramName: string | undefined
  constructor(
    public subType: 'Scalar' | 'Bind' | 'Escape' | 'Exp',
    public parent: Node,
    private content: string | null,
  ) {
    super()
  }

  pipe(origin: string) {
    const result = super.pipe(origin)
    if (typeof this.param === 'string' && typeof this.paramName === 'string') {
      return result.replace(new RegExp(`${this.paramName}`, 'gm'), this.param)
    } else {
      return result
    }
  }

  toString() {
    let result = ''
    const { subType, parent, next, prev } = this
    if (next && next.type === 'Expression' && (next as ExpressionNode).subType === 'Scalar' && this.subType === 'Scalar') {
      if ((next as ExpressionNode).content === ' ') {
        this.content = this.content + ' ';
        (next as ExpressionNode).content = null
      }
      if (this.content === ' ') {
        (next as ExpressionNode).content = ' ' + (next as ExpressionNode).content
        this.content = ''
      }
    }

    if (this.content === null) {
      if (prev === null) {
        if (next !== null) {
          next.prev = null
          this.next = null
        }
      }
      if (next === null || next.type !== 'Expression' || (next as ExpressionNode).subType === 'Exp') {
        result += ';'
      }
      return result
    }

    if (subType === 'Scalar') {
      result = `'${this.content.replace(/\'/gm, `\\'`)}'`
    } else if (subType === 'Bind') {
      result = `(${this.content})`
    } else if (subType === 'Escape') {
      result = `encodeHTML(${this.content})`
    } else if ( subType === 'Exp') {
      result = this.content
    } else {
      throw new TypeError('not a valid subType in ExpressionNode, expect Scalar or Lambda')
    }
    if (this.prev === null) {
      if (subType !== 'Exp') {
        if (parent.type === 'Root') {
          if (subType === 'Bind' || subType === 'Escape') {
            result = `''+` + result
          }
        } else {
          if (subType === 'Bind' || subType === 'Escape') {
            result = `out+=''+` + result
          } else {
            result = 'out+=' + result
          }
        }
      } else {
        if (parent.type === 'Root') {
          result = `'';` + result
        }
      }
    } else if (this.prev.type === 'Expression') {
      if (subType !== 'Exp') {
        if ((this.prev as ExpressionNode).subType === 'Exp') {
          result = 'out+=' + result
        } else {
          result = '+' + result
        }
      }
    } else {
      if (subType === 'Bind' || subType === 'Escape') {
        result = `out+=''+` + result
      } else {
        result = 'out+=' + result
      }
    }

    if (next === null) {
      if (subType !== 'Exp') {
        result += ';'
      }
    } else {
      if (
        ((next.type === 'Expression') && (next as ExpressionNode).subType === 'Exp') ||
        (next.type !== 'Expression')
      ) {
        if (subType !== 'Exp') {
          result += ';'
        }
      }
    }

    return result
  }
}
