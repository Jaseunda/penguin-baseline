import fs from 'fs';

export function parsePenguinFile(penguinFilePath: string) {
  const penguinCode = fs.readFileSync(penguinFilePath, 'utf8');
  return parsePenguin(penguinCode);
}

export function parsePenguin(penguinCode: string) {
  const lines = penguinCode.split('\n');
  const outputLines: string[] = [];

  outputLines.push("import React from 'react';");
  outputLines.push("import { View, Text } from 'react-native';");

  let inComponent = false;

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('import ')) {
      outputLines.push(`import ${trimmedLine.slice(6).trim()};`);
    } else if (trimmedLine.startsWith('require ')) {
      const module = trimmedLine.slice(7).trim();
      outputLines.push(`import ${module} from '${module}';`);
    } else if (trimmedLine.startsWith('view ')) {
      inComponent = true;
      const componentName = trimmedLine.slice(4).trim();
      outputLines.push(`const ${componentName} = () => {`);
      outputLines.push('  return (');
    } else if (trimmedLine === '}') {
      if (inComponent) {
        outputLines.push('  );');
        outputLines.push('};');
        outputLines.push('');
        outputLines.push('export default App;');
        inComponent = false;
      }
    } else if (inComponent) {
      const jsxLine = trimmedLine
        .replace(/<(\w+)([^>]*)style=([^>]+)>/g, '<$1$2 style={$3}>')
        .replace(/{'\n\n'}/g, '{\'\\n\\n\'}')
        .replace(/{'\n'}/g, '{\'\\n\'}');
      outputLines.push(`    ${jsxLine}`);
    }
  });

  return outputLines.join('\n');
}
