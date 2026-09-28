# AGENTS.md — Agenda "Ano Novo, Luta Nova" (@anonovolutanova)

Diretrizes para agentes (Claude Code, Codex, Cursor e afins) neste repositório.
A **Parte I** cobre o código do site; a **Parte II** é o DNA de marca, que vale para
todo texto voltado ao público (legendas, copy do site, e-mails).

---

# Parte I — Projeto e código

## Idioma e autoria

- **Código-fonte, comentários e commits sempre em inglês**: nomes de variáveis,
  funções, tipos e arquivos, comentários e JSDoc, mensagens de erro internas e
  mensagens de commit.
- **Textos de interface em pt-BR** (o público é brasileiro): copy das seções,
  rótulos, mensagens de erro mostradas ao cliente, metadata de SEO. Também ficam
  em pt-BR os slugs de rota, que são URLs públicas (`/contato`,
  `/politica-de-privacidade`), e os nomes de itens que espelham o WooCommerce
  ou a marca (`classica`, `Edição Color`). Exceção: a página de obrigado segue
  o padrão do WooCommerce, `/checkout/order-received?order_id=&token=&payment=`.
- **Nunca mencionar coautoria ou geração por IA**: nada de `Co-Authored-By:`,
  "Generated with Claude Code" ou equivalentes — nem no commit, nem em PR, nem
  em comentário de código.
- Grande parte dos comentários atuais ainda está em pt-BR (herança da fase de
  protótipo). Não faça tradução em massa num commit sem relação: ao mexer num
  trecho, escreva o comentário novo em inglês e traduza os comentários do
  bloco que você alterou.

## Commits

- Assunto no imperativo, em inglês, numa frase que diz o efeito da mudança,
  sem prefixo (`feat:` etc.) e sem ponto final, até ~72 caracteres — como no
  histórico: `Estimate shipping in the product section`,
  `Add company purchases, a date picker and WooCommerce gateways to checkout`.
- Corpo (quando a mudança não é trivial) depois de uma linha em branco,
  quebrado em 72 colunas, contando o que muda para quem usa o site e por quê —
  em prosa ou numa lista de `-`.
- Branches de trabalho com o prefixo `meumouse/` (ex.: `meumouse/checkout-integration`);
  `main` é a base dos PRs.
- Nunca commitar `.env`, `.env.local`, `dev/wordpress/.admin-password` nem
  artefatos (`.next/`, `*.tsbuildinfo`).

## O projeto

Site headless da Agenda Ano Novo, Luta Nova (anonovolutanova.com.br): landing
page do produto com compra, carrinho e checkout próprios sobre um WordPress com
WooCommerce. Histórico, decisões em aberto (D1–D7) e fases estão em
`PLANO-MIGRACAO-NEXTJS.md`; o passo a passo da troca de domínio, em
`RUNBOOK-VIRADA.md`; a instalação do WooCommerce, do bridge e do site do
zero, no `README.md` (mude-o junto quando mudar um passo de configuração).

| Namespace | Origem |
| --- | --- |
| `wc/store/v1` | Store API do WooCommerce — carrinho, frete e pedido (`src/lib/commerce/store-api.ts`), chamada direto do navegador |
| `anln-storefront/v1` | Plugin `../anln-storefront-bridge` (repositório irmão, com o próprio `AGENTS.md`) — config do checkout, gateways, instruções de pagamento e cotação de frete sem carrinho (`src/lib/commerce/bridge-api.ts`, `shipping-api.ts`) |
| `wp/v2` | Páginas institucionais lidas do WordPress (`src/lib/wordpress/pages.ts`) |

Toda chave que o site envia em `extensions.anln_checkout` e toda resposta do
bridge fazem parte de um contrato: mudar um lado exige mudar o outro.

## Stack e comandos

- Next.js 16 (App Router, `output: "standalone"`), React 19, TypeScript 5.9
  (`strict: true`), Tailwind CSS 4 (configurado em CSS, sem `tailwind.config`),
  Radix UI (checkbox, dialog, popover, radio-group, select), react-day-picker,
  intl-tel-input. Node 24 (o mesmo do `Dockerfile`). `@tanstack/react-query`
  está declarado no `package.json`, mas nada o usa hoje.
- **Gerenciador: npm** (`package-lock.json`).
- `npm run dev` — servidor local (`.claude/launch.json`: `next-dev`, porta 3000).
- `npm run lint` — ESLint (flat config nativo do `eslint-config-next`).
- `npm run typecheck` — `tsc --noEmit`.
- `npm run build` — build de produção. Rode antes de dar como pronta uma
  mudança em rota, `next.config.ts`, metadata ou código de servidor.
