---
name: wireframe-para-design-system
description: Use ao portar qualquer bloco, seção ou componente do wireframe HTML estático (public/wireframe/*.html, exportado do Framer) para React no design system deste projeto. Dispara com "copia esse bloco do wireframe", "transforma em componente", "leva para o design system", "igual ao wireframe", "lacunas".
---

# Wireframe (Framer HTML) → React no Design System

Objetivo: reproduzir o bloco pedido **pixel a pixel** como componente React em CSS puro, sem inventar variações. Fidelidade visual vence elegância de código.

Regra de ouro: **nada entra por estimativa**. Toda medida vem de leitura do HTML ou de medição no navegador. Se uma medida não foi medida, ela está errada.

## 1. Medir antes de escrever (obrigatório)

Nunca reproduza de memória nem da screenshot — a screenshot mostra o resultado, o HTML e o DOM medido mostram os valores.

1. Localize o bloco: `rg -n "<texto do bloco>" public/wireframe/wireframe-v2.html`. Se o texto estiver dentro do bundle do Framer (JS), procure também em `public/wireframe/` inteiro.
2. Meça no navegador — é a fonte de verdade, porque o Framer aplica estilos em runtime:
   `cp /tmp/knowledge/skill/wireframe-para-design-system/scripts/medir.py /tmp/ && python3 /tmp/medir.py "Todo dia"`
   O script abre `http://localhost:8080/wireframe/wireframe-v2.html` em viewport 1440, rola até disparar as animações e devolve, para o card e **para cada camada**, a caixa em px relativa ao card, transform, opacity, box-shadow, radius, fundo, padding, gap, fonte e `src`.
3. Meça o bloco **e cada camada interna**. O erro típico já cometido foi acertar o card (586 × 600) e chutar as páginas de dentro. Camada não medida = camada errada.
4. Confirme os assets: tamanho natural de cada PNG (`file public/img/x.png`) e se o fundo é transparente. Página inclinada em PNG transparente **não** leva `box-shadow` de CSS — a sombra sai retangular e aparece como vinco reto. Nesses casos a sombra é vetor (SVG) copiado do wireframe.
5. Texto sobreposto (manuscrito sobre pautas) precisa de `top`, `step` entre linhas, `left` e `font-size` medidos na página, relativos à caixa da própria página — não ao card.
6. Ruído do Framer a descartar: `data-framer-*`, classes `framer-`, wrappers vazios, `will-change`, IDs gerados, breakpoints não usados.

## 2. Regras de fidelidade (invariantes)

- Dimensões **iguais** às do wireframe, em px, sem "melhorar" nem escalar. Ampliar um bloco já foi rejeitado explicitamente.
- Mesma sequência e mesmo agrupamento dos itens (4 cards numa grade 2×2 entram assim, não um exemplo de cada).
- Cores, espaçamentos e tipografia via tokens de `src/ds/styles/tokens.css`. Valor sem token: use o literal e avise — não invente token novo sem pedir.
- Sem Tailwind, sem shadcn, sem biblioteca de UI. CSS puro / CSS Modules / style inline, como o resto de `src/ds`.
- Sombras: copie a forma real. Se no wireframe a sombra é uma cunha/gradiente, reproduza como SVG com o mesmo `path`, ângulo do gradiente e opacidade — não substitua por `box-shadow`.
- Animações: quem anima no wireframe é **cada camada**, não o card. Reproduza com `Reveal` (variantes `up`/`left`/`right`/`pop`/`forward`), mantendo direção e delay de cada camada.

## 3. Onde colocar

1. Componentes reutilizáveis vivem em `src/ds/primitives` (genéricos) ou `src/sections` (blocos da página). Se o bloco já existe numa seção, **exporte-o de lá** em vez de duplicar (padrão: `About.tsx` exporta `FEATURES` e `FeatureCard`).
2. Blocos em discussão entram primeiro em `/design-system/lacunas` (`src/app/design-system/lacunas/page.tsx`), com preview vivo — nunca só descrição em texto.
3. Depois de aprovado, mova a ficha para o catálogo (`src/app/design-system/page.tsx`) e remova de lacunas. Só promova com aprovação explícita.

Ao editar arquivos grandes de seção, prefira `code--line_replace` ou script Python pontual; uma reescrita cega de `About.tsx` já corrompeu o arquivo.

## 4. Revisar antes de responder (checklist)

Só responda depois que todos passarem:

- [ ] `npx tsc --noEmit` limpo.
- [ ] Rodei `medir.py` também na **implementação** (`/design-system/lacunas`) e comparei número a número com o wireframe: card e cada camada, tolerância ±2 px.
- [ ] Screenshots do bloco no wireframe e na implementação, mesma largura de viewport, comparados lado a lado — inclusive **depois** da animação terminar.
- [ ] Nenhuma sombra extra: procure vincos retos, bordas duras e sombras duplicadas em PNG transparente.
- [ ] Texto sobreposto alinhado às pautas, não flutuando.
- [ ] Sequência, agrupamento e tamanho iguais aos do wireframe.
- [ ] Console sem erros na rota.

Se algo não bate e você não sabe o valor certo, **meça de novo** em vez de ajustar no olho.

## 5. Ao responder

Uma ou duas frases, em português, sobre o que ele vai ver e onde. Cite as medidas reais aplicadas (ex.: "586 × 600 px"). Sem termos de código.
