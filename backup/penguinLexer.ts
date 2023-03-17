import { Token, TokenType } from './token';

const TOKEN_SPECIFICATION: Array<[TokenType, RegExp]> = [
  ['COMMENT', /^#.*/],
  ['IMPORT', /^import\b/],
  ['FROM', /^from\b/],
  ['DEF', /^def\b/],
  ['ARROW', /^->/],
  ['NONE', /^None\b/],
  ['INDENT', /^\n[ \t]+/],
  ['IDENTIFIER', /^[a-zA-Z_][a-zA-Z0-9_]*/],
  ['EQUALS', /^=/],
  ['COMMA', /^,/],
  ['LPAREN', /^\(/],
  ['RPAREN', /^\)/],
  ['LBRACKET', /^\[/],
  ['RBRACKET', /^\]/],
  ['STRING', /^"([^"\\]|\\.)*"/],
  ['WHITESPACE', /^[ \t]+/],
  ['NEWLINE', /^\n/],
];

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let lineNum = 1;
  let pos = 0;

  while (pos < code.length) {
    let matched = false;
    for (const [tokenType, regex] of TOKEN_SPECIFICATION) {
      const match = code.slice(pos).match(regex);
      if (match) {
        const tokenValue = match[0];
        if (tokenType !== 'WHITESPACE' && tokenType !== 'COMMENT') {
          tokens.push({ type: tokenType, value: tokenValue, line: lineNum });
        }
        if (tokenType === 'NEWLINE') {
          lineNum++;
        }
        pos += tokenValue.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      throw new Error(`Unexpected character at line ${lineNum}: ${code[pos]}`);
    }
  }

  return tokens;
}
