"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var penguinLexer_1 = require("./penguinLexer");
var penguinParser_1 = require("./penguinParser");
var penguinAnalyzer_1 = require("./penguinAnalyzer");
var penguinCodeGen_1 = require("./penguinCodeGen");
function compile(inputFile, outputFile) {
    var code = (0, fs_1.readFileSync)(inputFile, { encoding: 'utf-8' });
    var tokens = (0, penguinLexer_1.tokenize)(code);
    var ast = (0, penguinParser_1.parse)(tokens);
    (0, penguinAnalyzer_1.analyze)(tokens);
    var generatedCode = (0, penguinCodeGen_1.generateCode)(tokens);
    (0, fs_1.writeFileSync)(outputFile, generatedCode);
}
var inputFile = process.argv[2] || 'index.penguin';
var outputFile = process.argv[3] || 'output.ts';
compile(inputFile, outputFile);
