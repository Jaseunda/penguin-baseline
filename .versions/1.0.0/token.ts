export type TokenType =
  | 'COMMENT'
  | 'IMPORT'
  | 'FROM'
  | 'DEF'
  | 'DOT'
  | 'END'
  | 'ARROW'
  | 'NONE'
  | 'INDENT'
  | 'IDENTIFIER'
  | 'EQUALS'
  | 'COLON'
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