- **Não há testes automatizados.** Rode `lint` e `typecheck` em toda mudança e
  confira o que for visível no navegador, em 375px e em desktop.
- WordPress local em Docker (WooCommerce, produto 2027, frete, cupom e o bridge
  montado da pasta irmã): ver `dev/wordpress/README.md`.

## Estrutura

- `src/app` — rotas. `(loja)/` agrupa a home, `/checkout` e
  `/checkout/order-received`, que compartilham o `CartProvider`; as institucionais
  ficam fora dele e não criam sessão no WooCommerce. `/design-system` e
  `/lab` são páginas de revisão interna.
- `src/sections` — as seções da home (`Hero`, `Product`, `Faq`…), compostas em
  `src/app/(loja)/page.tsx`.
- `src/features/<área>` — blocos com estado e regra de negócio: `cart`,
  `checkout`, `purchase`, `shell`.
- `src/ds` — design system (ver abaixo).
- `src/content` — copy e dados estáticos do produto. `product.ts` é a fonte
  única de ano do ciclo, nome, preço, parcelas e edições; nunca repita esses
  valores em outro arquivo.
- `src/lib` — `commerce/` (clientes da Store API e do bridge, oferta, máscaras
  e validação BR), `payments/` (um adaptador por gateway, contrato em
  `types.ts`), `tracking/` (GTM e eventos GA4), `wordpress/`, `attribution.ts`,
  `env.ts`/`env.server.ts`, `format.ts`, `legacy-urls.ts`.
- `src/proxy.ts` — substituto do middleware no Next 16: guarda `?cupom=` e a
  origem da visita em cookies e responde 410 para o conteúdo antigo do
  WordPress.
- `public/wireframe/` — export do Framer aprovado, **só referência visual**
  (servido em `/wireframe`). `old/` — histórico da prototipagem. Nenhum dos
  dois é código do app; não edite nem importe deles.

## Convenções de código

- 2 espaços, aspas duplas, ponto e vírgula, vírgula final. Sem Prettier: siga
  a formatação do arquivo.
- Aliases: `@/*` (`src/`), `@ds/*`, `@content/*`, `@sections/*`. Dentro de uma
  mesma pasta de `features/`, import relativo (`./CepForm`).
- Componentes em PascalCase (`ShippingEstimate.tsx`), um por arquivo, com
  **export nomeado**. `export default` só onde o Next exige (`page.tsx`,
  `layout.tsx`, `robots.ts`, `sitemap.ts`). Props num `type XProps = {…}`
  logo acima do componente.
- Arquivos de `lib` em kebab-case (`store-api.ts`, `cart-items.ts`).
- `"use client"` só nos componentes que têm estado, efeito ou handler; seções
  e páginas ficam no servidor sempre que possível.
- Módulos só de servidor começam com `import "server-only";`
  (`lib/commerce/offer.ts`, `lib/env.server.ts`).
- Variáveis de ambiente: públicas só por `publicEnv` (`src/lib/env.ts`), de
  servidor só por `serverEnv` (`src/lib/env.server.ts`) — nunca
  `process.env` direto. Uma `NEXT_PUBLIC_*` nova também entra no
  `.env.example` e vira `ARG`/`ENV` no `Dockerfile`, senão chega vazia no
  build da imagem.
- Comentários explicam o **porquê** (decisão, bug que evitam, limite externo),
  não o quê. Blocos JSDoc `/** … */` no topo de módulos e acima de
  componentes/funções exportadas; campos de tipo não óbvios ganham `/** … */`
  de uma linha.
- `localStorage` e `document.cookie` sempre com guarda de SSR
  (`typeof window === "undefined"`) e dentro de `try/catch` (aba anônima,
  storage bloqueado). Chaves com o prefixo `anln_` (`anln_cart_token`,
  `anln_cep`, `anln_shipping_rate`, `anln_checkout`…).
- Dinheiro: `formatBRL` (`src/lib/format.ts`). CPF, CNPJ, CEP e telefone:
  helpers de `src/lib/commerce/br.ts` e `src/features/checkout/phone.ts`.

## Design system (`src/ds`)

- As páginas, seções e features importam o DS **só por `@ds/index`**. Dentro
  do DS, nada importa de fora dele (ele precisa poder virar `packages/ui`
  movendo a pasta). Componente novo do DS entra exportado em `src/ds/index.ts`.
