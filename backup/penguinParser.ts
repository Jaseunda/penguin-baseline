import { Token, TokenType } from './token';

interface Node {
  type: string;
  [key: string]: any;
}

function createNode(type: string): Node {
  return { type };
}

export function parse(tokens: Token[]): Node {
  let current = 0;

  function walk(): Node {
    let token = tokens[current];

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

      const node = createNode('CallExpression');
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

    throw new Error(`Unexpected token type: ${token.type}`);
  }

  const ast = createNode('Program');
  ast.body = [];

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}
