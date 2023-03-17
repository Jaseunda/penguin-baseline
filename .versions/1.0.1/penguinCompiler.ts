import fs from 'fs';
import path from 'path';
import { BrainParser } from './parser/brain';
import { SkinParser } from './parser/skin';
import { parsePenguinFile } from './parser/pegnuin';

export class PenguinCompiler {
  private brainParser: BrainParser;
  private skinParser: SkinParser;
  private penguinParser: typeof parsePenguinFile;

  constructor() {
    this.brainParser = new BrainParser();
    this.skinParser = new SkinParser();
    this.penguinParser = parsePenguinFile;
  }

  compile(penguinFile: string, skinFile: string, brainFile: string, outputPath: string) {
    const appTsxContent = this.penguinParser(penguinFile);
    const stylesTsContent = this.skinParser.parseSkin(skinFile);
    const functionsTsContent = this.brainParser.parseBrain(brainFile);

    const appTsxOutputPath = path.join(outputPath, path.basename(penguinFile, '.penguin') + '.tsx');
    const stylesTsOutputPath = path.join(outputPath, path.basename(skinFile, '.skin') + '.ts');
    const functionsTsOutputPath = path.join(outputPath, path.basename(brainFile, '.brain') + '.ts');

    // Create directories if they don't exist
    fs.mkdirSync(outputPath, { recursive: true });

    fs.writeFileSync(appTsxOutputPath, appTsxContent);
    fs.writeFileSync(stylesTsOutputPath, stylesTsContent);
    fs.writeFileSync(functionsTsOutputPath, functionsTsContent);
  }
}
