#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { analyzeText } from '../src/index.js';

try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: {
    text: { type: 'string' }, file: { type: 'string' }, wpm: { type: 'string' },
    json: { type: 'boolean' }, help: { type: 'boolean', short: 'h' },
  } });
  if (values.help) {
    console.log('Uso: node bin/cli.js --text "Olá mundo" | --file texto.txt [--wpm 200] [--json]\nTambém aceita texto via stdin.');
  } else {
    if (positionals.length) throw new Error('Use --text ou --file para fornecer o texto.');
    if (values.text !== undefined && values.file !== undefined) throw new Error('Escolha apenas --text ou --file.');
    let text;
    if (values.text !== undefined) text = values.text;
    else if (values.file !== undefined) text = await readFile(values.file, 'utf8');
    else {
      if (process.stdin.isTTY) throw new Error('Informe --text, --file ou envie texto via stdin.');
      const chunks = [];
      for await (const chunk of process.stdin) chunks.push(chunk);
      text = Buffer.concat(chunks).toString('utf8');
    }
    const result = analyzeText(text, { wordsPerMinute: values.wpm === undefined ? 200 : Number(values.wpm) });
    if (values.json) console.log(JSON.stringify(result, null, 2));
    else {
      console.log(`Palavras: ${result.words}\nCaracteres: ${result.characters}\nLinhas: ${result.lines}\nParágrafos: ${result.paragraphs}\nLeitura estimada: ${result.readingSeconds}s`);
      console.log('Mais frequentes: ' + result.topWords.map(x => `${x.word} (${x.count})`).join(', '));
    }
  }
} catch (error) {
  console.error('Erro: ' + error.message);
  process.exitCode = 1;
}
