# Agenda Ano Novo, Luta Nova — site

Site headless da Agenda Ano Novo, Luta Nova (anonovolutanova.com.br): landing page
do produto em Next.js, com carrinho e checkout próprios sobre um WordPress com
WooCommerce. O WordPress fica só como painel e API, em
`admin.anonovolutanova.com.br`.

Este README é o passo a passo para montar a instalação inteira do zero: o
WordPress com o WooCommerce, o plugin **anln-storefront-bridge** e o site. As
diretrizes de código estão no [`AGENTS.md`](AGENTS.md); a troca de domínio em
produção, no [`RUNBOOK-VIRADA.md`](RUNBOOK-VIRADA.md).

- [1. Como as peças se ligam](#1-como-as-peças-se-ligam)
- [2. Pré-requisitos](#2-pré-requisitos)
- [3. Ambiente local em Docker](#3-ambiente-local-em-docker)
- [4. WordPress de homologação ou produção](#4-wordpress-de-homologação-ou-produção)
- [5. Site em Next.js](#5-site-em-nextjs)
- [6. Conferir a instalação](#6-conferir-a-instalação)
- [7. Problemas comuns](#7-problemas-comuns)

---

## 1. Como as peças se ligam

```
 navegador ──────────────► anonovolutanova.com.br (Next.js)
     │                         │  no servidor: preço, estoque e imagem das
     │                         │  edições (Store API) e páginas institucionais (wp/v2)
     │                         ▼
     └── direto, com CORS ─► admin.anonovolutanova.com.br (WordPress + WooCommerce)
         carrinho, frete,        ├─ wc/store/v1          Store API do WooCommerce
         pedido, pagamento       ├─ anln-storefront/v1   plugin anln-storefront-bridge
                                 └─ gateways (Asaas / Mercado Pago), frete (Frenet)
```

- O **carrinho e o pedido** passam pela Store API do WooCommerce, chamada direto do
  navegador. O carrinho do visitante é identificado pelo cabeçalho `Cart-Token`,
  guardado no `localStorage`.
- O **plugin bridge** cobre o que a Store API não faz sozinha para uma loja
  brasileira: CORS com o `Cart-Token` exposto, CPF/CNPJ, número e bairro no pedido,
  formas de pagamento por tipo, frete grátis por quantidade, cotação de frete sem
  carrinho, QR code do Pix e resumo do pedido para a página de obrigado. Detalhes
  no `README.md` do próprio plugin.
- Sem o WordPress no ar, a home continua abrindo com os dados de
  `src/content/product.ts`. Sem o checkout ligado (seção 5), a compra termina no
  pedido pelo WhatsApp.

## 2. Pré-requisitos

| Peça | Versão |
| --- | --- |
| Node.js | 24 (o mesmo do `Dockerfile`) e npm |
| WordPress | 6.4 ou mais novo (produção: 7.0) |
| PHP | 8.1 ou mais novo (o Docker local usa 8.3), com a extensão `zip` para gerar o pacote do plugin |
| WooCommerce | 8.2 ou mais novo (testado até 11.1) |
| Docker Desktop | só para o ambiente local |

Os dois repositórios ficam **lado a lado**, na mesma pasta. O Docker local monta o
plugin direto de `../anln-storefront-bridge`:

```
Desktop/
├── anonovolutanova/          este repositório (site)
└── anln-storefront-bridge/   plugin WordPress (repositório próprio)
```

## 3. Ambiente local em Docker

O jeito mais rápido de ter tudo funcionando. Um script configura o WordPress
exatamente como a produção precisa (loja, produto, frete, cupom e bridge), e
qualquer edição no plugin vale na hora, sem reinstalar. Referência completa:
[`dev/wordpress/README.md`](dev/wordpress/README.md).

**1. Suba o WordPress e o banco:**

```bash
docker compose -f dev/wordpress/docker-compose.yml up -d
```

**2. Rode o script de configuração** (pode rodar de novo quantas vezes quiser; ele
confere antes de criar). No Git Bash do Windows:

```bash
MSYS_NO_PATHCONV=1 docker compose -f dev/wordpress/docker-compose.yml --profile cli run --rm wpcli bash /setup/setup.sh
```

No PowerShell, macOS ou Linux, sem o `MSYS_NO_PATHCONV=1`:

```bash
docker compose -f dev/wordpress/docker-compose.yml --profile cli run --rm wpcli bash /setup/setup.sh
```

O script ([`setup.sh`](dev/wordpress/setup.sh) e [`setup.php`](dev/wordpress/setup.php)):

1. instala o WordPress em pt-BR, com fuso de São Paulo e links permanentes `/%postname%/`;
2. grava usuário e senha do wp-admin em `dev/wordpress/.admin-password` (fora do git);
3. instala e ativa WooCommerce e Mercado Pago (`woocommerce-mercadopago`), e
   ativa o `anln-storefront-bridge` e o Asaas (`wc-asaas-store-api`), os dois
   montados das pastas irmãs deste repositório (ver `dev/wordpress/README.md`);
4. configura a loja para o Brasil, cria os produtos 2027 (um por edição, com a
   capa do site como imagem principal), a zona de frete, o cupom `MARIANA10` e as
   opções do bridge.

| O quê | Onde |
| --- | --- |
| wp-admin | http://localhost:8088/wp-admin |
| Store API | http://localhost:8088/wp-json/wc/store/v1 |
| Bridge | http://localhost:8088/wp-json/anln-storefront/v1/checkout/config |
| Produtos 2027 | dois produtos simples, Edição Color e Edição Clássica, R$ 109,90, 50 em estoque cada. O `setup.sh` mostra os ids no fim |

**3. Ligue o site a ele.** Crie o `.env.local` na raiz deste repositório (fora do
git):

```
NEXT_PUBLIC_WP_URL=http://localhost:8088
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CHECKOUT_ENABLED=true
ANLN_PRODUCT_COLOR=23
ANLN_PRODUCT_CLASSIC=25
ANLN_HOME_COMMING_SOON=false
ANLN_PRECHECKOUT=true
```

Use os ids que o `setup.sh` mostrou (ele imprime as duas linhas prontas).

**4. Instale as dependências e suba o site:**

```bash
npm ci
```

```bash
npm run dev
```

O site abre em http://localhost:3000. No ambiente local, o mu-plugin
[`anln-local-dev.php`](dev/wordpress/mu-plugins/anln-local-dev.php) libera no CORS
qualquer `http://localhost:<porta>` e descarta os e-mails (eles aparecem em
`wp-content/debug.log`). Ele só age com `WP_ENVIRONMENT_TYPE=local` e **nunca vai
para produção**.

**5. Pagamento (opcional).** Asaas e Mercado Pago vêm instalados, mas **sem
chaves**, e por isso não aparecem no checkout. Para testar, configure as chaves de
sandbox como na seção [4.6](#46-formas-de-pagamento).

Para apagar tudo (banco e arquivos do WordPress; o plugin, que fica na pasta dele,
não é afetado):

```bash
docker compose -f dev/wordpress/docker-compose.yml down -v
```

## 4. WordPress de homologação ou produção

Num WordPress de verdade não há script: cada passo abaixo é feito pelo wp-admin.
Eles reproduzem o que o `setup.php` faz no ambiente local, mais o que só existe
em produção (gateway com chaves, Frenet, SMTP).

### 4.1 WordPress

1. **HTTPS** ativo no domínio do WordPress. Pagamento com cartão e o `Cart-Token`
   dependem dele.
2. *Configurações → Links permanentes*: qualquer opção **menos "Simples"** (o
   padrão é "Nome do post"). O site chama `/wp-json/…`, que não existe com links
   simples.
3. *Configurações → Geral*: fuso horário **São Paulo** e idioma **Português do
   Brasil**.
4. A REST API precisa estar **aberta para visitantes**. Plugins de segurança com a
   opção de "desativar a REST API" quebram o site.
5. Se houver cache de página (LiteSpeed Cache, Cloudflare…), **exclua `/wp-json/`
   do cache**. Um carrinho servido do cache mostra o carrinho de outra pessoa.

### 4.2 WooCommerce

Instale e ative o **WooCommerce** (*Plugins → Adicionar novo*) e pule o assistente
inicial. Depois, em *WooCommerce → Configurações*:

| Aba | Ajuste |
| --- | --- |
| **Geral** | País da loja: Brasil (o estado da loja). Ativar taxas: **não**. Ativar o uso de cupons: **sim**. Moeda: **Real brasileiro (R$)**, posição "Esquerda com espaço", separador de milhar `.`, decimal `,`, 2 casas decimais. |
| **Produtos** | Unidade de peso: **kg**. Unidade de dimensões: **cm**. |
| **Contas e privacidade** | **Permitir que clientes façam pedidos sem uma conta**: sim. O checkout do site é só de visitante. |
| **Visibilidade do site** | **Ao vivo** (o ambiente local desliga o modo "Em breve"). |

### 4.3 Produtos 2027

Cada edição é um **produto simples** próprio, com preço, estoque e imagem
principal. Em *Produtos → Adicionar novo*, crie os dois:

1. **Nome:** `Agenda Ano Novo, Luta Nova 2027 — Edição Color` e
   `Agenda Ano Novo, Luta Nova 2027 — Edição Clássica`. Tipo: **Produto simples**.
2. **Atributos** (opcional, só informativo para a loja) → *Adicionar novo*:
   **`Edição`** com o valor **`Color`** num produto e **`Clássica`** no outro.

   > O site sabe qual produto é cada edição pelo id (`ANLN_PRODUCT_COLOR` e
   > `ANLN_PRODUCT_CLASSIC`). No carrinho e no pedido só chega o nome, então
   > mantenha "Edição Color" e "Edição Clássica" nele: é o que faz o resumo
   > mostrar "Edição: Color" (`src/lib/commerce/editions.ts`).
3. Em cada um:
   - SKU (no local: `ANLN-2027-COLOR` e `ANLN-2027-CLASSICA`);
   - preço normal **109,90** (o mesmo de `src/content/product.ts`);
   - **Gerenciar estoque** marcado, com a quantidade disponível;
   - **peso e dimensões do pacote**. Sem eles a Frenet não cota frete. O ambiente
     local usa 0,5 kg e 22 × 16 × 3 cm; em produção, use as medidas reais;
   - **imagem do produto**: é a miniatura que o site mostra na escolha da edição,
     no carrinho, no checkout e na página de obrigado. Sem imagem, o site usa a
     capa guardada nele.
4. Publique e **anote o id de cada produto** (aparece na URL do editor,
   `post=<id>`). O da Color vira o `ANLN_PRODUCT_COLOR` do site; o da Clássica,
   o `ANLN_PRODUCT_CLASSIC`.

### 4.4 Frete

Em *WooCommerce → Configurações → Entrega*:

1. Crie (ou edite) a zona **Brasil**, com a região "Brasil".
2. Adicione o frete pago. Em produção é a **Frenet** (plugin próprio, com a conta
   da loja); para testar sem conta, uma **Taxa fixa** serve (no local: "PAC (teste
   local)", R$ 24,90).
3. Adicione o método **Frete grátis** com **"Frete grátis requer…" = nenhum
   requisito**.

   Quem libera o frete grátis é o bridge, a partir de **4 unidades** (qualquer
   combinação das edições). Se o método tiver requisito próprio (valor mínimo,
   cupom), a regra do bridge não funciona. Quando o frete grátis aparece, os fretes
   pagos somem (ajustável no bridge).

### 4.5 Cupons de afiliada

Em *Marketing → Cupons*, um cupom por afiliada:

- tipo **Desconto percentual**, com o valor combinado (no local: `MARIANA10`, 10%);
- *Restrição de uso*: **Uso individual** marcado e **Produtos** = o produto 2027.

O link da afiliada é `https://anonovolutanova.com.br/?cupom=CODIGO`. O site guarda o
código num cookie e aplica o cupom assim que o carrinho tiver um item.

### 4.6 Formas de pagamento

O site não depende de um gateway específico: ele lê as formas de pagamento **por
tipo** (`pix`, `card`, `boleto`) no `checkout/config` do bridge. Um gateway só
aparece no checkout quando está **ativo e com chaves**.

| Gateway | Plugin | Ids | O que o site aceita hoje |
| --- | --- | --- | --- |
| **Asaas** | `wc-asaas-store-api` | `asaas-pix`, `asaas-credit-card`, `asaas-ticket` | Pix, cartão (à vista e parcelado) e boleto |
| **Mercado Pago** | `woocommerce-mercadopago` | `woo-mercado-pago-pix`, `woo-mercado-pago-custom`, `woo-mercado-pago-ticket` | só Pix (cartão e boleto ainda não foram escritos no site) |

**Asaas:**

1. Instale o `anln-storefront-bridge` 0.5.0 ou mais novo **antes** do plugin do
   Asaas (ver 4.7): é ele que desliga o campo obrigatório de CPF/CNPJ que o plugin
   do Asaas cria na Store API, e sem isso todo checkout do site volta erro.
2. Instale e ative o **Asaas Gateway for WooCommerce - Store API**
   (`wc-asaas-store-api`), pelo zip do repositório dele. Ele substitui o antigo
   `woo-asaas`: ao ser ativado, desativa o `woo-asaas` e reaproveita a chave de API,
   o webhook e os clientes dele.
3. Pegue a chave de API no painel do Asaas, em *Integrações*. Para testes, use uma
   conta de [sandbox.asaas.com](https://sandbox.asaas.com).
4. Em *WooCommerce → Configurações → Pagamentos*, abra **Asaas Pix**, **Asaas
   Cartão de Crédito** (e **Boleto**, se for usar). Escolha o ambiente
   (**Sandbox** ou **Produção**), cole a chave e ative. No cartão, configure as
   parcelas como o site anuncia (até 3x, sem juros): o checkout mostra só as
   parcelas sem juros configuradas no gateway, que é quem cobra os juros.
5. **Webhook.** O Pix e o boleto só são confirmados pelo webhook. Cadastre no
   painel do Asaas a URL `https://<domínio-do-wordpress>/asaas-webhook/` (em
   produção, `https://admin.anonovolutanova.com.br/asaas-webhook/`), seguindo o que
   a tela de configuração do plugin pede para autenticar o webhook.

**Mercado Pago:** instale o plugin oficial e cole as credenciais (de **teste**, em
homologação) da conta de desenvolvedor. O webhook é a URL que o próprio plugin
mostra.

**Confirmação do pagamento:** o cartão aprova na hora; o Pix espera o webhook. O
gateway não alcança `localhost`: para testar a confirmação no ambiente local, use um
túnel (`cloudflared tunnel --url http://localhost:8088`) e cadastre a URL do túnel,
ou marque o pedido como pago no wp-admin. A página de obrigado do site muda
sozinha quando o status muda.

### 4.7 Plugin anln-storefront-bridge

**1. Gere o pacote** na pasta do plugin:

```bash
php bin/build-plugin.php
```

Isso cria `dist/anln-storefront-bridge-<versão>.zip`, só com o que roda em
produção. O plugin não tem dependências de Composer.

**2. Instale:** *Plugins → Adicionar novo → Enviar plugin*, escolha o zip e ative.
O WooCommerce precisa estar ativo antes; sem ele, o plugin só mostra um aviso.

**3. Configure** em *WooCommerce → ANLN Storefront*. Os valores recomendados:

| Aba | Campo | Valor | Para quê |
| --- | --- | --- | --- |
| Checkout e frete | Exigir CPF no checkout | ativado | CPF obrigatório (na compra como empresa, vale o CNPJ) |
| | Exigir data de nascimento | desativado | |
| | Desconto no Pix (%) | 0, ou o desconto combinado | Aplicado uma vez, no pedido, e anunciado no checkout. Se o plugin **Parcelas Customizadas** tiver desconto para o gateway, vale o dele |
| | Parcelas máximas (cartão) | **3** | O site anuncia 3x sem juros |
| | Parcelas sem juros | **3** | |
| | Juros ao mês (%) | 0 | |
| | Frete grátis a partir de (unidades) | **4** | Precisa bater com `FREE_SHIPPING_MIN_QTY` de `src/content/product.ts`. 0 desliga a regra |
| | Esconder fretes pagos quando o frete for grátis | ativado | |
| | Prazo de postagem (dias úteis) | o da operação | Somado ao prazo de toda transportadora no "Calcular frete e prazo" |
| | Prazo do frete grátis (dias úteis) | o da transportadora usada | O "Frete grátis" não tem prazo próprio; 0 = sem previsão |
| Avançado | Origens permitidas (CORS) | `https://anonovolutanova.com.br`, uma por linha, mais a URL de homologação, se houver | **Obrigatório.** Uma origem fora da lista é bloqueada pelo navegador |
| | Prioridade do hook CORS | 100 | Só mude se outro plugin sobrescrever os cabeçalhos |
| | URL do site | **vazio** até a virada | Preenchido, as páginas do tema redirecionam (301) para o site. Com o WordPress ainda no domínio do site, ele redirecionaria para si mesmo. Ver `RUNBOOK-VIRADA.md` |

**4. Constantes opcionais no `wp-config.php`:**

```php
// Somadas às origens do painel (vírgula ou quebra de linha).
define( 'ANLN_BRIDGE_ALLOWED_ORIGINS', 'https://anonovolutanova.com.br' );
// Prioridade do CORS; tem precedência sobre o painel.
define( 'ANLN_BRIDGE_CORS_PRIORITY', 100 );
// Só com Cloudflare ou outro proxy na frente, para o limite de requisições usar o IP real.
define( 'ANLN_BRIDGE_TRUST_PROXY', true );
```

**Atualizar o plugin:** gere o zip da versão nova e envie de novo pelo mesmo
caminho (o WordPress oferece substituir). Antes, leia o `CHANGELOG.md` do plugin:
as versões que pedem ajuste de configuração trazem o aviso no topo.

### 4.8 Páginas institucionais

O site lê o conteúdo de duas páginas do WordPress pela REST (`wp/v2/pages`) e
guarda por uma hora. Crie-as em *Páginas*, publicadas, com estes **slugs**:

| Slug | Rota no site |
| --- | --- |
| `politica-de-privacidade` | `/politica-de-privacidade` |
| `termos-e-condicoes` | `/termos-e-condicoes` |

Se a página não existir ou o WordPress não responder, o site mostra o título e um
aviso com o WhatsApp e o e-mail de contato.

### 4.9 E-mails

Os e-mails do pedido saem do WooCommerce. Em produção, configure um SMTP (o site
usa o **WP Mail SMTP**) e o remetente em *WooCommerce → Configurações → E-mails*.

## 5. Site em Next.js

### Variáveis de ambiente

Modelo em [`.env.example`](.env.example). Localmente, em `.env.local`.

| Variável | Exemplo | Quando é lida | Para quê |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_WP_URL` | `https://admin.anonovolutanova.com.br` | build | WordPress: Store API, bridge e páginas |
| `NEXT_PUBLIC_SITE_URL` | `https://anonovolutanova.com.br` | build | URL canônica (sitemap, Open Graph, JSON-LD) |
| `NEXT_PUBLIC_CHECKOUT_ENABLED` | `true` | build | Liga carrinho e checkout. `false`: a compra termina no WhatsApp |
| `NEXT_PUBLIC_GTM_ID` | `GTM-XXXXXXX` | build | Google Tag Manager. Vazio: eventos só no `dataLayer` |
| `NEXT_PUBLIC_WHATSAPP_CHAT_NUMBER` | `5527992794290` | build | Número que recebe as mensagens do chat do WhatsApp da página "Em breve". Vazio: `5527992794290` |
| `ANLN_PRODUCT_COLOR` | `23` | execução (servidor) | Id do produto da Edição Color (seção 4.3) |
| `ANLN_PRODUCT_CLASSIC` | `25` | execução (servidor) | Id do produto da Edição Clássica (seção 4.3) |
| `ANLN_HOME_COMMING_SOON` | `true` | execução (servidor) | A home mostra a página "Em breve" (a do Grupo VIP) no lugar da landing page |
| `ANLN_PRECHECKOUT` | `true` | execução (servidor) | Abre a página `/carrinho` (escolha da edição e carrinho antes do checkout). Desligada, `/carrinho` leva à oferta da home |

O checkout só liga com `NEXT_PUBLIC_CHECKOUT_ENABLED=true` **e** os dois
`ANLN_PRODUCT_*` definidos. As `NEXT_PUBLIC_*` entram no código do navegador na hora do build:
mudar uma delas exige **build novo**, não só reiniciar. As `ANLN_*` são lidas pelo
servidor a cada pedido (`src/proxy.ts`) ou a cada minuto (a oferta): basta
reiniciar o container.

As duas chaves combinam. Com `ANLN_HOME_COMMING_SOON=true` e `ANLN_PRECHECKOUT=true`,
a home fica em "Em breve" e o link `/carrinho` (divulgado no Grupo VIP, por exemplo
com `?cupom=`) vende direto.

### Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor local em http://localhost:3000 |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sem gerar arquivos |
| `npm run build` | Build de produção (`output: "standalone"`) |

### Imagem Docker (Easypanel)

As `NEXT_PUBLIC_*` vão como `--build-arg` (no Easypanel, "Build Args"). Sem
`NEXT_PUBLIC_WP_URL`, o build falha de propósito.

```bash
docker build --build-arg NEXT_PUBLIC_WP_URL=https://admin.anonovolutanova.com.br --build-arg NEXT_PUBLIC_SITE_URL=https://anonovolutanova.com.br --build-arg NEXT_PUBLIC_CHECKOUT_ENABLED=true --build-arg NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX --build-arg NEXT_PUBLIC_WHATSAPP_CHAT_NUMBER=5527992794290 -t anonovolutanova .
```

```bash
docker run --rm -p 3000:3000 -e ANLN_PRODUCT_COLOR=23 -e ANLN_PRODUCT_CLASSIC=25 -e ANLN_PRECHECKOUT=true anonovolutanova
```

## 6. Conferir a instalação

Troque `WP` pela URL do WordPress (`http://localhost:8088` no local) e `SITE` pela
origem do site (`http://localhost:3000` no local).

**Os produtos das duas edições** (cada um `"type":"simple"`, com preço, estoque,
o atributo `Edição` e a imagem em `images`; troque pelos seus ids):

```bash
curl -s "WP/wp-json/wc/store/v1/products?include=23,25"
```

**Configuração do checkout** (gateways por tipo, parcelas, desconto do Pix,
`free_shipping_min_qty`):

```bash
curl -s WP/wp-json/anln-storefront/v1/checkout/config
```

**CORS do bridge.** A resposta precisa trazer
`Access-Control-Allow-Origin: SITE`; sem esse cabeçalho, a origem não está na lista:

```bash
curl -si -X OPTIONS WP/wp-json/anln-storefront/v1/checkout/config -H "Origin: SITE" -H "Access-Control-Request-Method: GET"
```

**Carrinho de visitante.** A resposta traz o cabeçalho `Cart-Token`, e
`Access-Control-Expose-Headers` inclui `Cart-Token`:

```bash
curl -si WP/wp-json/wc/store/v1/cart -H "Origin: SITE"
```

**Frete sem carrinho** (o campo se chama `variation_id`, mas recebe o id do
produto simples; no local, 23 é a Color). Com `quantity` 4, só o frete grátis deve
aparecer:

```bash
curl -s -X POST WP/wp-json/anln-storefront/v1/shipping/estimate -H "Content-Type: application/json" -d "{\"variation_id\":23,\"quantity\":1,\"postcode\":\"01310100\"}"
```

**No navegador:** abra o site (ou `/carrinho`, com `ANLN_PRECHECKOUT=true`),
adicione as duas edições, calcule o frete e vá até o checkout. Com um gateway em sandbox, faça um Pix e um cartão e confira no
wp-admin o pedido com CPF, número, bairro e "Origem". O roteiro completo de teste
de pagamento está no `README.md` do plugin, em "Roteiro de teste no sandbox".

## 7. Problemas comuns

| Sintoma | Causa provável |
| --- | --- |
| `/wp-json/…` dá 404 | Links permanentes em "Simples" (4.1). No Docker local, falta o `.htaccess`: rode o `setup.sh` de novo |
| O site mostra "pedir pelo WhatsApp" em vez do carrinho | `NEXT_PUBLIC_CHECKOUT_ENABLED` não é `true` no build, falta `ANLN_PRODUCT_COLOR` ou `ANLN_PRODUCT_CLASSIC`, ou um dos ids não é de produto simples publicado (4.3, 5) |
| Erro de CORS no console do navegador | A origem do site não está em *Avançado → CORS* do bridge. Desde a versão 0.4.1, a lista vazia bloqueia o site |
| O carrinho esvazia a cada página | O `Cart-Token` não chega ao JavaScript: CORS de outro plugin ou do servidor sobrescrevendo o do bridge (suba a prioridade do CORS), ou `/wp-json/` em cache |
| Nenhuma forma de pagamento no checkout | Gateway inativo ou sem chaves (4.6) |
| O cartão do Mercado Pago não aparece | Esperado: o site ainda só aceita Pix por ele (4.6) |
| Frete grátis não aparece com 4 unidades | O método "Frete grátis" tem requisito próprio, ou não está na zona Brasil (4.4) |
| Nenhum frete cotado | Produtos sem peso ou dimensões, ou CEP fora de toda zona de entrega (4.3, 4.4) |
| O resumo do pedido mostra o nome inteiro do produto em vez de "Edição: Color" | O nome do produto no WooCommerce não traz "Edição Color" ou "Edição Clássica" (4.3) |
| A miniatura mostra a capa antiga | O produto não tem imagem no WooCommerce (4.3) |
| `/carrinho` volta para a home | `ANLN_PRECHECKOUT` não é `true` no ambiente do servidor (5) |
| O Pix não confirma | O webhook não chega ao WordPress: URL errada no painel do gateway, ou WordPress em `localhost` sem túnel (4.6) |
| O WordPress redireciona para si mesmo | "URL do site" do bridge preenchida antes da virada (4.7) |
| Mudei uma `NEXT_PUBLIC_*` e nada mudou | Ela é lida no build: gere um build novo (5) |

## Mais documentação

- [`AGENTS.md`](AGENTS.md): convenções de código, design system e DNA de marca.
- [`dev/wordpress/README.md`](dev/wordpress/README.md): o WordPress local em detalhe.
- [`RUNBOOK-VIRADA.md`](RUNBOOK-VIRADA.md): a troca de domínio em produção.
- [`PLANO-MIGRACAO-NEXTJS.md`](PLANO-MIGRACAO-NEXTJS.md): histórico, fases e decisões em aberto.
- `README.md` e `CHANGELOG.md` do `anln-storefront-bridge`: o que o plugin faz, o
  roteiro de teste de pagamento e as mudanças de cada versão.
