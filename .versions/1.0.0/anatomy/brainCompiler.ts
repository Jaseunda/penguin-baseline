export function compileBrain(brainCode: string): string {
    const lines = brainCode.split('\n');
  
    let output = '';
  
    for (const line of lines) {
      if (line.startsWith('def ')) {
        output += 'export function ';
        output += line.slice(4);
      } else {
        output += line;
      }
  
      output += '\n';
    }
  
    return output;
  }
  