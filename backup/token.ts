export type TokenType =
  | 'COMMENT'
  | 'IMPORT'
  | 'FROM'
  | 'DEF'
  | 'ARROW'
  | 'NONE'
  | 'INDENT'
  | 'IDENTIFIER'
  | 'EQUALS'
  | 'COMMA'
  | 'LPAREN'
  | 'RPAREN'
  | 'LBRACKET'
  | 'RBRACKET'
  | 'STRING'
  | 'WHITESPACE'
  | 'NEWLINE';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
}
