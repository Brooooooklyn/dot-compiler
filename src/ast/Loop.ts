import { Node } from './Node'

export class LoopNode extends Node {
  type = 'Loop'

  constructor(
    public variable: string,
    public parent: Node,
    private valName: string,
    private count: string,
    private indexName = `i${count}`
  ) {
    super()
  }

  toString() {
    const { valName, indexName, prev, parent, count } = this
    let result = `var arr${count}=${this.variable};if(arr${count}){var ${valName},${indexName}=-1,l${count}=arr${count}.length-1;`
    result += `while(${indexName}<l${count}){${valName}=arr${count}[${indexName}+=1];${this.getChildContent()}}}`
    if (parent.type === 'Root') {
      if (prev === null) {
        result = `'';` + result
      }
    }
    return result
  }
}
