import { compile } from './compiler';
import { run } from './interpreter';
import { readFileSync } from 'fs';
import { join } from 'path';

export function runExample(example: string) {
  const source = readFileSync(join(__dirname, '..', 'examples', `${example}.penguin`), 'utf-8');
  compile(source, '.');
  run(join('.', 'main.js'));
}
