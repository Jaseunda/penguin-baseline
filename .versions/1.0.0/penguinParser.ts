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

  function walk(parentNode: Node | null = null): Node | null | undefined {
    let token = tokens[current];

    while (token.type === 'NONE') {
      current++;
      token = tokens[current];
    }

    if (token.type === 'NEWLINE') {
      current++;
      return null;
    }

    if (token.type === 'ARROW') {
      current++;
      return createNode('ArrowFunction');
    }

    if (token.type === 'IDENTIFIER') {
      const identifierNode = createNode('Identifier');
      identifierNode.value = token.value;
      current++;
      return identifierNode;
    }

    if (token.type === 'STRING') {
      current++;
      return createNode('StringLiteral');
    }

    if (token.type === 'IMPORT') {
      current++;

      const node = createNode('ImportStatement');
      node.value = tokens[current].value;

      current++; // Consume the imported path token

      return node;
    }

    if (token.type === 'DEF' && parentNode && parentNode.type === 'FunctionDefinition') {
      const nestedFunctionNode = walk(parentNode);
      if (nestedFunctionNode) {
        return nestedFunctionNode;
      }
    }

    // Rest of the code

  }

  const ast = createNode('Program');
  ast.body = [];

  while (current < tokens.length) {
    const node = walk();
    if (node) {
      ast.body.push(node);
    }
  }

  return ast;
}
