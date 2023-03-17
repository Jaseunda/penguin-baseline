import { compile } from './compiler';
import { run } from './interpreter';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PenguinError } from './error';

function runFile(filePath: string) {
  const source = readFileSync(filePath, 'utf-8');
  compile(source, '.');
  run(join('.', 'main.js'));
}

export function runTests() {
  console.log('Running tests...');
  const testDir = join(__dirname, '..', 'tests');
  const testFiles = [
    'comments.penguin',
    'conditionals.penguin',
    'functions.penguin',
    'loops.penguin',
    'objects.penguin',
    'classes.penguin',
  ];
  for (const file of testFiles) {
    const filePath = join(testDir, file);
    console.log(`Running ${file}`);
    try {
      runFile(filePath);
      console.log(`${file} passed`);
    } catch (error) {
      if (error instanceof PenguinError) {
        console.error(`${file} failed: ${error.message} at line ${error.token.line}`);
      } else {
        console.error(`${file} failed: ${error.message}`);
      }
    }
  }
}
