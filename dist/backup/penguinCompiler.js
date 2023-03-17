"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const penguinLexer_1 = require("./penguinLexer");
const penguinParser_1 = require("./penguinParser");
const penguinAnalyzer_1 = require("./penguinAnalyzer");
const penguinCodeGen_1 = require("./penguinCodeGen");
function compile(inputFile, outputFile) {
    const code = (0, fs_1.readFileSync)(inputFile, { encoding: 'utf-8' });
    const tokens = (0, penguinLexer_1.tokenize)(code);
    const ast = (0, penguinParser_1.parse)(tokens);
    (0, penguinAnalyzer_1.analyze)(tokens);
    const generatedCode = (0, penguinCodeGen_1.generateCode)(tokens);
    (0, fs_1.writeFileSync)(outputFile, generatedCode);
}
const inputFile = process.argv[2] || 'index.penguin';
const outputFile = process.argv[3] || 'output.ts';
compile(inputFile, outputFile);
