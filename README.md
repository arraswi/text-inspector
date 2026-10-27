# Text Inspector

Analisador de texto pelo terminal, com palavras, caracteres visíveis, frequência e estimativa de leitura.

## Funcionalidades

- Entrada por argumento, arquivo UTF-8 ou stdin.
- Segmentação Unicode: acentos compostos e emojis não inflam a contagem de caracteres.
- Dez palavras mais frequentes, sem diferenciar maiúsculas e minúsculas.
- Saída legível ou JSON para integrar com scripts.

## Rodar

Requer Node.js 22 ou superior. Não há dependências externas nem build.

```bash
npm start -- --text "Olá mundo, olá!"
npm start -- --file examples/texto.txt --json
npm start -- --text "Um texto" --wpm 180
npm test
```

Via stdin (terminal compatível com pipes):

```bash
echo "Olá mundo" | node bin/cli.js --json
```

`node bin/cli.js --help` mostra a ajuda. Erros retornam código 1.

## API JavaScript/TypeScript

```js
import { analyzeText } from './src/index.js';
console.log(analyzeText('Olá mundo', { wordsPerMinute: 200 }));
```

As declarações em `src/index.d.ts` descrevem a API para consumidores TypeScript.

## Como funciona

`Intl.Segmenter` com locale `pt-BR` identifica palavras e grafemas. As frequências normalizam texto para NFC e minúsculas; não removem acentos ou palavras comuns. Empates são ordenados alfabeticamente. Linhas contam segmentos separados por CRLF, LF ou CR, incluindo uma linha final vazia; texto vazio tem zero linhas. Parágrafos são blocos separados por uma linha em branco.

A leitura é uma estimativa arredondada para cima em segundos. O conteúdo inteiro é lido em memória; use textos pequenos ou médios.

## Estrutura

- `src/`: lógica reutilizável e tipos.
- `bin/cli.js`: interface de terminal.
- `test/`: testes unitários e de CLI com `node:test`.
- `examples/`: arquivo de exemplo.

## Ideias para evoluir

Adicionar filtros de palavras comuns e exportação CSV. Essas funcionalidades ainda não estão implementadas.

## Licença

MIT. Veja `LICENSE`.
