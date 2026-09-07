# Como adicionar um ícone

Este arquivo existe porque os 13 ícones atuais foram feitos artesanalmente —
extraídos um a um do HTML exportado do Framer, otimizados à mão, com a
decisão de contraste tomada olhando cada um. Isso funcionou para 13. Para o
14º, ninguém deveria precisar reconstruir esse processo de memória.

**Este documento não muda nenhum ícone existente.** Ele só descreve o
contrato que eles já seguem, para que o próximo siga o mesmo.

## O contrato (não negociável)

Todo ícone do DS:

1. **Não carrega cor própria.** O glifo é `currentColor` (via `fill` ou
   `stroke`), nunca um hex ou `rgb()`. É o que faz a troca de paleta repintar
   o conjunto inteiro sem tocar em SVG — ver `IconBase` em `Icon.tsx`.
2. **Não define tamanho próprio.** `IconBase` já fixa `width="1em"
   height="1em"`. O ícone herda do texto do pai (`text-2xl`, `text-accent`
   etc. resolvem tamanho e cor juntos).
3. **É decorativo por padrão.** `aria-hidden` e `focusable="false"` vêm do
   `IconBase`; só ganham `role="img"` se receberem a prop `title`.
4. **Vive no grid da família:**
   - Litúrgicos (`liturgical.tsx`): `viewBox="0 0 60 60"` (o padrão do
     `IconBase`, não precisa declarar).
   - Interface (`ui.tsx`): `viewBox="0 0 16 16"` — declare via
     `viewBox={UI_BOX}`, não escreva a string à mão.
5. **Fica em `IconBase fill="none"`**, com a cor explícita nos `<path>`
   internos (`fill="currentColor"` ou `stroke="currentColor"`). Não deixe o
   glifo herdar o `fill="currentColor"` que o `IconBase` já põe por padrão no
   `<svg>` — ver a armadilha abaixo.

## A armadilha do Framer (por que a cor é explícita, não herdada)

Se algum dia você extrair um ícone de um export do Framer de novo: o SVG
costuma vir embrulhado assim:

```xml
<g fill="transparent">
  <path d="M0 0h60v60H0Z"/>          <!-- caixa delimitadora, invisível -->
  <path fill="#B36928" d="..."/>     <!-- o desenho de verdade -->
</g>
```

Se você tirar o `fill="transparent"` do `<g>` esperando que tudo herde
`currentColor` do `IconBase`, a **caixa delimitadora** também herda — e vira
um quadrado sólido por cima do ícone. Foi exatamente esse bug que apareceu e
foi corrigido nos 6 litúrgicos (ver o comentário no topo de
`liturgical.tsx`).

A regra prática: **nunca apague um `fill="transparent"`** sem entender o que
ele está escondendo. Troque só o `fill` do path que é o desenho.

## Passo a passo para adicionar um ícone novo

1. **Consiga o SVG de origem.** O export do Framer está esgotado como fonte
   (não há mais datas litúrgicas novas vindo de lá) — o próximo ícone
   provavelmente vem de um export do Figma, de outra arte da marca, ou é
   desenhado à mão no mesmo peso visual dos 4 ícones de interface que não
   vieram de lugar nenhum (check, plus, chevrons — ver `ui.tsx`).

2. **Rode o normalizador:**

   ```bash
   node scripts/normalize-icon.mjs caminho/para/original.svg \
     --name IconNomeDoIcone \
     --grid 60 \
     --ink "#B36928"
   ```

   - `--grid 60` para litúrgico, `--grid 16` para interface.
   - `--ink` é a cor do traço/preenchimento que deve virar `currentColor`.
     Você decide qual é — o script não adivinha, porque adivinhar errado é
     como bugs de contraste entram.
   - Roda SVGO com a mesma configuração usada nos 13 atuais e troca a cor
     indicada por `currentColor`, path por path.
   - **O script nunca escreve em `liturgical.tsx` nem `ui.tsx`.** Ele
     imprime o componente pronto no terminal. Colar é decisão sua, e é o
     momento de olhar se algo saiu estranho.

3. **Cole o componente** no arquivo certo (`liturgical.tsx` para datas,
   `ui.tsx` para interface), seguindo o padrão de comentário
   `/** Nome legível */` acima de cada função.

4. **Exporte** em `src/ds/icons/index.ts` e depois em `src/ds/index.ts` (o
   barrel público) — os dois, na ordem alfabética que já existe.

5. **Verifique visualmente.** Abra `/design-system#icones` — o ícone novo
   aparece sozinho nos três tamanhos de herança (`text-sm`, `text-2xl`,
   `text-4xl`) na última fileira do eixo. Se o traço ficar fino ou grosso
   demais comparado aos vizinhos, o problema quase sempre é o `strokeWidth`
   não bater com o resto da família — os desenhados à mão usam `1.5`.

6. **Rode `npx eslint src`.** O lint bloqueia cor literal em componente; se
   sobrou um hex ou `rgb()` que o normalizador não pegou, ele acusa aqui.

## O que este processo não resolve

O normalizador não decide contraste (tile creme vs. ícone) nem detecta a
armadilha do Framer sozinho — isso continua exigindo olhar o resultado. Não
existe extração automática de cor "certa": em cada um dos 13 atuais, a
decisão de qual valor virava `currentColor` foi tomada olhando o design
aprovado, não inferida do arquivo.
