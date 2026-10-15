# Roteiro da virada — site em Next.js no ar

Passo a passo da Fase 7 do `PLANO-MIGRACAO-NEXTJS.md`. Depois da virada:

- `anonovolutanova.com.br` passa a servir o Next.js;
- o WordPress vai para `admin.anonovolutanova.com.br`.

Marque cada item ao concluir. **Não comece com pendência nas seções 1 e 2.**

**Janela recomendada:** 1ª semana de novembro de 2026, antes do pico, num dia de semana pela manhã, com a equipe de atendimento avisada.

---

## 1. Decisões e contas (antes do dia)

- [ ] **D1, hospedagem.**
  - **Easypanel:** usar o `Dockerfile` deste repositório, já testado em imagem local.
  - **Vercel:** conectar o repositório. É preciso o plano Pro, porque o Hobby não permite uso comercial.
- [ ] **D3, gateway**, escolhido depois do teste em sandbox (seção 2).
- [ ] **Container do GTM** criado, com:
  - tag do GA4 (evento de configuração mais os eventos de e-commerce do `dataLayer`: `view_item`, `add_to_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`);
  - Meta Pixel com os eventos equivalentes;
  - Consent Mode ligado. Os acionadores de consentimento são `anln_consent_granted` e `anln_consent_denied`.
- [ ] **Cupons das afiliadas criados no WooCommerce de produção:** um por afiliada, com "uso individual" e restritos aos dois produtos 2027. Lista de afiliadas exportada do AffiliateWP.
- [ ] **Produtos 2027 criados em produção:** dois produtos **simples**, um por edição, com "Edição Color" e "Edição Clássica" no nome e o atributo **Edição** com o valor `Color` ou `Clássica` (o nome com a edição é o que o carrinho e o pedido mostram), R$ 109,90, estoque próprio, peso e dimensões, e a **imagem principal** (é a miniatura do site). Anotar o **id** de cada um (vão para `ANLN_PRODUCT_COLOR` e `ANLN_PRODUCT_CLASSIC`).
- [ ] **Zona de entrega Brasil** com o método "Frete grátis" **sem requisito**, ao lado da Frenet.

## 2. Homologação (ambiente local em Docker, `dev/wordpress`)

- [ ] Chaves **de sandbox** do gateway escolhido configuradas no wp-admin local, por quem tem acesso à conta.
- [ ] **Roteiro do `anln-storefront-bridge/README.md` (seção "Roteiro de teste no sandbox") cumprido:**
  - carrinho;
  - frete com 1 unidade e com 4;
  - Pix gerado e pago;
  - cartão aprovado à vista e em 3x;
  - cartão recusado;
  - cliente criado no painel do gateway.
- [ ] Pix confirmado pelo webhook, por túnel (`cloudflared tunnel --url http://localhost:8088`), com a página de obrigado virando "Pedido confirmado!" e o `purchase` no `dataLayer`.
- [ ] Teste no celular, pelo navegador do Instagram (abrir um link colado no Direct).
- [ ] Lighthouse de `/` e `/checkout` no celular, com os números anotados.

## 3. Véspera

- [ ] **Backup completo do WordPress de produção:** arquivos e banco. O All-in-One WP Migration já está instalado. Guardar fora do servidor.
- [ ] **TTL do DNS** de `anonovolutanova.com.br` reduzido para 300 s (no dia, a troca propaga rápido).
- [ ] **Registro DNS `admin.anonovolutanova.com.br`** criado apontando para a mesma hospedagem do WordPress (Hostinger), com SSL emitido para o subdomínio.
- [ ] **Deploy do Next** feito no destino (Easypanel ou Vercel), acessível por uma URL provisória. Variáveis:

  | Variável | Valor | Build ou execução |
  |---|---|---|
  | `NEXT_PUBLIC_WP_URL` | `https://admin.anonovolutanova.com.br` | build |
  | `NEXT_PUBLIC_SITE_URL` | `https://anonovolutanova.com.br` | build |
  | `NEXT_PUBLIC_CHECKOUT_ENABLED` | `false` por enquanto (liga no passo 4.7) | build |
  | `NEXT_PUBLIC_GTM_ID` | `GTM-…` | build |
  | `ANLN_PRODUCT_COLOR` | id do produto da Edição Color | execução |
  | `ANLN_PRODUCT_CLASSIC` | id do produto da Edição Clássica | execução |
  | `ANLN_HOME_COMMING_SOON` | `true` enquanto a home for a página "Em breve"; `false` para abrir a landing page | execução |
  | `ANLN_HOME_DEV_PASSWORD` | senha de `/home-dev` (landing page para revisão enquanto a home é "Em breve"); vazia depois da virada | execução |
  | `ANLN_PRECHECKOUT` | `true` para abrir `/carrinho` (venda pelo link do Grupo VIP) | execução |