- **Nenhuma cor escrita em componente.** Toda cor vem de token semântico de
  `src/ds/styles/tokens.css` (`bg-surface`, `text-text-strong`, `bg-action`…).
  O ESLint transforma em erro, em `src/**`: hex, `rgb()`/`rgba()` (também em
  template strings), `-[#…]` do Tailwind e as cores nomeadas da paleta padrão
  (`text-white`, `bg-slate-800`…). A única exceção é o laboratório
  `src/app/lab/**`, que é ferramenta de desenvolvimento.
- **Estilo com classes do Tailwind, sem CSS solto.** Nada de arquivo `.css`
  com classes próprias nem `style={{…}}` com valor fixo: medida do wireframe
  vira classe arbitrária (`h-[68px]`, `tracking-[-0.64px]`, `left-[42.9%]`),
  degradê vira `bg-linear-<ângulo>/srgb from-… to-…`, e para vencer uma classe
  do DS use o `!` do Tailwind (`rounded-[10px]!`). `style` só para valor que
  vem de dado ou prop em tempo de execução (posições de camadas, atraso do
  `<Reveal>`, duração da esteira). O CSS que resta: tokens e animações
  (`--animate-*` com os `@keyframes`) em `tokens.css`; padrões de elemento e a
  variante `reveal-armed:` em `base.css`; e a pele do intl-tel-input em
  `PhoneField.css`, porque aquele HTML é gerado pela biblioteca.
- Tokens em duas camadas: **primitivas** (`--brand-*`, só valores) e
  **semânticas** (`--color-*`, o papel). Componente usa só semântica; uma
  troca de paleta mexe só nas primitivas. `action` (verde, fundo de botão) e
  `accent` (terracota, destaque de texto) são papéis separados de propósito.
- Classes condicionais com `cn()` (`@ds/utils/cn`), sem tailwind-merge.
  Variantes como mapas `Record<Variant, string>` (ver `Button.tsx`).
- Ícones: seguir o contrato de `src/ds/icons/CONTRIBUTING.md` (`currentColor`,
  `1em`, decorativos por padrão).
- Animação de entrada com `<Reveal>`: o elemento já nasce animado
  (`animate-reveal-*`) e o JS só pausa (variante `reveal-armed:`), para que
  nada fique invisível se o JS falhar. Seções com `Reveal` lateral
  usam `overflow-x-clip` (não `hidden`) para o deslocamento não alargar a
  página no celular.
- Portar algo do wireframe: usar a skill `.agents/skills/wireframe-para-design-system`
  — toda medida vem do HTML ou do DOM medido, nunca de estimativa.
- Fontes locais (Manrope e Yellowtail em `public/fonts`), declaradas inline em
  `src/app/layout.tsx`; não troque por `next/font`.

## Loja e checkout

- O checkout só liga com `NEXT_PUBLIC_CHECKOUT_ENABLED=true` **e**
  `ANLN_PRODUCT_ID` definido; sem isso, a compra termina no pedido pelo
  WhatsApp. Todo fluxo novo precisa respeitar os dois estados.
- `getProductOffer()` lê preço, estoque e variações da Store API e cai para
  `src/content/product.ts` se o WordPress não responder: a home precisa
  continuar abrindo com o WordPress fora do ar.
- `Cart-Token` é a identidade do carrinho (localStorage). Não troque por
  cookie: é o que mantém o carrinho entre domínios no Safari/iOS.
- Gateway (D3) ainda em aberto: pagamento passa pelos adaptadores de
  `src/lib/payments/`. O checkout não pode depender de um gateway específico.
- Edições reconhecidas pelo atributo **Edição** com os valores `Color` e
  `Clássica` no WooCommerce (`lib/commerce/editions.ts`).
- Frete grátis é por **quantidade** (`FREE_SHIPPING_MIN_QTY`), regra que o
  bridge aplica no WooCommerce.

## Tracking e privacidade

- O site só publica eventos GA4 de e-commerce no `dataLayer`
  (`src/lib/tracking/events.ts`); quem decide o destino são as tags do GTM.
  Não carregue `gtag.js` nem pixels direto no código.
- Consent Mode v2 começa negado; o banner é `src/features/shell/ConsentBanner.tsx`
  (o link "Preferências de cookies" o reabre pelo evento `anln:consent-open`).
