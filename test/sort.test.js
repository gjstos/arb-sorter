const fs = require('fs');
const path = require('path');

// Função de sort baseada na lógica da extensão
function sortArb(parsed, type) {
  const globalMeta = {};
  const entries = [];
  for (const key of Object.keys(parsed)) {
    if (key.startsWith('@@')) {
      globalMeta[key] = parsed[key];
    } else if (!key.startsWith('@')) {
      const entry = { key, value: parsed[key] };
      const metaKey = `@${key}`;
      if (parsed.hasOwnProperty(metaKey)) {
        entry.meta = parsed[metaKey];
      }
      entries.push(entry);
    }
  }
  if (type === 'alpha') {
    entries.sort((a, b) => a.key.localeCompare(b.key));
  } else if (type === 'alphaCase') {
    entries.sort((a, b) => a.key.localeCompare(b.key, undefined, { sensitivity: 'case' }));
  } else if (type === 'reverse') {
    entries.sort((a, b) => b.key.localeCompare(a.key));
  } else if (type === 'reverseCase') {
    entries.sort((a, b) => b.key.localeCompare(a.key, undefined, { sensitivity: 'case' }));
  }
  const sorted = { ...globalMeta };
  for (const entry of entries) {
    sorted[entry.key] = entry.value;
    if (entry.meta !== undefined) {
      sorted[`@${entry.key}`] = entry.meta;
    }
  }
  // Adiciona metadados órfãos (sem chave principal)
  for (const key of Object.keys(parsed)) {
    if (key.startsWith('@') && !key.startsWith('@@')) {
      const mainKey = key.slice(1);
      if (!parsed.hasOwnProperty(mainKey)) {
        sorted[key] = parsed[key];
      }
    }
  }
  return sorted;
}

describe('ARB Sorter', () => {
  let example;
  beforeAll(() => {
    const file = fs.readFileSync(path.join(__dirname, 'file_example.arb'), 'utf8');
    example = JSON.parse(file);
  });

  test('Sort Alphabetically (A-Z)', () => {
    const sorted = sortArb(example, 'alpha');
    expect(Object.keys(sorted)).toEqual([
      '@@locale',
      '@@last_modified',
      'abacaxi',
      'Abacaxi',
      'apple', '@apple',
      'banana', '@banana',
      'empty', '@empty',
      'exclam',
      'grape',
      'number1',
      'orange', '@orange',
      'zebra', '@zebra'
    ]);
  });

  test('Sort Alphabetically (A-Z, Case Sensitive)', () => {
    const sorted = sortArb(example, 'alphaCase');
    expect(Object.keys(sorted)).toEqual([
      '@@locale',
      '@@last_modified',
      'abacaxi',
      'Abacaxi',
      'apple', '@apple',
      'banana', '@banana',
      'empty', '@empty',
      'exclam',
      'grape',
      'number1',
      'orange', '@orange',
      'zebra', '@zebra'
    ]);
  });

  test('Sort Reverse (Z-A)', () => {
    const sorted = sortArb(example, 'reverse');
    expect(Object.keys(sorted)).toEqual([
      '@@locale',
      '@@last_modified',
      'zebra', '@zebra',
      'orange', '@orange',
      'number1',
      'grape',
      'exclam',
      'empty', '@empty',
      'banana', '@banana',
      'apple', '@apple',
      'Abacaxi',
      'abacaxi'
    ]);
  });

  test('Sort Reverse (Z-A, Case Sensitive)', () => {
    const sorted = sortArb(example, 'reverseCase');
    expect(Object.keys(sorted)).toEqual([
      '@@locale',
      '@@last_modified',
      'zebra', '@zebra',
      'orange', '@orange',
      'number1',
      'grape',
      'exclam',
      'empty', '@empty',
      'banana', '@banana',
      'apple', '@apple',
      'Abacaxi',
      'abacaxi'
    ]);
  });
}); 