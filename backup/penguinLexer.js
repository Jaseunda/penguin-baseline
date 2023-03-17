"use strict";
exports.__esModule = true;
exports.tokenize = void 0;
var TOKEN_SPECIFICATION = [
    ['COMMENT', /^#.*/],
    ['IMPORT', /^import\b/],
    ['FROM', /^from\b/],
    ['DEF', /^def\b/],
    ['ARROW', /^->/],
    ['NONE', /^None\b/],
    ['INDENT', /^\n[ \t]+/],
    ['IDENTIFIER', /^[a-zA-Z_][a-zA-Z0-9_]*/],
    ['EQUALS', /^=/],
    ['COMMA', /^,/],
    ['LPAREN', /^\(/],
    ['RPAREN', /^\)/],
    ['LBRACKET', /^\[/],
    ['RBRACKET', /^\]/],
    ['STRING', /^"([^"\\]|\\.)*"/],
    ['WHITESPACE', /^[ \t]+/],
    ['NEWLINE', /^\n/],
];
function tokenize(code) {
    var tokens = [];
    var lineNum = 1;
    var pos = 0;
    while (pos < code.length) {
        var matched = false;
        for (var _i = 0, TOKEN_SPECIFICATION_1 = TOKEN_SPECIFICATION; _i < TOKEN_SPECIFICATION_1.length; _i++) {
            var _a = TOKEN_SPECIFICATION_1[_i], tokenType = _a[0], regex = _a[1];
            var match = code.slice(pos).match(regex);
            if (match) {
                var tokenValue = match[0];
                if (tokenType !== 'WHITESPACE' && tokenType !== 'COMMENT') {
                    tokens.push({ type: tokenType, value: tokenValue, line: lineNum });
                }
                if (tokenType === 'NEWLINE') {
                    lineNum++;
                }
                pos += tokenValue.length;
                matched = true;
                break;
            }
        }
        if (!matched) {
            throw new Error("Unexpected character at line ".concat(lineNum, ": ").concat(code[pos]));
        }
    }
    return tokens;
}
exports.tokenize = tokenize;