- Cookies de atribuição (`anln_cupom`, `anln_origem`) não guardam dado
  pessoal. Não coloque dado pessoal em cookie, URL ou evento de tracking.

## Armadilhas conhecidas

- O comentário de `redirects()` em `next.config.ts` cita `src/app/route.ts`,
  que não existe mais (a home virou React, D5). O `tsconfig.json` e o
  `eslint.config.mjs` ainda excluem `wireframe_site_2027`, pasta que também
  não existe.
- `BRIEFING-NEXTJS.md` é o handoff da fase de protótipo; onde divergir do
  código ou do `PLANO-MIGRACAO-NEXTJS.md`, confie no código e no plano.
- `react-hooks/set-state-in-effect` está rebaixado a aviso por pontos antigos;
  não use isso como licença em código novo.

---

# Parte II — DNA de marca

> Sincronizado a partir da Central **DNA de Marca** no Notion em 31/08/2026.
> Fonte: https://app.notion.com/p/bffacd40fd9d8205a98601882dbd9907
> Sempre que a Central do Notion for atualizada, peça para re-sincronizar esta parte do `AGENTS.md`.

Vale para todo texto voltado ao público: legendas e roteiros de redes sociais,
copy das seções do site (`src/content`, `src/sections`), e-mails e mensagens
de checkout.

## Metodologia e limites dos dados

Não há pesquisa direta com clientes aplicada ainda. Todo o conteúdo abaixo vem de
engenharia reversa do Instagram público **@anonovolutanova** (80 posts, 02/10/2024 →
26/06/2026 — dois ciclos sazonais completos: Agenda 2025 e Agenda 2026) e do site
anonovolutanova.com.br. Onde a evidência era fraca, isso está sinalizado explicitamente
em vez de generalizado. Validar com pesquisa real assim que houver base de clientes
(ver "Modelo de Pesquisa de Audiência" no Notion).

---

## 1. Quem é a marca

**Produto:** Agenda católica anual física — impressa uma vez por ano, sem versão digital —
inspirada em São Josemaria Escrivá, fundador do Opus Dei. Nome vem da frase-lema
**"Ano Novo, Luta Nova"**.

**Bio do Instagram:** *"Agenda edição [ano] vem aí com muitas novidades! 🤗 Uma agenda
inspirada em São Josemaria Escrivá. Faça sua reserva! 🏃‍♀️‍➡️"*

**Grande ideia / tema-guarda-chuva:** A santidade no ordinário — a santidade se constrói
nas pequenas coisas do cotidiano, não em grandes feitos. Tema oficial do ciclo 2026:
*"Caminho de Santidade no Dia a Dia"*.

**Promessa central (repetida em toda copy de venda):** a fusão de organização prática +
vida espiritual — nunca uma sem a outra. A marca não vende "produtividade" nem "fé"
isoladamente. Estrutura prática do produto: virtude do mês + tarefas do dia + santo do dia.

**Se a marca fosse uma pessoa:** uma mulher católica de meia-idade, disciplinada mas
afetuosa, que reza o terço de manhã e organiza a lista de tarefas na mesma caneta —
defende que "arrumar a agenda é também um ato de fé", que a santidade está nas pequenas
escolhas do cotidiano, e que mudar de vida em janeiro exige um sistema diário com
estrutura, comunidade e um pouco de urgência.

---

## 2. Público (persona)

**Quem aparece no produto:** majoritariamente mulheres 25–45 anos, ambiente doméstico,
estética casual-cuidada (não "influencer de luxo") — mulher católica de classe média,
prática. A fundadora aparece pessoalmente em Reels, tom caseiro, gravando de casa.

**"Tribo" de referência:** ligada ao clero/vida consagrada e círculos de formação
católica/Opus Dei (não catolicismo genérico — universo técnico do Opus Dei).
Alcança também catequistas e mães de conteúdo católico geral via parcerias.

**Contexto demográfico:** classe média urbana, eixo Sudeste/Centro-Sul (amostra pequena),
já formada ou em formação na espiritualidade do Opus Dei — domina vocabulário técnico
sem precisar de explicação. Inclui um comprador presenteador (inclusive homens que
recebem de esposas) e um segmento B2B de revenda latente, pouco explorado no conteúdo.

**Dores mais mencionadas** (palavras exatas dos comentários):
1. Preço não é claro — "Qual o valor?" recorrente; site mostra "Sob Consulta".
   Referência de ancoragem: edição anterior custava R$ 89,90 (não divulgado hoje).
