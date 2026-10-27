import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { analyzeText } from '../src/index.js';
const cwd = new URL('../', import.meta.url);
const cli = (...args) => spawnSync(process.execPath, ['bin/cli.js', ...args], { cwd, encoding: 'utf8', input: '' });
test('texto vazio e apenas espaços', () => {
  assert.equal(analyzeText('').characters, 0);
  assert.equal(analyzeText('').lines, 0);
  assert.equal(analyzeText('   ').words, 0);
});
test('acentos compostos e emoji contam como grafemas', () => {
  assert.equal(analyzeText('a\u0301👨‍👩‍👧‍👦').characters, 2);
});
test('frequência normaliza caixa e acentos Unicode', () => {
  assert.deepEqual(analyzeText('Olá ola\u0301 OLÁ').topWords, [{ word: 'olá', count: 3 }]);
});
test('linhas e parágrafos aceitam CRLF', () => {
  const r = analyzeText('Um.\r\n\r\nDois.');
  assert.equal(r.lines, 3); assert.equal(r.paragraphs, 2);
});
test('leitura e velocidade inválida', () => {
  assert.equal(analyzeText('um dois', { wordsPerMinute: 60 }).readingSeconds, 2);
  for (const value of [0, -1, NaN, Infinity]) assert.throws(() => analyzeText('x', { wordsPerMinute: value }), RangeError);
});
test('CLI gera JSON e rejeita argumentos conflitantes', () => {
  const ok = cli('--text', 'Olá mundo', '--json');
  assert.equal(ok.status, 0); assert.equal(JSON.parse(ok.stdout).words, 2);
  assert.equal(cli('--text', 'x', '--file', 'x').status, 1);
  assert.equal(cli('--wpm', 'abc').status, 1);
});
test('stdin, ajuda e arquivo ausente', () => {
  const r = spawnSync(process.execPath, ['bin/cli.js', '--json'], { cwd, input: 'Um texto', encoding: 'utf8' });
  assert.equal(JSON.parse(r.stdout).words, 2);
  assert.equal(cli('--help').status, 0);
  assert.equal(cli('--file', 'inexistente.txt').status, 1);
});
