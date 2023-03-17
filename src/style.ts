import { Token } from './lexer';
import { RuntimeError } from './error';

export class Style {
  private properties: Map<string, string> = new Map();

  constructor(private name: Token) {}

  setProperty(name: string, value: string) {
    this.properties.set(name, value);
  }

  getProperty(name: string): string | undefined {
    return this.properties.get(name);
  }

  toString() {
    let str = '';
    str += `.${this.name.lexeme} {\n`;
    for (const [name, value] of this.properties) {
      str += `  ${name}: ${value};\n`;
    }
    str += '}';
    return str;
  }
}
