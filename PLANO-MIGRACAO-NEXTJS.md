# Plano — Migração para Next.js, saída do Lovable e checkout WooCommerce

> Levantamento feito em 24/09/2026 a partir do código deste repositório, do
> `camila-maehler-storefront` (1.21.0), dos plugins irmãos `cm-storefront-bridge`
> (1.32.0) e `cm-paypal-store-api` (1.1.0) e da inspeção pública de
> anonovolutanova.com.br. Nada foi alterado em nenhum dos projetos.

---

## 0. Diagnóstico

### 0.1 Este repositório

O projeto **já foi Next.js** (commit `e905241`, 03/09) e o Lovable o converteu
para **TanStack Start + Vite** em 07/09 só para o preview dele enxergar as rotas
(ver `.lovable/plan/fazer-as-três-páginas-aparecerem-no-preview-2026-09-07.md`).
A conversão foi rasa, e por isso voltar é barato:

| Camada | Situação |
|---|---|
| `src/ds/**`, `src/sections/**`, `src/content/**` | React puro, sem nada de framework. Migra sem mudança. |
| `src/app/design-system/**`, `src/app/lab/**` | Já estão no formato do App Router (`page.tsx`, `"use client"`). Os arquivos em `src/routes/` só os embrulham. |
| `src/app/layout.tsx`, `src/app/route.ts`, `next.config.ts` | Sobras do Next. Estão excluídas do `tsconfig`, mas continuam no disco. |
| `src/routes/**`, `src/router.tsx`, `src/routeTree.gen.ts`, `vite.config.ts`, `src/vite-env.d.ts`, `.lovable/`, `bun.lock` | Motor do Lovable. **É o que sai.** |
| `vite.config.ts` | Tem dois contornos para o runtime serverless do Lovable (`stripCreateRequire` e o alias `react-dom/server.edge`). Nenhum dos dois faz falta fora dele. |

Rotas atuais, que precisam continuar respondendo:

- `/`, que hoje é um `<iframe>` do `public/wireframe/wireframe-v2.html` (export do Framer, 2,6 MB)
- `/design-system`
- `/design-system/lacunas`
- `/lab/hero-animation`
- `/style-guide`, que é um `<iframe>` do `public/style-guide-agenda-2027.html`

A home real em React **já existe**: `old/app-root/page.tsx` compõe as 13 seções
de `src/sections/`. Ela só saiu das rotas no commit `b300f9f`.

### 0.2 O backend que já existe

anonovolutanova.com.br **já é WordPress 7.0 + WooCommerce 11.1** (Elementor e
tema XStore, na Hostinger). A Store API (`wc/store/v1`) está pública. O que está
instalado:

| Peça | Plugin | Efeito no plano |
|---|---|---|
| Pagamento | **Asaas** (`woo-asaas`): `asaas-credit-card`, `asaas-pix` | ⚠️ O checkout da Camila foi feito para **PayPal Plus** (cartão) e **Mercado Pago** (Pix/boleto). É a maior adaptação do plano. |
| Frete | **Frenet** (`frenet/v1`) | Funciona sem mudança: o checkout só lê `shipping_rates` da Store API. |
| Afiliados | **AffiliateWP** (`affwp/v1`, `affwp/v2/portal`) | **Sai.** As afiliadas passam a ter um cupom exclusivo cada (Fase 5.1). |
| Pixel | **PixelYourSite** | Só roda no front do WordPress. No headless, o rastreio passa para GTM/dataLayer. |
| Produto | `agenda-ano-novo-luta-nova-2026` (id 19, simples, R$ 89,90) | Falta o produto 2027. |

### 0.3 O checkout da Camila Maehler

O mapeamento parte de `/checkout`, do carrinho e do add-to-cart e chega a **87
arquivos, cerca de 15 mil linhas**. Só o `src/views/Checkout.tsx` tem **3.734**.
Para um produto só, em duas edições, com Pix + cartão e checkout como
visitante, basta mais ou menos um terço disso:

- **Aproveitar quase sem mudança (a lógica):**
  - `lib/store-api.ts`: cliente da Store API. Cuida do Cart-Token e se recupera quando o token vence. Sai a parte de PayPal, cerca de 240 linhas.
  - `services/cart-service.ts` e `services/store-cart-adapter.ts`, sem a personalização (precheckout).
  - `contexts/cart-context.tsx`, `hooks/use-cart-item-removal.ts`, `types/cart.ts`.
  - `lib/checkout-api.ts`, só `order-payments` e `payment-instructions`.
  - `hooks/useCheckoutConfig.ts`, `hooks/useViaCep.ts`, `lib/br-address.ts`.
  - `components/PhoneInput.tsx`, `PixCountdown.tsx`, `PaymentInstructionsPanel.tsx`, ícones de Pix.
