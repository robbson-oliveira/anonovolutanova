# WordPress local (Docker)

Faz o papel do `admin.anonovolutanova.com.br` no desenvolvimento: WooCommerce 11 com o produto 2027, frete, cupom de afiliada e dois plugins montados direto das pastas deles, irmãs deste repositório: o **anln-storefront-bridge** (`../anln-storefront-bridge`) e o **Asaas Gateway for WooCommerce - Store API** (`../wc-asaas-store-api`). Uma edição em qualquer um dos dois vale na hora, sem reinstalar.

O plugin do Asaas ainda não está no WordPress.org: clone o repositório dele ao lado deste e rode `composer install` na pasta `admin/` dele antes de subir (sem o `admin/vendor`, o wp-admin mostra um aviso e os gateways não carregam). Um banco criado antes da troca tinha o `woo-asaas` ativo: o `setup.sh` o desativa, e o plugin novo reaproveita a chave de API e o webhook dele.

## Subir

```bash
docker compose -f dev/wordpress/docker-compose.yml up -d
```

```bash
MSYS_NO_PATHCONV=1 docker compose -f dev/wordpress/docker-compose.yml --profile cli run --rm wpcli bash /setup/setup.sh
```

- `MSYS_NO_PATHCONV=1` só é necessário no Git Bash do Windows. Sem ele, o `/setup/setup.sh` vira um caminho do Windows.
- O script pode rodar de novo quantas vezes precisar: ele confere antes de criar.
- Na primeira vez, ele instala o WordPress e grava usuário e senha do wp-admin em `dev/wordpress/.admin-password`. O arquivo fica fora do git.

| O quê | Onde |
|---|---|
| Site / wp-admin | http://localhost:8088 · http://localhost:8088/wp-admin |
| Store API | http://localhost:8088/wp-json/wc/store/v1 |
| Plugin | http://localhost:8088/wp-json/anln-storefront/v1/checkout/config |
| Produtos 2027 | dois produtos simples, "— Edição Color" e "— Edição Clássica", R$ 109,90, 50 em estoque cada, com a capa do site (`public/img`) como imagem principal. O `setup.sh` mostra os ids no fim |
| Frete | zona Brasil: "PAC (teste local)" R$ 24,90 e "Frete grátis" (liberado pelo plugin a partir de 4 unidades) |
| Cupom | `MARIANA10`, 10%, só nos produtos 2027 |

## Ligar o Next a ele

`.env.local` na raiz do repositório (fora do git):

```
NEXT_PUBLIC_WP_URL=http://localhost:8088
NEXT_PUBLIC_CHECKOUT_ENABLED=true
ANLN_PRODUCT_COLOR=23
ANLN_PRODUCT_CLASSIC=25
ANLN_PRECHECKOUT=true
```

Troque `23` e `25` pelos ids que o `setup.sh` mostrou (ele já imprime as duas linhas). Um banco criado antes da troca
para produtos simples tinha o produto variável (id 10): o `setup.sh` o manda para
a lixeira e cria os dois produtos no lugar.

O CORS aceita qualquer `http://localhost:<porta>`: o plugin de ajustes locais (`mu-plugins/anln-local-dev.php`) cuida disso só neste ambiente. Ele também descarta os e-mails, que vão para o `debug.log`.

## Gateways de pagamento (sandbox)

Asaas e Mercado Pago já vêm instalados e ativos, mas **sem chaves**. Sem chave, nenhum dos dois aparece no checkout. Quem tem acesso às contas configura pelo wp-admin:

- **Asaas:**
  1. Crie uma conta em [sandbox.asaas.com](https://sandbox.asaas.com) e copie a chave de API em *Integrações*.
  2. Em *WooCommerce → Configurações → Pagamentos*, abra **Asaas Pix** e **Asaas Cartão de Crédito**.
  3. Escolha o ambiente **Sandbox**, cole a chave e ative.
  4. Em **Asaas Cartão de Crédito**, deixe as parcelas como o site anuncia (até 3x, sem juros). O checkout mostra só as parcelas sem juros configuradas ali, porque é o plugin quem cobra os juros.
- **Mercado Pago:** use as credenciais **de teste** da conta de desenvolvedor.

**Confirmação de pagamento:**
- **Cartão:** aprova na hora, sem webhook.
- **Pix:** só é confirmado pelo webhook do gateway, e o gateway não alcança `localhost`. Para testar a confirmação do Pix:
  - exponha a porta 8088 com um túnel (`cloudflared tunnel --url http://localhost:8088`) e cadastre a URL no painel do sandbox; ou
  - marque o pedido como pago no wp-admin e veja a página de obrigado mudar sozinha.

Roteiro completo do teste: `README.md` do `anln-storefront-bridge`.

## Zerar

```bash
docker compose -f dev/wordpress/docker-compose.yml down -v
```

Isso apaga banco e arquivos do WordPress. O plugin, que fica na pasta dele, não é afetado.
