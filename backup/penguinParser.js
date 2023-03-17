"use strict";
exports.__esModule = true;
exports.parse = void 0;
function createNode(type) {
    return { type: type };
}
function parse(tokens) {
    var current = 0;
    function walk() {
        var token = tokens[current];
        if (token.type === 'IDENTIFIER') {
            current++;
            return createNode('Identifier');
        }
        if (token.type === 'STRING') {
            current++;
            return createNode('StringLiteral');
        }
        if (token.type === 'LPAREN') {
            token = tokens[++current];
            var node = createNode('CallExpression');
            node.name = token.value;
            node.params = [];
            token = tokens[++current];
            while (token.type !== 'RPAREN') {
                node.params.push(walk());
                token = tokens[current];
            }
            current++;
            return node;
        }
        throw new Error("Unexpected token type: ".concat(token.type));
    }
    var ast = createNode('Program');
    ast.body = [];
    while (current < tokens.length) {
        ast.body.push(walk());
    }
    return ast;
}
exports.parse = parse;
