# Alinhar a referência com o palco no laboratório

Você está certo: hoje a imagem de referência e as agendas animadas não vivem na mesma escala. O que os arquivos mostram:

- O palco é um quadrado de 740 x 740 e as duas agendas são posicionadas em porcentagem dentro dele.
- A imagem `referencia-posicionamento.png` tem 1017 x 989 pixels — não é quadrada — e é um recorte fechado só nas duas agendas, sem a folga do palco e sem o cartão de preço.
- No laboratório ela é exibida esticada para dentro do quadrado inteiro, "encaixada" por dentro. Resultado: ela entra com altura menor que a largura, deslocada para baixo, e o controle de Escala em 1,00 não significa nada — não corresponde ao tamanho real das agendas.

Ou seja, a divergência não é um bug pontual: é que a referência nunca teve um ponto de origem comum com o palco. Toda vez que alguém abre a página precisa arrastar Escala/X/Y no olho, e o ajuste se perde ao recarregar. Trabalho feito assim sempre vai divergir.

## O que fazer

1. **Dar à referência a mesma régua do palco.** Ela passa a ser desenhada na proporção real dela (1017 x 989), não espremida no quadrado. Escala 1,00 passa a querer dizer "um pixel da referência vale um pixel do palco".

2. **Calibrar uma vez e deixar gravado.** Comparo a referência com o último quadro da animação (a composição final), acho a escala e o deslocamento exatos em que as duas capas coincidem, e gravo esses números como o estado inicial da página. Quem abrir já encontra tudo encaixado, sem mexer em nada.

3. **Não perder ajuste manual.** Se você mexer nos controles, o novo valor fica guardado no navegador e volta na próxima visita. Um botão "Voltar à calibragem" devolve os números oficiais.

4. **Mostrar a verdade na tela.** O painel passa a exibir o tamanho real da referência e o quanto ela está fora do palco, para nunca mais restar dúvida se o desencaixe é do desenho ou do overlay.

5. **Deixar explícito o parentesco.** O palco das agendas é uma peça só, usada tanto no topo do site quanto no catálogo do design system; este laboratório é onde ela se ajusta. Vou registrar isso em uma nota curta no próprio painel e no catálogo, para ninguém duplicar a animação em outro lugar.

## Detalhes técnicos

- `src/app/lab/hero-animation/page.tsx`: overlay de referência deixa de usar `object-contain` dentro de `inset-0` e passa a ser desenhado com largura/altura naturais, ancorado no mesmo canto do palco (`STAGE_SIZE`), com `transform: translate(x, y) scale(s)` aplicado a partir dessa origem.
- Calibragem medida no navegador (Playwright) com a animação congelada em `endTime`, comparando as bordas das capas do overlay com as do `BookStage`; os valores viram constantes `REF_CALIBRATION = { scale, x, y }` no topo do arquivo.
- Persistência em `localStorage` sob uma chave própria do laboratório, com fallback para a calibragem quando ausente ou inválida.
- Fantasmas (início/final) continuam como estão: já renderizam o `BookStage` real, na mesma caixa, então entre eles não há divergência de escala.
- Nada em `src/sections/BookStage.tsx`, nos keyframes de `ds/styles/base.css` ou nos tokens é alterado — a animação em si não muda.
