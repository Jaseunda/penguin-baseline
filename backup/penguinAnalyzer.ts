import { Token } from './token';

export function analyze(tokens: Token[]): void {
  // In this basic implementation, we'll just check for unresolved references
  // You should expand this to perform more advanced semantic analysis
  const importedIdentifiers: Set<string> = new Set();
  const definedIdentifiers: Set<string> = new Set();

  for (const token of tokens) {
    if (token.type === 'IMPORT') {
      const nextToken = tokens[tokens.indexOf(token) + 1];
      if (nextToken.type === 'IDENTIFIER') {
        importedIdentifiers.add(nextToken.value);
      }
    }

    if (token.type === 'DEF') {
      const nextToken = tokens[tokens.indexOf(token) + 1];
      if (nextToken.type === 'IDENTIFIER') {
        definedIdentifiers.add(nextToken.value);
      }
    }

    if (token.type === 'IDENTIFIER') {
      if (!importedIdentifiers.has(token.value) && !definedIdentifiers.has(token.value)) {
        throw new Error(`Unresolved reference at line ${token.line}: ${token.value}`);
      }
    }
  }
}