2. Medo de perder a vez — "Ainda tem alguma disponível?"
3. Incerteza sobre o formato físico — "Tem páginas diárias?"
4. Desejo de versão digital que a marca não oferece (e nunca vai oferecer — físico é a proposta)
5. Rotina sem sentido / ano que passa vazio (inferência da própria copy da marca)

**Desejos mais comuns:** entrar na lista de espera antes que acabe; ter o produto em mãos
urgentemente; comprar antes mesmo do produto existir; viver a fé "com mais presença" no
cotidiano; presentear com propósito; recomprar ano após ano.

**Objeções recorrentes:** preço não divulgado publicamente; processo de compra pouco
claro (direciona para Grupo VIP); estrutura do produto (páginas diárias?); ausência de
PDF; disponibilidade ("ainda tem?" — usada pela marca como munição de urgência, não só
tranquilização); parcelamento; condições de revenda (B2B a partir de 50 unidades).

**Padrões de linguagem:** "Ano Novo, Luta Nova" repetido; "vida interior", "propósito",
"presença de Deus"; termos técnicos do Opus Dei sem tradução (Ângelus, Oração Mental,
Triságio Angélico, 7 Domingos de São José) — a comunicação já fala para dentro da
comunidade. O público reage com emojis (👏 ❤️🔥 🙌), não replica o vocabulário devocional.

**Argumentos de venda mais usados pela marca:** escassez real de estoque (produto físico
impresso em lote limitado); prova social direta (giveaways, depoimentos nominais);
autoridade religiosa (citações de São Josemaria: "Forja", "Sulco", "Caminho"); bastidores
de produção física. O gatilho mais forte observado é a **expectativa/exclusividade
pré-lançamento** — mais forte até que a urgência de estoque.

**Pilares de conteúdo observados (participação aproximada):**
- Datas litúrgicas/calendário católico — ~25%
- Urgência/venda direta — ~20%
- Produto/detalhes da agenda — ~15%
- Devocional/educativo — ~15%
- Comunidade/sorteio — ~8%
- Prova social/depoimento — ~12%
- Bastidores/produção — ~5%

**Ciclo sazonal (confirmado em 2 edições):** pré-lançamento/teaser (set) → revelação de
capa → aquecimento educativo (out–nov) → pico de vendas/urgência (meados nov a início
jan) → sazonalidade litúrgica de Advento/Natal (dez, gatilho emocional) → urgência final
(dez–fev, prova social + últimas unidades) → pós-venda/silêncio comercial (fev em diante).

---

## 3. Tom de voz

**3 adjetivos que definem a escrita da marca:**
1. **Pastoral** — fala como quem instrui e acompanha, não como quem vende.
2. **Didática/estruturada** — organiza em blocos, listas de meses, passos — mesmo em posts emocionais.
3. **Afetuosamente convocatória** — verbo mais usado não é "compre", é "viva", "compartilhe", "comente", "não desista".

**Expressões-chave (usar sempre por extenso):** "Luta Nova" (como conceito, não só nome),
"Caminho de Santidade", "Santificar o cotidiano" / "nas pequenas coisas", "São Josemaria
Escrivá" (nome completo, sempre com citação atribuída — nunca "um santo disse..."),
"Grupo VIP" (CTA de conversão), "Ano Novo, Luta Nova" (nunca abreviar "ANLN"), "propósito".

> O prefixo `anln`/`ANLN` do código (chaves de storage, plugin, variáveis de
> ambiente) é identificador técnico e nunca aparece para o público. Em texto
> visível, a regra acima vale sem exceção.

**Nunca:**
- Urgência agressiva ("corre lá", "últimas unidades", "ÚLTIMA chance", CAIXA ALTA)
- Sequências de emojis (🔥🔥🔥) — no máximo 1 emoji por bloco, pontual
- Gírias de venda ("game changer", "incrível", "transformador", "jornada", "empoderamento")
- Promessa de resultado rápido ("mude sua vida em 30 dias")
- Comparação agressiva com concorrentes ou prova social numérica exagerada
- Tom de deboche, ironia ou humor ácido
- Abrir post de venda direto no preço/oferta sem contextualizar antes com reflexão

**Sempre:**
- Atribuir frases de santidade a fonte nomeada
- Fechar post devocional/reveal com convite à participação (comentar, compartilhar, marcar)
- Nome do produto por extenso: "Agenda Ano Novo, Luta Nova [ano]"
- Estrutura obrigatória: **reflexão → produto → CTA** (nunca produto → CTA isolado)
- Hashtags no fim: #agendaanonovolutanova #agenda[ano] #opusdei #agendacatólica

