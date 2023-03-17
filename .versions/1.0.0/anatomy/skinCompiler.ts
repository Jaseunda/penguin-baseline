export function compileSkin(skinCode: string): string {
  const lines = skinCode.split('\n');
  const styleObject: Record<string, string> = {};

  let currentStyle = '';

  for (const line of lines) {
    if (line.endsWith(' = {')) {
      currentStyle = line.slice(0, -4).trim();
      styleObject[currentStyle] = '{';
    } else if (line === '}') {
      styleObject[currentStyle] += '}';
      currentStyle = '';
    } else if (currentStyle) {
      styleObject[currentStyle] += line;
    }
  }

  let output = 'import { StyleSheet } from "react-native";\n\n';
  output += 'export default StyleSheet.create({\n';

  for (const styleName in styleObject) {
    output += `  ${styleName}: ${styleObject[styleName]},\n`;
  }

  output += '});\n';

  return output;
}
