import { readFileSync, writeFileSync } from 'fs';
import { tokenize } from './penguinLexer';
import { parse } from './penguinParser';
import { analyze } from './penguinAnalyzer';
import { generateCode } from './penguinCodeGen';

function compile(inputFile: string, outputFile: string): void {
  const code = readFileSync(inputFile, { encoding: 'utf-8' });
  const tokens = tokenize(code);
  const ast = parse(tokens);
  analyze(tokens);
  const generatedCode = generateCode(tokens);
  writeFileSync(outputFile, generatedCode);
}

const inputFile = process.argv[2] || 'index.penguin';
const outputFile = process.argv[3] || 'output.ts';

compile(inputFile, outputFile);