**Tom varia por objetivo:**
- **Urgência/venda:** frases curtas, ritmo rápido, emoji pontual (💥), CTA explícito e imediato, intensidade contida.
- **Devocional/reflexivo:** frases longas, ritmo pausado, abertura com pergunta empática, vocabulário litúrgico denso, quase sem emojis.
- **Prova social/testemunho:** tom quente e pessoal nas respostas a comentários, foco no relato do cliente, sem informalidade excessiva.

**Teste das 3 perguntas (usar antes de publicar qualquer texto gerado por IA):**
1. Isso soa como "Luta Nova"? (reflexão → produto/convite → CTA, nessa ordem?)
2. Um seguidor reconheceria sem ver a assinatura? (tem elemento-DNA: São Josemaria por
   nome completo, "Caminho de Santidade"/"santificar o cotidiano", ou nome do produto por extenso?)
3. Alguma palavra da lista de evitar foi usada?
Resposta ideal: **sim, sim, não.**

**Frases-DNA (reconhecíveis mesmo sem assinatura):**
- "A santidade se constrói nas pequenas coisas, um dia de cada vez."
- "Isso é santificar o cotidiano."
- "Mais que uma capa. Um símbolo de vida."
- "A espera acabou! [ano] vai começar de um jeito diferente: com a Agenda que une organização, fé e propósito em cada página."
- "No trabalho, na família, nos estudos e até nas pequenas contrariedades, São Josemaria Escrivá nos lembra que a santidade pode ser vivida em cada detalhe."

---

## 4. Posicionamento

*Revisado em 31/08/2026 com dados reais de engajamento de 3 concorrentes aprofundadas
(Lumen, Patronus, Ana Clara Freire). Ver Seção 5 para benchmarks.*

**Declarações de posicionamento — 4 versões com dados de mercado:**

**Versão 1 — Produto físico + método formativo (principal):**
> Para católicas que vivem a espiritualidade de São Josemaria Escrivá e sentem que a
> rotina do dia a dia passa sem propósito, a Ano Novo, Luta Nova é o único planner físico
> anual que une organização diária a um método formativo estruturado — tema mensal, frase
> de São Josemaria e práticas de vida interior — diferente da Lumen, que vende agenda sem
> método por trás, e da Patronus, que vende método sem produto físico, porque é a única
> que entrega os dois juntos: objeto e formação, na mesma página, todos os dias do ano.

**Versão 2 — Especialista da comunidade Opus Dei:**
> Para quem já vive a espiritualidade do Opus Dei e busca um objeto de devoção que fale
> a língua técnica da própria fé — Ângelus, Oração Mental, Exame de Consciência —, a Ano
> Novo, Luta Nova é o planner anual feito exclusivamente para essa comunidade, diferente
> da Quadrante, que divide sua atenção entre dezenas de títulos para o católico em geral,
> porque cada mês, cada frase e cada prática nascem direto do carisma de São Josemaria.

**Versão 3 — Fé em ação, não em teoria:**
> Para quem já cansou de conteúdo espiritual que fica só na teoria e quer transformar
> hábitos comuns em encontro real com Deus, a Ano Novo, Luta Nova é o planner físico que
> vira ritual — folheado, escrito e marcado todos os dias —, diferente da Patronus, que
> ensina organização espiritual em aulas e carrosséis sem nunca virar hábito físico de
> verdade, porque aqui a fé se pratica com a mão, não só se escuta ou se lê.

**Versão 4 — Sistema completo, não portfólio avulso (nova — vs. Ana Clara Freire):**
> Para quem já testou devocionários, aulas avulsas e clubes de assinatura separados e
> sente que nada disso vira rotina de verdade, a Ano Novo, Luta Nova é o único sistema
> anual fechado que integra calendário, método e devoção num objeto só, diferente da Ana
> Clara Freire ("Corações ao Alto"), que vende Devocionário, aulas e clube do livro como
> produtos separados que a seguidora precisa comprar e organizar sozinha, porque aqui a
> integração já vem pronta.

**Diferencial em uma frase:** *"Porque é a única agenda que já vem com o método de vida
espiritual dentro — não é só bonita, é formação que você folheia todo dia."*

