"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PenguinParser = void 0;
const fs_1 = __importDefault(require("fs"));
class PenguinParser {
    parsePenguin(filename) {
        return fs_1.default.readFileSync(filename, 'utf8');
    }
    parseSkin(filename) {
        return fs_1.default.readFileSync(filename, 'utf8');
    }
    parseBrain(filename) {
        return fs_1.default.readFileSync(filename, 'utf8');
    }
}
exports.PenguinParser = PenguinParser;
