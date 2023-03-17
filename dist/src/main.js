"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const penguinCompiler_1 = require("./penguinCompiler");
const penguinFile = 'path/to/sample/main.penguin';
const skinFile = 'path/to/sample/main.skin';
const brainFile = 'path/to/sample/main.brain';
const outputPath = 'path/to/PenguinApp/src'; // Replace with the path to your React Native project's source directory
const compiler = new penguinCompiler_1.PenguinCompiler();
compiler.compile(penguinFile, skinFile, brainFile, outputPath);
