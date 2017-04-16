Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = require("../lib/tokenizer");
const chai_1 = require("chai");
describe('tokenizer test suit', () => {
    it('should parse nomal experssion', () => {
        const result = tokenizer_1.default(`{{ it.normal }}`);
        chai_1.expect(result).to.deep.equal(['{{', ' it.normal ', '}}']);
    });
    it('should parse "="', () => {
        const result = tokenizer_1.default(`{{= it.normal }}`);
        chai_1.expect(result).to.deep.equal(['{{', '=', ' it.normal ', '}}']);
    });
    it('should parse "!"', () => {
        const result = tokenizer_1.default(`{{! it.normal }}`);
        chai_1.expect(result).to.deep.equal(['{{', '!', ' it.normal ', '}}']);
    });
    it('should parse "?', () => {
        const result = tokenizer_1.default(`{{? it.normal }}<div>123</div>{{?}}`);
        chai_1.expect(result).to.deep.equal(['{{', '?', ' it.normal ', '}}', '<div>123</div>', '{{', '?', '}}']);
    });
    it('should throw error in "?"', () => {
        try {
            tokenizer_1.default(`{{?! it.normal }}<div>123</div>{{?}}`);
            throw 1;
        }
        catch (e) {
            chai_1.expect(e.message).to.equal('unexpected token at ?!');
        }
    });
    it('should parse "??', () => {
        const result = tokenizer_1.default(`{{? it.normal }}<div>123</div>{{?? it.danger}}<span>321</span>{{?}}`);
        chai_1.expect(result).to.deep.equal([
            '{{', '?', ' it.normal ', '}}',
            '<div>123</div>',
            '{{', '??', ' it.danger', '}}',
            '<span>321</span>',
            '{{', '?', '}}'
        ]);
    });
    it('should parse "~"', () => {
        const result = tokenizer_1.default(`{{~ it.array :value:index}}<div>{{=value}}</div>{{~}}`);
        chai_1.expect(result).to.deep.equal([
            '{{', '~', ' it.array ', ':', 'value', ':', 'index', '}}',
            '<div>', '{{', '=', 'value', '}}', '</div>',
            '{{', '~', '}}'
        ]);
    });
    it('should throw unexpected token in "~"', () => {
        const parse = () => tokenizer_1.default(`{{~ it.array :value=index}}<div>{{=value}}</div>{{~}}`);
        chai_1.expect(parse).to.throw(`unexpected token at value^^^^^`);
    });
    it('should throw unexpected token at loop expression in "~"', () => {
        const parse = () => tokenizer_1.default(`{{~ it.array :value:index:whatever}}<div>{{=value}}</div>{{~}}`);
        chai_1.expect(parse).to.throw(`unexpected token at loop expression: ~ it.array :value:index: ^^^^^`);
    });
    it('should parse "#"', () => {
        const result = tokenizer_1.default(`{{##def.snippet:<div>{{=it.name}}</div>{{#def.joke}}#}}{{#def.snippet}}`);
        chai_1.expect(result).to.deep.equal([
            '{{', '##def', 'snippet:',
            '<div>', '{{', '=', 'it.name', '}}',
            '</div>', '{{', '#def', 'joke', '}}', '#', '}}',
            '{{', '#def', 'snippet', '}}'
        ]);
    });
    it('should parse "#" with param', () => {
        const result = tokenizer_1.default(`{{##def.snippet:data:<div>{{=data.name}}</div>{{#def.joke}}#}}{{#def.snippet}}`);
        chai_1.expect(result).to.deep.equal([
            '{{', '##def', 'snippet:', 'data:',
            '<div>', '{{', '=', 'data.name', '}}',
            '</div>', '{{', '#def', 'joke', '}}', '#', '}}',
            '{{', '#def', 'snippet', '}}'
        ]);
    });
    it('should throw unexpected token if "def." not valid in "#"', () => {
        const parse = () => tokenizer_1.default(`{{##deg.snippet:data:<div>{{=data.name}}</div>{{#def.joke}}#}}{{#def.snippet}}`);
        chai_1.expect(parse).to.throw(`unexpected token at {{## ^^^^^ deg., expected 'def.'`);
    });
    it('should throw unexpected token if reference of "def." not valid in "#"', () => {
        const parse = () => tokenizer_1.default(`{{##def.snippet:data:<div>{{=data.name}}</div>{{#def.joke}}#}}{{#deg.snippet}}`);
        chai_1.expect(parse).to.throw(`unexpected token at {# ^^^^^ d, expected 'def.' or '}}'`);
    });
    it('should throw unexpected token in snippet def in "#"', () => {
        const parse = () => tokenizer_1.default(`{{##def.snippet:data:haha:<div>{{=data.name}}</div>{{#def.joke}}#}}{{#def.snippet}}`);
        chai_1.expect(parse).to.throw(`unexpected token in snippetDef at "snippet:data:haha: ^^^^^"`);
    });
    it('should throw unexpected token in snippet def when illegal symbol after ":" in "#"', () => {
        const parse = () => tokenizer_1.default(`{{##def.snippet:~<div>{{=data.name}}</div>{{#def.joke}}#}}{{#def.snippet}}`);
        chai_1.expect(parse).to.throw(`unexpected token at: ##def.snippet: ^^^^^ ~`);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5pemVyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90ZXN0L3Rva2VuaXplci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxnREFBd0M7QUFDeEMsK0JBQTZCO0FBRTdCLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUM5QixFQUFFLENBQUMsK0JBQStCLEVBQUU7UUFDbEMsTUFBTSxNQUFNLEdBQUcsbUJBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1FBQzNDLGFBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUMzRCxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRTtRQUNyQixNQUFNLE1BQU0sR0FBRyxtQkFBUyxDQUFDLGtCQUFrQixDQUFDLENBQUE7UUFDNUMsYUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUNoRSxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRTtRQUNyQixNQUFNLE1BQU0sR0FBRyxtQkFBUyxDQUFDLGtCQUFrQixDQUFDLENBQUE7UUFDNUMsYUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUNoRSxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRTtRQUNwQixNQUFNLE1BQU0sR0FBRyxtQkFBUyxDQUFDLHFDQUFxQyxDQUFDLENBQUE7UUFDL0QsYUFBTSxDQUFDLE1BQU0s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