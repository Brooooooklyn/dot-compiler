import Parser from './parser'
export default function parse (content: string) {
  Parser(content)
}

const str = `
  {{= it.hello }}
  aa
  <div>123</div>
  {{!it.foo}}
`

const str2 = `{{##def.snippet:
  <div>{{it.a}}</div>
#}}
{{#def.snippet}}`

const str3 = `{{##def.snippet:data:
  <div>{{data.a}}</div>
#}}`

const str4 = `{{~ it.array :value:index}}<div>{{=value}}</div>{{~}}`

parse(str)
parse(str2)
parse(str3)
parse(str4)