Variações por contexto:
- Para quem conhece o Opus Dei: "Fala a sua língua — Ângelus, Oração Mental, Exame de Consciência — sem precisar traduzir."
- Para quem compara com a Lumen: "A Lumen é bonita. A Ano Novo, Luta Nova te forma — tema por mês, frase de São Josemaria por dia, práticas para marcar."
- Para presentear: "O presente que a pessoa abre todo dia durante um ano inteiro — não fica na estante."
- Para quem usa produtos avulsos da Ana Clara: "Você não precisa montar seu próprio sistema de fé juntando devocionário, aulas e clube de livro separados — aqui já vem tudo integrado, num objeto só."

**A lacuna que só esta marca ocupa** — interseção de 3 dimensões que nenhuma concorrente
reúne ao mesmo tempo (confirmado após análise aprofundada de 5 concorrentes):
1. **Produto físico sazonal fechado** — objeto único por ano, escassez real (esgota, gera lista de espera espontânea). Ana Clara Freire é a mais próxima, mas usa formato modular/avulso, não sistema anual fechado.
2. **Método formativo estruturado, entregue de uma vez** — tema mensal + frase diária de São Josemaria + checklist de práticas (Oração Mental, Ângelus, Santo Terço, Exame de Consciência) + metas anuais — tudo dentro do objeto, não como bundle opcional.
3. **Vocabulário nativo da comunidade Opus Dei** — sem traduzir, sem simplificar, sem se desculpar.

*Próxima revisão: outubro/2026, ou antes se Ana Clara Freire lançar versão anual do Devocionário.*

---

## 5. Concorrência (pesquisa aprofundada 31/08/2026)

Benchmarks de engajamento real (coletados post a post, últimos 30–50 posts por perfil):
- **Lumen:** ~1,5% de engajamento médio
- **Patronus:** ~0,18% de engajamento médio (8x menor que a Lumen)
- **Ana Clara Freire:** ~4,2% de engajamento médio — maior da pesquisa; recorde: "Digita MIGUEL" → 10.108 curtidas / 1.744 comentários

| Marca | O que vende | Alcance | Ameaça |
|---|---|---|---|
| **Lumen \| Papelaria Católica** (@lumenpapelariacatolica) | Agenda católica física + papelaria | 68,5 mil | **Alta** — pré-venda "Agenda Católica Lumen 2027" abriu 01/09/2026, nome quase idêntico, mesmo público. Vende objeto sem método por trás. Usa afiliada (@marianaoavelino em collab post). |
| **Ana Clara Lazarini Freire** (@anaclara.m.freire / "Corações ao Alto") | Devocionário físico (~R$79,90) + bundle de 3 aulas + clube do livro — produtos modulares avulsos | ~17 mil (estimado) | **Alta** — maior engajamento da pesquisa (4,2%). Produto físico (Devocionário) compete pelo mesmo orçamento e promessa espiritual. Rede de contato: Andrea Biselli. |
| **André Fortes \| Patronus** (@patronus.sj) | Clube/mentoria de vida espiritual (infoproduto, sem produto físico) | 63 mil | **Média** — mesma proposta (organização + espiritualidade), formato digital. Engajamento fraco (~0,18%). |
| **Quadrante Editora** (@editoraquadrante) | Planner "Falar com Deus" + livros de espiritualidade (editora desde 1964, Escrivá) | 63,8 mil | **Média** — credibilidade doutrinária forte, mas planner diluído entre dezenas de títulos, sem post-bandeira. |
| **Papel Plural** (@papelplural) | Papelaria genérica | 290 (inativa desde 2020) | Nenhuma |

**Leituras estratégicas (atualizadas com dados reais):**
- O nome "Agenda [ano]" entra em disputa direta com a Lumen a cada ciclo — antecipar comunicação de diferencial antes do pico de pré-venda.
- Ana Clara Freire (4,2% de engajamento) é a concorrente mais perigosa, não a Lumen: prova que conteúdo pessoal em 1ª pessoa com rosto/voz da fundadora engaja ~3x mais que produto puro.
- CTA "comente [palavra]" validado 3 vezes na pesquisa: Lumen → 230 comentários; Patronus → 25; Ana Clara → 1.744. Adicionar contador público de demanda é lacuna de nenhuma concorrente usa.
- Quaresma de São Miguel (15/08–29/09): Lumen (21/08) e Ana Clara (12/08) já capturaram em 2026 — janela com urgência imediata.
- Prova social nomeada no feed: 0 das 3 concorrentes aprofundadas publica depoimento no feed; só em Destaques/Stories. Lacuna barata de preencher.
- Bastidores de produção física: nenhuma concorrente mostra o processo real — diferencial difícil de copiar por quem é puramente digital.
- Preço de entrada baixo é padrão (Quadrante: R$19,90 com 56% off como isca); monoproduto físico permite preço mais alto, mas comunicação de valor precisa compensar.

