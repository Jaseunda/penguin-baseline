"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PenguinCompiler = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const penguinParser_1 = require("./penguinParser");
class PenguinCompiler {
    constructor() {
        this.parser = new penguinParser_1.PenguinParser();
    }
    compile(penguinFile, skinFile, brainFile, outputPath) {
        const appTsxContent = this.parser.parsePenguin(penguinFile);
        const stylesTsContent = this.parser.parseSkin(skinFile);
        const functionsTsContent = this.parser.parseBrain(brainFile);
        // You should implement the conversion from Penguin syntax to React Native syntax
        // for App.tsx, styles.ts, and functions.ts based on the content of the input files.
        fs_1.default.writeFileSync(path_1.default.join(outputPath, 'App.tsx'), appTsxContent);
        fs_1.default.writeFileSync(path_1.default.join(outputPath, 'styles.ts'), stylesTsContent);
        fs_1.default.writeFileSync(path_1.default.join(outputPath, 'functions.ts'), functionsTsContent);
    }
}
exports.PenguinCompiler = PenguinCompiler;