- **Refazer a UI:** `Checkout.tsx`, `OrderConfirmation.tsx` (657 linhas) e o carrinho (`cart-drawer`, `coupon-form`, `cart-item-meta`).
  - Hoje são shadcn sobre Tailwind 3 com tokens HSL da Camila.
  - Aqui é Tailwind 4 com tokens semânticos do DS (`src/ds/styles/tokens.css`).
  - Portar classe por classe traria a paleta da Camila junto. A lógica vem, o JSX é reescrito sobre o DS e dividido em componentes menores.
- **Deixar para trás:**
  - Personalização de anel (precheckout) e pagamento dividido (split).
  - PayPal Plus.
  - Login por WhatsApp/OTP e senha (`AuthContext`, 699 linhas; `CheckoutAuthPanel`, 579), endereços salvos, reCAPTCHA.
  - Pesquisa pós-compra, timer de "reservado", favoritos, avaliações, captura de lead.
  - O `lib/tracking/` inteiro (~1.900 linhas), trocado por um wrapper fino de `dataLayer`.
  - Redis/cache/upstream, que não entram no grafo do checkout.

A dependência escondida é o plugin **`cm-storefront-bridge`**. É ele que
entrega:

- CORS com o cabeçalho `Cart-Token` exposto. Sem isso o carrinho não persiste entre domínios.
- A extensão `cm_checkout`, que grava CPF, data de nascimento, número e bairro no pedido.
- `checkout/config`.
- O desconto do Pix.
- `payment-instructions`, que devolve o QR do Pix para a página de obrigado. Hoje ele só conhece **Mercado Pago** (`MercadoPagoInstructionProvider`).

---

## 1. Decisões

| # | Decisão | Situação |
|---|---|---|
| D1 | **Hospedagem do Next** | 🟡 **Easypanel ou Vercel, em aberto.** O código fica compatível com as duas (ver abaixo). |
| D2 | **Domínios** | ✅ O Next assume `anonovolutanova.com.br`. O WordPress vai para **`admin.anonovolutanova.com.br`**. |
| D3 | **Gateway** | 🟡 **Mercado Pago ou Asaas, em aberto.** A camada de pagamento é plugável e a escolha sai de um teste em sandbox (Fase 3.4). |
| D4 | **Bridge** | ✅ **Fork** do `cm-storefront-bridge` com o prefixo do projeto: `anln` (Fase 3.3). |
| D5 | **Home** | ✅ `/` continua servindo o **wireframe aprovado**. A home em React (`old/app-root/page.tsx`) fica fora deste plano. A Fase 2 só liga os botões do wireframe à loja. |
| D6 | **Conta do cliente** | ✅ Checkout **só como visitante**. |
| D7 | **Afiliados** | ✅ **O AffiliateWP sai.** Cada afiliada recebe um **cupom exclusivo** (Fase 5.1). |

### Como a Fase 1 fica pronta para as duas hospedagens (D1)

- `next.config.ts` com `output: "standalone"`. A Vercel ignora essa opção; o Docker precisa dela.
- Nenhum estado em disco ou memória do servidor. O carrinho vive no WooCommerce (Cart-Token), e as rotas do checkout são dinâmicas e sem cache.
- Nenhuma dependência de Redis. O storefront usa Redis só no catálogo, e um produto único não precisa dele.
- `Dockerfile` e `vercel.json` só entram quando D1 for decidido. Os dois são pequenos e não mexem no código.
- Variáveis públicas lidas por um único `env.ts`, como no storefront. No Docker, cada `NEXT_PUBLIC_*` também precisa virar `ARG`.

**O que pesa na escolha de D1:**

| Critério | Easypanel | Vercel |
|---|---|---|
| Custo | Fixo (VPS) | Grátis no Hobby, mas **o Hobby não permite uso comercial**. Loja exige o Pro, US$ 20/mês por membro. |
| Deploy | Mesmo processo da Camila, que já está rodando | `git push`, com preview por branch |
| Imagens (`next/image`) | O servidor otimiza, sem limite | Cota de otimização por plano |
| Risco no pico | Depende do tamanho da VPS | Escala sozinha |

---

## 2. Fases

### Fase 1 — Next.js no lugar do Lovable (paridade, sem mudança visual)

**Objetivo:** as mesmas 5 rotas, com o mesmo visual, rodando em `next dev` e `next build`.

> **✅ Feita em 24/09/2026** no branch `meumouse/checkout-integration`, ainda sem commit. Pendente só o item 1, que depende de acesso ao Lovable.
>
> Três pontos saíram diferentes do previsto:
>
> - **Next 16.3.6, não 16.3.1.** A 16.3.1 tem duas vulnerabilidades críticas de execução remota de código (GHSA-p293-qw3h-jr36 e GHSA-2xp9-vwfh-vxw4). A segunda está no otimizador de imagens com AVIF, que este projeto usa.
> - **Fontes:** em vez de `next/font/local`, ficou o mesmo `@font-face` inline no HTML inicial, com os mesmos preloads, que a correção de 07/09 validou. Assim o nome da família continua literal (`"Manrope"`), que é o que os tokens usam.
> - **Lint:** passa com 0 erros e 77 avisos.
>   - 55 dos avisos são cores literais que o Lovable escreveu nas seções. Ficaram como aviso **só nesses 7 arquivos**, listados em `eslint.config.mjs`; código novo continua barrado. Tokenizar essas cores é trabalho próprio.
>   - 5 são do `react-hooks/set-state-in-effect`, regra nova do Next 16, rebaixada a aviso como no storefront.

