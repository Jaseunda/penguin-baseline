import * as fs from 'fs';
import * as path from 'path';
import { parse } from './parser';
import { Runtime } from './runtime';
import { Token } from './lexer';
import { PenguinError } from './error';

export function compile(source: string, outputDir: string) {
  try {
    const ast = parse(source);
    const runtime = new Runtime();
    const compiledCode = runtime.compile(ast);
    const outputFile = path.join(outputDir, 'main.js');
    fs.writeFileSync(outputFile, compiledCode);
    console.log(`Successfully compiled to ${outputFile}`);
  } catch (error) {
    if (error instanceof PenguinError) {
      console.error(`Error: ${error.message} at line ${error.token.line}`);
    } else {
      console.error(error.message);
    }
  }
}
