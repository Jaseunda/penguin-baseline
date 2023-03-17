"use strict";
exports.__esModule = true;
exports.analyze = void 0;
function analyze(tokens) {
    // In this basic implementation, we'll just check for unresolved references
    // You should expand this to perform more advanced semantic analysis
    var importedIdentifiers = new Set();
    var definedIdentifiers = new Set();
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (token.type === 'IMPORT') {
            var nextToken = tokens[tokens.indexOf(token) + 1];
            if (nextToken.type === 'IDENTIFIER') {
                importedIdentifiers.add(nextToken.value);
            }
        }
        if (token.type === 'DEF') {
            var nextToken = tokens[tokens.indexOf(token) + 1];
            if (nextToken.type === 'IDENTIFIER') {
                definedIdentifiers.add(nextToken.value);
            }
        }
        if (token.type === 'IDENTIFIER') {
            if (!importedIdentifiers.has(token.value) && !definedIdentifiers.has(token.value)) {
                throw new Error("Unresolved reference at line ".concat(token.line, ": ").concat(token.value));
            }
        }
    }
}
exports.analyze = analyze;
