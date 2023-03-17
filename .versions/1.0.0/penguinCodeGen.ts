import { Token } from './token';

export function generateCode(tokens: Token[]): string {
  let code = '';

  // Iterate through the tokens and generate code based on the token type
  for (const token of tokens) {
    switch (token.type) {
      case 'IMPORT':
        code += `import ${token.value};\n`;
        break;
      case 'IDENTIFIER':
        code += `${token.value}`;
        break;
      case 'DEF':
        code += `function `;
        break;
      case 'ARROW':
        code += ` => `;
        break;
      case 'STRING':
        code += `${token.value}`;
        break;
      case 'EQUALS':
        code += ` = `;
        break;
      case 'COLON':
        code += `: `;
        break;
      case 'COMMA':
        code += `, `;
        break;
      case 'LPAREN':
        code += `( `;
        break;
      case 'RPAREN':
        code += ` )`;
        break;
      case 'LBRACKET':
        code += `[ `;
        break;
      case 'RBRACKET':
        code += ` ]`;
        break;
      case 'NEWLINE':
        code += `\n`;
        break;
      default:
        break;
    }
  }

  return code;
}