1. **Desligar a sincronização do Lovable com o GitHub**, no painel do Lovable. Sem isso ele continua empurrando commits "Changes" para `main` (o autor é `gpt-engineer-app[bot]`). *Só quem tem acesso ao projeto no Lovable consegue fazer.*
2. Dependências:
   - **Remover:** `@tanstack/react-start`, `@tanstack/react-router`, `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `vite-tsconfig-paths`, `@fontsource/*` (as fontes já estão em `public/fonts`).
   - **Adicionar:** `next@16.3.1`, `eslint-config-next@16.3.1`, `react`/`react-dom` 19.2.x. São as mesmas versões do storefront, o que facilita trazer código de lá.
   - `@tailwindcss/postcss` já está no projeto. `@tanstack/react-query` fica, porque o carrinho usa.
   - **Gerenciador: npm.** Apagar o `bun.lock`.
3. **Apagar:** `vite.config.ts`, `src/routes/`, `src/router.tsx`, `src/routeTree.gen.ts`, `src/vite-env.d.ts`, `.lovable/`.
4. **Criar** `postcss.config.mjs` com `@tailwindcss/postcss`. No `globals.css`, trocar `@source "../routes"` por `@source "../app"`.
5. **`src/app/layout.tsx`:**
   - Trocar `next/font/google` por **`next/font/local`**, apontando para os `.woff2` de `public/fonts`. Isso mantém o `font-display: block` e o preload que a correção de 07/09 resolveu.
   - Portar o `REVEAL_READY_SCRIPT` e o script de prontidão de fontes do `/design-system`, hoje em `src/routes/__root.tsx`.
   - Transformar o `head()` de cada rota em `export const metadata`.
6. **Rotas:**
   - `/`: manter o `src/app/route.ts` atual, que lê `wireframe-v2.html` e injeta `<base href="/wireframe/">`. É melhor que o iframe: não tem rolagem dupla e o título é o do próprio HTML.
   - `/style-guide`: `redirect`/`rewrite` para `/style-guide-agenda-2027.html` no `next.config.ts`.
   - `/design-system`, `/design-system/lacunas`, `/lab/hero-animation`: já são `page.tsx`. Basta tirar as exclusões do `tsconfig`.
   - Links internos (`href="/design-system/lacunas"`) podem virar `next/link`.
7. **`tsconfig.json`:** plugin `next`, `include` com `next-env.d.ts` e `.next/types/**/*.ts`, sem as exclusões de `src/app/*`. Remover a referência a `vite.config.ts`.
8. **`next.config.ts`:** tirar o modo `NEXT_EXPORT`, porque o checkout vai precisar de servidor. Adicionar `output: "standalone"`, que a Vercel ignora e o Docker precisa (ver D1).
9. **`package.json`:** scripts `dev`/`build`/`start`/`lint`/`typecheck` com `next`. Atualizar `.claude/launch.json` para `npm run dev` na porta 3000.
10. **Deploy, quando D1 for decidido:**
    - Easypanel: copiar o `Dockerfile` do storefront (3 estágios: deps, builder, runner standalone).
    - Vercel: conectar o repositório, sem configuração extra.

**Pronto quando:**

- `npm run build`, `npm run lint` e `npm run typecheck` passam limpos.
- As 5 rotas abrem sem erro no console.
- `/design-system` pinta direto em Manrope e Yellowtail, sem troca de fonte, inclusive com o cache vazio.

### Fase 2 — Ligar o wireframe à loja (D5)

> **✅ Feita em 24/09/2026**, ainda sem commit.
>
> O que saiu diferente do previsto, depois de ler o HTML do wireframe:
>
> - **Nem todo botão de compra vai para `/comprar`.** Os do topo e do cabeçalho são links `./#price`, que rolam até a oferta: é o fluxo aprovado, e ficou assim. Só os dois botões da seção de oferta mudaram. Eles abriam uma aba nova com o carrinho do WordPress (produto 2026) e agora abrem `/comprar` na mesma aba.
> - **O `<base href="/wireframe/">` saiu.** Ele fazia o `./#price` abrir a cópia crua do wireframe, fora da home. Os caminhos dos assets agora são reescritos para `/wireframe/assets/`.
> - **O snapshot abria cópias congeladas das páginas do WordPress** (contato, termos, privacidade, afiliados). Esses links agora vão para as páginas do Next.
> - **Enquanto não há checkout (Fase 4), `/comprar` termina num link de WhatsApp** com o pedido já escrito (edição e quantidade). Muda em um lugar só: `checkoutEnabled` em `src/lib/commerce/offer.ts`.
> - **O formulário da página de contato não foi migrado** (era do Elementor). A página lista WhatsApp, e-mail e Instagram.
> - **Imagem quebrada no próprio wireframe:** `assets/0ddd6486241d9f47_…jpeg` (4 ocorrências). Já estava assim no arquivo original, antes da migração.

A home continua sendo o wireframe aprovado (`public/wireframe/wireframe-v2.html`,
export do Framer). O arquivo **não é editado**: tudo o que muda entra na
resposta do `src/app/route.ts`, que já injeta o `<base href>`.

**O que o wireframe tem hoje:**

- Os botões de compra ("Garantir minha Agenda 2027" ×4, "Comprar Agora" ×2, "Comprar" ×1) **não são links**. São elementos do Framer sem destino.
- Quatro links apontam para páginas do WordPress, que vão parar de existir nesse endereço quando o WordPress for para `admin.`:
  - `/termos-e-condicoes/`
  - `/politica-de-privacidade/`
  - `/contato/`
  - `/area-afiliado/programa-de-afiliados/` (sai junto com o AffiliateWP)

**O que fazer:**

1. **Script injetado no `route.ts`** que liga cada botão de compra a `/comprar`. A marcação dos botões é pelo texto ou por um seletor estável, conferido contra o HTML. Se o seletor não achar o botão, nada quebra: o botão continua como está.
2. **Página `/comprar`** em React, com o DS. É a única página de produto enquanto a home for o wireframe:
   - capa da edição, `EditionSelector` (Color | Clássica), quantidade, preço e parcelas
   - dica "faltam N para frete grátis"
   - botão que adiciona ao carrinho e segue para o checkout
   - preço, estoque e ids das variações vêm do WooCommerce, não ficam fixos no código
3. **Páginas legais e de contato** no Next: `/termos-e-condicoes`, `/politica-de-privacidade`, `/contato`. O texto vem das páginas atuais do WordPress, lidas uma vez pela `wp/v2/pages`.
4. **`/area-afiliado/*`** redireciona para uma página curta sobre o programa por cupom, ou para o WhatsApp.
5. Metadados e Open Graph de `/` e `/comprar`, `robots.ts` e `sitemap.ts`. JSON-LD de `Product` em `/comprar`.

A home em React (`old/app-root/page.tsx`, com as 13 seções de `src/sections/`) **fica fora deste plano**. Ela entra quando for decidido trocar o wireframe; a `/comprar` já usa o mesmo DS, e é reaproveitada.

### Fase 3 — Backend WooCommerce preparado para headless

> **🟡 Parte de código feita em 24/09/2026.** O plugin `anln-storefront-bridge` 0.1.0 está em `Desktop\anln-storefront-bridge`, com repositório git próprio e ainda sem commit.
> - Gera um zip de 44 KB e não depende de Composer.
> - 23 testes de lógica passam.
> - Detalhes no `README.md` do plugin.
>
> **Descoberto ao ler o código do `woo-asaas` 2.7.7.** O plugin não tem suporte ao checkout de blocos e quebra em dois pontos quando o pedido vem da Store API:
>
> - **Cliente no Asaas:** é criado num gancho do checkout clássico que a Store API não dispara. Um pedido de visitante sairia sem cliente.
> - **Dados do cartão e parcelas:** são lidos com `filter_input( INPUT_POST )`. A Store API manda JSON, então chegariam vazios.
>
> O plugin cobre os dois (`AsaasStoreApiCompat`) e lê o Pix da meta `__ASAAS_ORDER`, com `encodedImage`, `payload` e `expirationDate`. **Nada disso rodou contra o Asaas ainda:** é o que o teste em sandbox (item 4) precisa confirmar.
>
> **Para D3:** o Mercado Pago tem checkout de blocos oficial e tokeniza o cartão no navegador. Depende menos de adaptação. O Asaas funciona com a camada de compatibilidade, mas ela depende de detalhes internos do plugin, e cada atualização do `woo-asaas` pede repetir o roteiro de sandbox.
>
> **Também entrou no plugin:**
> - O frete grátis por quantidade (item 2, opção 2), configurável no painel, com padrão de 4 unidades.
> - O desconto do Pix, configurável no próprio plugin.
>
> **Falta, e depende de acesso ao WordPress:**
> - Criar o produto 2027 (item 1).
> - Configurar o método "Frete grátis" na zona de entrega.
> - Subir o WordPress de homologação com os dois gateways em sandbox e rodar o roteiro do README do plugin (item 4).
> - Configurar os webhooks (item 5).

**No WordPress:**

1. **Produto 2027:** produto **variável** "Agenda Ano Novo, Luta Nova 2027", com atributo *Edição* (Color | Clássica), R$ 109,90, **estoque por variação** (a escassez é real) e SKU por edição.
2. **Frete grátis a partir de 4 unidades:**
   - O frete grátis nativo do WooCommerce funciona por valor, não por quantidade.
   - Opção 1: valor mínimo de R$ 439,60 (4 × 109,90). Deixa de bater se houver cupom ou mudança de preço.
   - Opção 2: regra por quantidade (Table Rate ou um snippet em `woocommerce_package_rates`). **Recomendada.**
   - As outras cotações continuam vindo do Frenet.
3. **Plugin `anln-storefront-bridge`**, fork do `cm-storefront-bridge` (D4). **O prefixo `anln` substitui o `cm` em todo lugar**, para os dois plugins nunca colidirem nem serem confundidos:

   | O quê | Camila | Ano Novo, Luta Nova |
   |---|---|---|
   | Pasta e slug do plugin | `cm-storefront-bridge` | `anln-storefront-bridge` |
   | Namespace PHP | `MeuMouse\CMStorefrontBridge\…` | `MeuMouse\AnlnStorefrontBridge\…` |
   | Namespace REST | `cm-storefront/v1` | `anln-storefront/v1` |
   | Extensão da Store API | `cm_checkout` | `anln_checkout` |
   | Opções do WordPress | `cm_bridge_*` | `anln_bridge_*` |
   | Constantes do `wp-config` | `CM_BRIDGE_*` | `ANLN_BRIDGE_*` |
   | Meta do pedido | `_billing_cpf` etc. | Mantidos. São os nomes que o WooCommerce Brasil e os gateways já leem. |
   | Chaves no front (localStorage) | `cm_cart_token` | `anln_cart_token` (a chave interna `X-CM-Internal-Key` não existe no fork: só servia à busca de conta) |

   - **Manter:**
     - `Support/Cors.php`, com origem `https://anonovolutanova.com.br` e o `Cart-Token` exposto.
     - `CheckoutCustomerFields`, que grava CPF, número, bairro e data de nascimento no pedido.
     - `checkout/config` (`GatewayCatalog`), `checkout/order-payments`, `checkout/payment-instructions`.
     - O desconto do Pix, se houver.
     - `RestHardening`.
   - **Adicionar:** o provedor de instruções de Pix do gateway escolhido (item 4).
   - **Desligar em `Plugin.php::boot()` e `RouteRegistrar::CONTROLLERS`:**
     - auth/OTP/Evolution, favoritos, leads, cupom de boas-vindas, pesquisas
     - SEO/Rank Math, rastreio dos Correios, purge do Redis
     - split, precheckout
     - Também apagar o código em vez de só desligar, para o fork ficar legível.
   - **Trocar os padrões fixos da Camila** em `SettingsRegistry.php`: URL do storefront, e-mails e redes sociais.
4. **Escolha do gateway (D3), por teste e não por opinião.** Um WordPress de homologação (cópia do atual) com os dois plugins em sandbox. Cada um passa pelo mesmo roteiro:

   | Critério | Mercado Pago | Asaas |
   |---|---|---|
   | Aceita `payment_data` no `POST /wc/store/v1/checkout` (checkout de blocos)? | A testar | A testar |
   | Cartão tokenizado no navegador (o número nunca passa pelo nosso servidor)? | Sim (SDK MercadoPago.js). O storefront já tem `tokenize-card.ts` pronto, mas não usado. | A testar |
   | Onde o QR e o copia-e-cola do Pix ficam no pedido | O bridge já sabe (`MercadoPagoInstructionProvider`) | Descobrir a meta e escrever um `AsaasInstructionProvider` |
   | Parcelamento: quem define e como chega ao front | A testar | A testar |
   | Webhook que muda o status do pedido | A testar | A testar |
   | Conta, taxas, prazo de recebimento, conciliação | Conta nova | Já ativa, com histórico |

   - **O Mercado Pago sai na frente em código:** o bridge e o storefront já cobrem Pix e têm a tokenização de cartão meio pronta.
   - **O Asaas sai na frente em operação:** já está configurado e vendendo.
   - Se os dois passarem no teste técnico, a decisão é de negócio (taxas e conta).
   - **Regra para os dois:** o número do cartão nunca passa pelo servidor Next. Ou vira token no navegador, ou o navegador posta direto na Store API por HTTPS.
5. **Webhooks do gateway** apontando para `admin.anonovolutanova.com.br`, para a confirmação do pagamento mudar o status do pedido.
6. Mover o WordPress para `admin.anonovolutanova.com.br` (D2) **só na virada** (Fase 7). Até lá, o Next de homologação aponta para o WordPress de homologação, com a origem de homologação liberada no CORS.
7. **Bloquear o front do WordPress** depois da virada: quem abrir `admin.` fora do `/wp-admin`, `/wp-json` e dos webhooks é redirecionado para `anonovolutanova.com.br`. Assim o Google não indexa duas lojas.

### Fase 4 — Carrinho e checkout no Next

> **✅ Feita em 24/09/2026**, ainda sem commit.
>
> **O que existe:**
> - Carrinho com Cart-Token (`src/lib/commerce/store-api.ts`, `src/features/cart/`), com gaveta, botão no cabeçalho e cupom sempre visível.
> - `/comprar` lendo preço, estoque e variações do WooCommerce (`ANLN_PRODUCT_ID`).
> - Checkout de 3 passos (`src/features/checkout/`), com CEP pelo ViaCEP e frete da Store API.
> - Pagamento plugável: `src/lib/payments/`, com o Asaas completo e o Mercado Pago só com Pix por enquanto.
> - `/checkout/obrigado`, que mostra o QR do Pix e se atualiza sozinha até o pagamento cair.
>
> **Desligado por padrão:** sem `NEXT_PUBLIC_CHECKOUT_ENABLED=true` e `ANLN_PRODUCT_ID`, o `/comprar` continua terminando no WhatsApp. Ligar é passo da virada (Fase 7).
>
> **Testado de ponta a ponta contra um servidor falso** da Store API e do plugin, que imita as respostas reais, o `Cart-Token` e o CORS:
> - adicionar ao carrinho, cupom inválido e válido;
> - frete grátis ao chegar em 4 unidades, CEP preenchido pelo ViaCEP de verdade;
> - validação de cada etapa e formulário restaurado depois de recarregar a página;
> - cartão recusado (o erro aparece e dá para tentar de novo);
> - Pix com QR, a página confirmando sozinha e parando de consultar;
> - celular sem rolagem horizontal.
>
> O pedido chega ao servidor no formato que o `anln-storefront-bridge` espera. **Falta o teste real, contra o WordPress de homologação** com o plugin e o gateway em sandbox (Fase 3, item 4).
>
> **Ficou para a Fase 5:**
> - atribuição do pedido (UTMs);
> - link `?cupom=`;
> - eventos de e-commerce no `dataLayer`.

**Estrutura sugerida**, seguindo as convenções do storefront e o DS daqui:

```
src/lib/commerce/
  store-api.ts        ← do storefront, sem os helpers de PayPal
  checkout-api.ts     ← só order-payments e payment-instructions
  session-store.ts
  wp-api.ts           ← namespace anln-storefront/v1
  br-address.ts
  env.ts              ← NEXT_PUBLIC_WP_URL, NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_GTM_ID
src/services/cart-service.ts, store-cart-adapter.ts   ← sem precheckout
src/contexts/cart-context.tsx
src/hooks/useCheckoutConfig.ts, useViaCep.ts, use-cart-item-removal.ts
src/lib/payments/          ← um adaptador por gateway (D3)
  types.ts                  ← contrato: id do gateway, formulário de cartão,
                              payment_data do checkout, leitura do Pix
  mercadopago.ts            ← a partir do tokenize-card.ts do storefront
  asaas.ts
  index.ts                  ← escolhe o adaptador pelo id vindo do checkout/config
src/app/comprar/page.tsx
src/app/checkout/page.tsx, checkout/obrigado/page.tsx
src/features/checkout/     ← Checkout.tsx dividido
  CheckoutPage.tsx, Stepper.tsx, ContactStep.tsx, ShippingStep.tsx,
  PaymentStep.tsx, CardForm.tsx, PixPanel.tsx, OrderSummary.tsx,
  masks.ts (CPF/CEP/telefone), persistence.ts (localStorage)
src/features/cart/CartDrawer.tsx, AddToCart.tsx, CouponForm.tsx
```

**Por que um adaptador por gateway:** D3 está em aberto. Os passos de contato e
entrega, o carrinho, o resumo e o Pix na página de obrigado não dependem do
gateway. Só o formulário de cartão e o `payment_data` mudam. Com o contrato em
`types.ts`, o checkout inteiro anda antes da decisão, e só o adaptador escolhido
precisa ser terminado. O outro é apagado.

1. **Add-to-cart** (em `/comprar`, ver Fase 2):
   - O `EditionSelector` do DS passa a escolher a **variação**.
   - `CHECKOUT_URL` deixa de ser `#comprar` e passa a ser `/comprar`.
2. **Carrinho (drawer):**
   - Refeito com `Card`/`Button`/`Badge` do DS.
   - Mantém o "desfazer" ao remover item.
   - **Campo de cupom visível**, porque o cupom passa a ser o canal das afiliadas (Fase 5.1).
3. **Checkout em 3 passos** (`contato → entrega → pagamento`), com o resumo lateral. A lógica vem do `Checkout.tsx`:
   - persistência por sessão no localStorage, com chaves `anln_checkout_*`
   - ViaCEP, `update-customer`, `shipping_rates`, `select-shipping-rate`
   - `buildCheckoutExtras()` com CPF, número e bairro
   - `POST /checkout` e redirecionamento para `/checkout/obrigado`
4. **Pagamento:**
   - **Pix:** a página de obrigado mostra o QR e o copia-e-cola via `payment-instructions`, com `PixCountdown`, e consulta `order-payments` até o pedido ser pago.
   - **Cartão:** formulário próprio conforme o que a Fase 3.4 descobrir. As parcelas vêm do `checkout/config`; o site anuncia hoje "3x de R$ 36,63".
5. **Copy dentro do DNA** (ver `CLAUDE.md` §3):
   - Sem urgência agressiva.
   - Nome do produto por extenso.
   - Página de obrigado com convite à comunidade (Grupo VIP), não só "pedido recebido".
6. **Estados de erro** (herdados do storefront): WordPress fora do ar ≠ produto inexistente; estoque esgotado leva à lista de espera, não a erro.

### Fase 5 — Afiliados por cupom, rastreio e recuperação

> **✅ Parte do site feita em 24/09/2026**, ainda sem commit. Testada de ponta a ponta contra o servidor falso da Fase 4.
>
> **Afiliadas:**
> - O link `?cupom=CODIGO` é capturado em qualquer página, inclusive na home do wireframe, por `src/proxy.ts`.
> - O código fica num cookie de 30 dias e entra sozinho no carrinho assim que ele tem itens.
> - Cupom vencido ou inexistente: aviso discreto, a compra segue. Tirado à mão: não volta.
>
> **Origem do pedido:** UTMs, cliques pagos (`fbclid`, `gclid`) e referência externa entram no pedido pela `extensions.anln_checkout.attribution`. Vale o último clique não direto. O plugin grava isso nos `_wc_order_attribution_*`, e aí o WooCommerce mostra a "Origem" do pedido.
>
> **GTM e eventos:**
> - Com `NEXT_PUBLIC_GTM_ID`, o GTM carrega em todas as páginas, inclusive no wireframe, com Consent Mode v2 negado por padrão.
> - O aviso de cookies (`public/consent.js`) grava a escolha e atualiza o consentimento. O rodapé tem o link "Preferências de cookies".
> - Eventos GA4 no `dataLayer`: `view_item`, `add_to_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info` e `purchase`.
> - O `purchase` sai só quando o pagamento é confirmado, uma vez por pedido.
>
> **Falta, fora do código:**
> - **Montar o container do GTM:** tags do GA4 e do Meta Pixel ouvindo esses eventos. Isso substitui o PixelYourSite na virada.
> - **Criar os cupons das afiliadas** (item 1 abaixo).
> - **Decidir sobre o item 3** (carrinho abandonado), que ficou de fora. Ele depende do plugin *woo-cart-abandonment-recovery* e de uma rota no bridge.
>
> Uma compra paga depois que a pessoa fecha a página de obrigado não gera `purchase` no navegador. Se isso pesar, o passo seguinte é enviar a compra pelo servidor, como o bridge da Camila faz.

1. **Afiliadas por cupom exclusivo (D7):**
   - **No WooCommerce:** um cupom por afiliada, com o nome dela (ex.: `MARIANA10`).
     - Restrito ao produto 2027.
     - "Uso individual", para não somar com outro cupom.
     - A afiliada fica registrada no próprio cupom. Pode ser a descrição ou, melhor, o campo "e-mail" em "Restrições de uso".
   - **Link da afiliada:** `anonovolutanova.com.br/?cupom=MARIANA10`.
     - O Next guarda o código num cookie de 30 dias.
     - Aplica o cupom sozinho (`apply-coupon` da Store API) quando o carrinho é criado.
     - Mostra "Cupom MARIANA10 aplicado" no carrinho e no checkout.
     - Se o cupom não existir ou vencer, o aviso é discreto e a compra segue normal.
     - Sem isso, a seguidora que chega pelo Stories precisa lembrar e digitar o código.
   - **Comissão:** relatório de cupons do WooCommerce (Analytics → Cupons), filtrado por período e só com pedidos pagos. O pagamento às afiliadas é feito à mão, a partir desse relatório.
   - **Transição:**
     - Antes da virada, exportar do AffiliateWP a lista de afiliadas ativas e as comissões em aberto.
     - Criar os cupons e avisar cada afiliada do código novo.
     - Na virada, desativar o AffiliateWP.
     - Comissões antigas ainda em aberto são pagas pelo relatório dele antes de desativar.
2. **Rastreio:**
   - GTM + `dataLayer` com os eventos GA4 de e-commerce: `view_item`, `add_to_cart`, `begin_checkout`, `add_payment_info`, `purchase`.
   - Consentimento negado por padrão, como no storefront.
   - Meta Pixel via GTM, no lugar do PixelYourSite.
3. **Carrinho abandonado (opcional):** endpoint do bridge mais o plugin *woo-cart-abandonment-recovery*.

### Fase 6 — Qualidade

- **Pedidos de ponta a ponta no sandbox do gateway escolhido:**
  - Pix pago.
  - Pix expirado.
  - Cartão aprovado, à vista e parcelado.
  - Cartão recusado.
  - Vários itens com as 2 edições.
  - 4+ unidades (frete grátis).
  - CEP de outras regiões (Frenet).
  - Cupom de afiliada digitado.
  - Cupom de afiliada pelo link `?cupom=`.
  - Cupom inválido ou vencido.
  - Estoque de uma edição zerado no meio da compra.
- **Botões de compra do wireframe:** todos os 7 levam a `/comprar`, no desktop e no celular.
- **Mobile primeiro:** o público chega pelo Instagram, inclusive pelo navegador embutido do Instagram.
- **Lighthouse em `/`, `/comprar` e `/checkout`.**
- **E-mails do WooCommerce:** a marca e os links apontam para `anonovolutanova.com.br`, não para `admin.`.

### Fase 7 — Virada

1. Congelar o conteúdo no WordPress e fazer backup (o All-in-One WP Migration já está instalado).
2. Pagar ou registrar as comissões em aberto do AffiliateWP. Entregar os cupons às afiliadas. Desativar o AffiliateWP.
3. Mover o WordPress para `admin.anonovolutanova.com.br`. Atualizar gateway (URLs e webhook), Frenet, SMTP e `siteurl`/`home`.
4. Apontar o DNS de `anonovolutanova.com.br` para o Next.
5. **Redirects 301** das URLs antigas do WordPress/Elementor, pelo menos:
   - `/produto/agenda-ano-novo-luta-nova-2026` → `/comprar`
   - `/loja` → `/comprar`
   - `/carrinho` → `/checkout`
   - `/finalizar-compra` → `/checkout`
   - `/minha-conta` → `/contato` (D6: não há conta)
   - `/area-afiliado/*` → página do programa por cupom
   - Antes da virada, listar as URLs indexadas no Search Console e completar esta lista.
6. Pedido real de valor baixo, com estorno, em produção.
7. **Plano de volta:** o site Elementor continua inteiro em `admin.` até o fim do pico. Voltar é reverter o DNS e o `siteurl`/`home`. O AffiliateWP pode ser reativado, porque desativar não apaga os dados.

---

## 3. Calendário

O ciclo comercial da marca (`CLAUDE.md` §2) é o que manda:

- Pré-lançamento em **setembro**.
- Aquecimento em **outubro e novembro**.
- **Pico de vendas de meados de novembro a janeiro.**

Uma virada de plataforma no meio do pico é o pior cenário.

| Janela | Entrega |
|---|---|
| até 01/10 | Fase 1, a paridade Next.js (pequena, porque o código já está pronto) |
| até 03/10 | **Decidir D1 (hospedagem).** Precisa estar resolvido para subir a homologação. |
| até 10/10 | Fase 3.4, o teste dos dois gateways em sandbox. **Decidir D3 aqui.** |
| até 20/10 | Fases 2, 3 e 4 em homologação |
| até 31/10 | Fases 5 e 6. Cupons das afiliadas criados e entregues. |
| **1ª semana de nov** | Fase 7, a virada, antes do pico |
| meados de nov a jan | **Congelamento**: só correções |

**Cada decisão em aberto tem prazo.** A Fase 4 anda antes de D3 por causa dos
adaptadores. Depois de 10/10, porém, cada dia sem gateway escolhido sai da
janela de testes da Fase 6.

Se a virada não couber até o começo de novembro, a alternativa segura é manter o
WordPress atual vendendo durante o pico. O Next com o wireframe entra no ar só
como vitrine, com os botões de compra levando à página do produto no WordPress.
O checkout headless fica para fevereiro, na fase de silêncio comercial.

---

## 4. Riscos

| Risco | Mitigação |
|---|---|
| Gateway sem suporte à Store API, ou com cartão só no checkout clássico | Os dois são testados na Fase 3.4, antes de escolher. Se nenhum passar no cartão: Pix no headless, e o cartão pelo checkout do WordPress. |
| D1 ou D3 decididos tarde | Prazos na seção 3. Adaptadores de pagamento para a Fase 4 não esperar D3. |
| Afiliadas vendem sem cupom depois da virada | Cupons criados e entregues antes da virada (Fase 5.1). O link `?cupom=` evita depender da seguidora digitar o código. |
| Cupom vazado para grupos de desconto | "Uso individual", restrito ao produto, com limite de uso se precisar. O relatório mostra uso fora do normal. |
| Botões do wireframe não encontrados pelo script | Seletor conferido contra o HTML e coberto na Fase 6. Se falhar, o botão fica sem ação, mas a página não quebra. |
| Carrinho não persiste (CORS/Cart-Token) | CORS do bridge com a origem exata e `Access-Control-Expose-Headers: Cart-Token`. Testar num navegador com cookies de terceiros bloqueados (Safari/iOS). |
| Lovable reescreve o repositório | Desligar a sincronização antes da Fase 1. |
| Paleta vai mudar | O checkout usa só tokens semânticos do DS, nenhuma cor literal (regra do `BRIEFING-NEXTJS.md` §1.1). |
| Escopo do `Checkout.tsx` (3,7 mil linhas) | Portar lógica, não JSX. Dividir em componentes por passo. |

---

## 5. Primeiros passos concretos

1. Desligar a sincronização do Lovable no painel.
2. Executar a Fase 1 num branch próprio (`meumouse/nextjs`). Mantê-la separada do checkout facilita a revisão.
3. Em paralelo, subir um WordPress de homologação (cópia do atual) com Mercado Pago e Asaas em sandbox e fazer o teste da Fase 3.4.
4. Decidir D1 até 03/10 e D3 até 10/10.
5. Exportar do AffiliateWP a lista de afiliadas ativas, para planejar os cupons.
