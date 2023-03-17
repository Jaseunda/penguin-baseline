import { PenguinCompiler } from './penguinCompiler';
import fs from 'fs';
import path from 'path';

const samplePath = path.join(__dirname, '..', 'anatomy'); // Replace with the path to your sample directory
const outputPath = path.join(__dirname, '..', 'penguinApp'); // Replace with the path to your Expo project's source directory

const penguinFiles = fs.readdirSync(samplePath).filter(file => file.endsWith('.penguin'));
const skinFiles = fs.readdirSync(samplePath).filter(file => file.endsWith('.skin'));
const brainFiles = fs.readdirSync(samplePath).filter(file => file.endsWith('.brain'));

const compiler = new PenguinCompiler();

penguinFiles.forEach((penguinFile) => {
  const baseName = path.basename(penguinFile, '.penguin');

  // Change the conditions in the find method to match your desired naming convention
  const skinFile = skinFiles.find((file) => path.basename(file, '.skin') === 'styles');
  const brainFile = brainFiles.find((file) => path.basename(file, '.brain') === 'function');

  if (!skinFile || !brainFile) {
    console.error(`Corresponding skin or brain file not found for ${penguinFile}`);
    console.error(`Skin files:`, skinFiles);
    console.error(`Brain files:`, brainFiles);
    return;
  }

  const penguinFilePath = path.join(samplePath, penguinFile);
  const skinFilePath = path.join(samplePath, skinFile);
  const brainFilePath = path.join(samplePath, brainFile);

  const outputDirectory = path.join(outputPath, baseName);

  compiler.compile(penguinFilePath, skinFilePath, brainFilePath, outputDirectory);
});