---

## 6. Skill — Redatora de legendas para Instagram

Ativar pedindo: *"Usando a Skill de Redatora de Legendas, escreva uma legenda para
Instagram com objetivo de [alcance / conversão / conexão]. O tema é: [tema]. Tom:
pastoral e estruturado, como a voz da marca Ano Novo, Luta Nova."*

**Estrutura obrigatória de toda legenda:**
1. **Gancho** — 1 linha, para o scroll. Nunca começa com "Hoje vou falar sobre".
2. **Desenvolvimento** — máx. 4 linhas, reflexão espiritual ou insight concreto, vocabulário josemariano quando o tema permitir.
3. **CTA** — 1 linha direta, nunca vaga, nunca termina em pergunta aberta genérica.
4. **Hashtags** — #agendaanonovolutanova #agenda[ano] #opusdei #agendacatólica

Adaptação por objetivo:
- **🕯️ Alcance/Devocional:** frases longas, ritmo pausado, quase sem emojis, CTA de participação.
- **⚡ Conversão/Venda:** frases curtas, emoji único pontual, urgência comedida ancorada em calendário real, CTA explícito ("Entre no Grupo VIP", "Garanta a sua pelo link da bio").
- **💬 Conexão/Prova social:** tom quente e pessoal, foco no relato da seguidora, CTA de acolhimento.

Outras ferramentas de conteúdo no repositório: a skill
`.claude/skills/agente-de-pesquisa-de-mercado` (análise de perfis concorrentes)
e o agente `.claude/agents/researcher-anln.md` (pesquisa semanal, salva em
`outputs/`). Prompts de pesquisa ficam em `prompts/`.

---

## 7. Templates de referência (⚠️ não são desta marca)

As páginas abaixo, na Central do Notion, foram construídas para **outra marca/pessoa**
(Millena Nóbrega / ABSM — agência e escola de social media) e disponibilizadas só como
**modelo estrutural** — não usar o conteúdo, tom, paleta ou exemplos delas diretamente
para a Ano Novo, Luta Nova. Usar apenas a lógica de estrutura, adaptando à voz e à
persona documentadas acima:

- **Linhas Editoriais** — modelo de 6 pilares de conteúdo por funil (TOFU/MOFU/BOFU) para a ABSM/Millena Nóbrega.
- **Prompt — Agente de Reels** — gerador de roteiros de Reels no formato tabela (cena/imagem/áudio/fala/tempo), com DNA de ABSM e Millena Nóbrega.
- **Agente Gerador de Carrosséis** — prompt por categoria (técnico, posicionamento, storytelling, estudo de caso, identificação, venda), estilo Millena Nóbrega.
- **Agente de Stories — Categorias + Roteiros** — roteiros de stories da ABSM por categoria (engajamento, educacional, bastidores, vendas).
- **Radar Semanal — 06 abr 2026** — exemplo de pesquisa de tendências de mercado/branding (metodologia replicável, conteúdo desatualizado e de outro nicho).
- **Manual de Comunicação Visual** — paleta (dourado/vinho/bronze), tipografia (Bodoni/Didot + Garamond) e atmosfera "Grand Hotel europeu" da marca Millena Nóbrega — **não usar para a Ano Novo, Luta Nova**, cuja paleta real é terracota/verde-oliva/mostarda/bege (ver seção 1 da persona no Notion, página "Modelo de Pesquisa de Audiência"; no site, os valores oficiais estão em `src/ds/styles/tokens.css`).

Se for pedido para criar um agente de Reels, Stories ou Carrossel, ou um manual visual
**para a Ano Novo, Luta Nova**, adaptar a estrutura destes templates ao conteúdo real
das seções 1–6 acima — nunca copiar exemplos, paleta ou vocabulário da ABSM/Millena Nóbrega.

---

## Como manter isto atualizado

- **Parte I (código):** quando uma convenção mudar no código, atualize a seção
  correspondente no mesmo commit.
- **Parte II (marca):** sempre que qualquer página da Central DNA de Marca for
  editada no Notion, peça: *"Releia a Central DNA de Marca no Notion e
  re-sincronize a Parte II do AGENTS.md."*
- Edite sempre o `AGENTS.md`. O `CLAUDE.md` só o importa.