- [ ] **Comissões em aberto do AffiliateWP** pagas ou registradas. Afiliadas avisadas do link novo: `https://anonovolutanova.com.br/?cupom=CODIGO`.

## 4. Dia da virada

1. [ ] **Modo manutenção** no WordPress, para não entrarem pedidos no meio da troca.
2. [ ] **Plugin `anln-storefront-bridge` instalado e ativado em produção**, pelo zip de `php bin/build-plugin.php`. Em *WooCommerce → ANLN Storefront*:
   - Checkout: CPF obrigatório, 3x sem juros, desconto do Pix se houver.
   - Frete grátis a partir de **4**.
   - Avançado → CORS: `https://anonovolutanova.com.br`.
   - **"URL do site" ainda vazia.**
3. [ ] **WordPress para o subdomínio.** Em *Configurações → Geral*, trocar as duas URLs para `https://admin.anonovolutanova.com.br`, ou pelo WP-CLI:

   ```bash
   wp option update home https://admin.anonovolutanova.com.br
   ```

   ```bash
   wp option update siteurl https://admin.anonovolutanova.com.br
   ```

   ```bash
   wp search-replace https://anonovolutanova.com.br https://admin.anonovolutanova.com.br --skip-columns=guid --dry-run
   ```

   Confira o resultado do `--dry-run`. Se estiver certo, rode de novo sem `--dry-run`.
4. [ ] **Gateways e integrações apontando para o subdomínio:**
   - webhook do gateway no painel dele: `https://admin.anonovolutanova.com.br/asaas-webhook/` para o Asaas; para o Mercado Pago, a URL que o próprio plugin mostra;
   - Frenet;
   - SMTP (WP Mail SMTP);
   - remetente dos e-mails do WooCommerce.
5. [ ] **AffiliateWP e PixelYourSite desativados.** Desativar não apaga os dados.
6. [ ] **DNS de `anonovolutanova.com.br` e `www` apontados para o Next.** Aguarde a propagação e confira:

   ```bash
   curl -sI https://anonovolutanova.com.br/ | head -3
   ```

   ```bash
   curl -sI https://admin.anonovolutanova.com.br/wp-json/ | head -3
   ```

7. [ ] **Checkout ligado:** `NEXT_PUBLIC_CHECKOUT_ENABLED=true` e novo deploy (é variável de build).
8. [ ] **Pedido real** de valor baixo, com cupom de 100% ou produto de teste oculto: Pix pago, confirmado e **estornado**. Conferir no wp-admin:
   - CPF, número e bairro;
   - "Origem" do pedido;
   - e-mail ao cliente.
9. [ ] **"URL do site"** preenchida em *WooCommerce → ANLN Storefront → Avançado*: `https://anonovolutanova.com.br`. A partir daí, as páginas do tema redirecionam para o site. Conferir:

   ```bash
   curl -sI https://admin.anonovolutanova.com.br/produto/agenda-ano-novo-luta-nova-2026/ | grep -i location
   ```

10. [ ] **Modo manutenção desligado.**

## 5. Depois

- [ ] Search Console: propriedade de `anonovolutanova.com.br` com o sitemap novo (`/sitemap.xml`) enviado e as URLs removidas (410) acompanhadas.
- [ ] O GA4 mostra o funil nas primeiras 24 h, e os pedidos chegam com origem.
- [ ] O `admin.` fica fora do Google: o redirecionamento do plugin cuida das páginas, mas confira no Search Console.
- [ ] TTL do DNS de volta ao normal depois de uma semana estável.

## Plano de volta

O WordPress continua inteiro em `admin.` durante todo o pico, então voltar é desfazer, na ordem:

1. **DNS** de `anonovolutanova.com.br` de volta para a Hostinger.
2. **`home` e `siteurl`** de volta para `https://anonovolutanova.com.br`, e o `search-replace` ao contrário.
3. **"URL do site"** do plugin **vazia**. Sem isso, o WordPress redirecionaria para si mesmo.
4. **AffiliateWP e PixelYourSite** reativados. Os dados continuam lá.
5. **Webhooks do gateway** de volta ao domínio principal.

Pedidos feitos pelo Next durante a janela ficam no WooCommerce normalmente: não há dado para migrar de volta.
