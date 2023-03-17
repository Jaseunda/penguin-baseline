import fs from 'fs';

export class SkinParser {
  parseSkin(filename: string): string {
    const content = fs.readFileSync(filename, 'utf-8');
    const lines = content.split('\n');

    const outputLines = ["import { StyleSheet } from 'react-native';", '', 'const styles = StyleSheet.create({'];

    for (const line of lines) {
      outputLines.push(`  ${line}`);
    }

    outputLines.push('});');
    outputLines.push('');
    outputLines.push('export default styles;');

    return outputLines.join('\n');
  }
}
