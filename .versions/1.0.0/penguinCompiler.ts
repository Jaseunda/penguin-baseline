import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, Stats } from 'fs';
import { join, dirname } from 'path';
import { tokenize } from './penguinLexer';
import { parse } from './penguinParser';
import { analyze } from './penguinAnalyzer';
import { generateCode } from './penguinCodeGen';
import { compileSkin } from './anatomy/skinCompiler';
import { compileBrain } from './anatomy/brainCompiler';
import chalk from 'chalk';
import { performance } from 'perf_hooks';
import * as readline from 'readline';

let chalkInstance: any;

(async () => {
  chalkInstance = (await import('chalk')).default;
})();


async function printFileTree(directory: string, level = 0): Promise<void> {
  const entries = readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = join(directory, entry.name);

    console.log('  '.repeat(level) + entry.name);

    if (entry.isDirectory()) {
      await printFileTree(entryPath, level + 1);
    }
  }
}

async function compile(inputFile: string, outputFile: string, progressBar: ProgressBar): Promise<void> {
  try {
    const code = readFileSync(inputFile, { encoding: 'utf-8' });

    let generatedCode = '';

    if (inputFile.endsWith('.penguin')) {
      const tokens = tokenize(code);
      const ast = parse(tokens);
      analyze(tokens); // Pass the tokens instead of AST
      generatedCode = generateCode(tokens); // Pass the tokens instead of AST
    } else if (inputFile.endsWith('.skin')) {
      generatedCode = compileSkin(code);
    } else if (inputFile.endsWith('.brain')) {
      generatedCode = compileBrain(code);
    } else {
      throw new Error(`File has been skipped. Check the documentation for more details: ${inputFile}`);
    }

    const outputDir = dirname(outputFile);
    if (!statSync(outputDir).isDirectory()) {
      mkdirSync(outputDir, { recursive: true });
    }

    writeFileSync(outputFile, generatedCode);
    progressBar.tick();

    // Clear the console and display the progress bar
    console.clear();
    console.log(progressBar.toString());

    console.log(chalk.green(`✓ Compiled: ${inputFile}`));
  } catch (error) {
    console.error('Error while compiling:', (error as Error).message);
  }
}



async function compileDirectory(inputDirectory: string, outputDirectory: string, progressBar: ProgressBar): Promise<void> {
  const entries = readdirSync(inputDirectory, { withFileTypes: true });

  for (const entry of entries) {
    const inputPath = join(inputDirectory, entry.name);
    const outputPath = join(outputDirectory, entry.name);

    if (entry.isDirectory()) {
      await compileDirectory(inputPath, outputPath, progressBar);
    } else if (entry.isFile()) {
      const extension = inputPath.split('.').pop()?.toLowerCase() || '';

      if (['penguin', 'skin', 'brain'].includes(extension)) {
        await compile(inputPath, outputPath.replace(`.${extension}`, '.ts'), progressBar);
      } else {
        // Clear the console and display the progress bar
        console.clear();
        console.log(progressBar.toString());

        console.log(chalk.yellow(`⚠️ Skipped unsupported file: ${inputPath}`));
      }
    }
  }
}



function countFiles(inputDirectory: string): number {
  const entries = readdirSync(inputDirectory, { withFileTypes: true });

  let fileCount = 0;

  for (const entry of entries) {
    const inputPath = join(inputDirectory, entry.name);

    if (entry.isDirectory()) {
      fileCount += countFiles(inputPath);
    } else if (entry.isFile()) {
      const extension = inputPath.split('.').pop()?.toLowerCase() || '';

      if (['penguin', 'skin', 'brain'].includes(extension)) {
        fileCount++;
      }
    }
  }

  return fileCount;
}

function getUserInput(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
}

const inputDirectory = process.argv[2] || '.';
const outputDirectory = process.argv[3] || 'dist';

(async () => {
  console.log('File structure:');
  await printFileTree(inputDirectory);
  console.log('\n');

  const totalFiles = countFiles(inputDirectory);

  const progressBar = new ProgressBar('Compiling [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: totalFiles,
  });

  await compileDirectory(inputDirectory, outputDirectory, progressBar);

  const userInput = await getUserInput('Enter any input after compilation: ');
  console.log(`User input: ${userInput}`);
})();

