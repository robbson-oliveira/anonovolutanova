---
name: wireframe-para-design-system
description: Use ao portar qualquer bloco, seção ou componente do wireframe HTML estático (public/wireframe/*.html, exportado do Framer) para React no design system deste projeto. Dispara com "copia esse bloco do wireframe", "transforma em componente", "leva para o design system", "igual ao wireframe", "lacunas".
---

# Wireframe (Framer HTML) → React no Design System

Objetivo: reproduzir o bloco pedido **pixel a pixel** como componente React em CSS puro, sem inventar variações. Fidelidade visual vence elegância de código.

## 1. Extrair a verdade do wireframe

Nunca reproduza de memória nem da screenshot apenas — a screenshot mostra o resultado, o HTML mostra os valores.

- Localize o bloco em `public/wireframe/wireframe-v2.html` (`rg -n "<texto do bloco>"`).
- Colete do HTML/CSS inline: largura e altura em px, gap, padding, border-radius, cor exata, tamanho/peso/line-height de fonte, ordem dos itens, rotações/transform, sombras.
- Quando houver dúvida de medida real, meça no navegador (Playwright, `getBoundingClientRect`) em `http://localhost:8080/wireframe/wireframe-v2.html` com viewport 1440.
- Ruído do Framer a descartar: `data-framer-*`, `framer-` classes, wrappers vazios, `will-change`, IDs gerados, breakpoints não usados. Mantenha só a estrutura semântica mínima.

## 2. Regras de fidelidade (invariantes)

- Dimensões **iguais** às do wireframe, em px, sem "melhorar" nem escalar. Ampliar um bloco na página de lacunas já foi rejeitado explicitamente.
- Mesma sequência e mesmo agrupamento dos itens (se no wireframe são 4 cards numa grade 2×2, é assim que entram — não um exemplo de cada).
- Cores, espaçamentos e tipografia via tokens de `src/ds/styles/tokens.css`. Se o valor do wireframe não existir como token, use o valor literal e sinale isso ao usuário — não invente token novo sem pedir.
- Sem Tailwind, sem shadcn, sem nenhuma biblioteca de UI. CSS puro / CSS Modules / style inline, como o resto de `src/ds`.
- Animações de entrada usam `Reveal` (IntersectionObserver) já existente; preserve delays e alternância de lado quando o wireframe/seção original tiver.

## 3. Onde colocar

1. Componentes reutilizáveis vivem em `src/ds/primitives` (genéricos) ou `src/sections` (blocos da página). Se o bloco já existe numa seção, **exporte-o de lá** em vez de duplicar (padrão já usado: `About.tsx` exporta `FEATURES` e `FeatureCard`).
2. Blocos em discussão entram primeiro em `/design-system/lacunas` (`src/app/design-system/lacunas/page.tsx`), com preview vivo — nunca só descrição em texto.
3. Depois de aprovado pelo usuário, mova a ficha para o catálogo principal (`src/app/design-system/page.tsx`) e remova de lacunas. Só faça essa promoção quando o usuário aprovar.

## 4. Verificar antes de responder

- `npx tsc --noEmit` limpo.
- Screenshot do bloco novo e do mesmo bloco no wireframe, lado a lado, mesma largura de viewport; compare medidas, não impressão geral.
- Cite no fim as medidas reais aplicadas (ex.: "586 × 600 px"), para o usuário conferir rápido.

## 5. Ao responder

Uma ou duas frases, em português, sobre o que ele vai ver e onde. Sem termos de código.
