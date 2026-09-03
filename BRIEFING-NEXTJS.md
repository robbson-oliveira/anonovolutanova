# Briefing — Migração para Next.js + React

> Documento de handoff. Escrito ao final da fase de prototipagem em HTML estático.
> A nova implementação começa **do zero**. Nada de código do Framer é aproveitado.

---

## 1. Contexto

**Produto:** Agenda católica anual "Ano Novo, Luta Nova 2027", tema **"Patos à Água"**,
inspirada em São Josemaria Escrivá. Produto físico, impresso em lote limitado.

**Situação atual — dois exports do Framer na raiz, ambos apenas referência visual:**

| Arquivo | O que é |
|---|---|
| `wireframe_old.html` | A página completa (2,8 MB) + dezenas de remendos aplicados por cima. Protótipo de alta fidelidade. |
| `design-system.html` | O **design system** (381 KB), intitulado "Design System — Agenda 2026". |

Nenhum dos dois é código-fonte. Ambos usam classes hashed e tokens em UUID gerados pelo build
do Framer. Servem para **ler as decisões**, não para portar.

**Objetivo:** reconstruir em **Next.js + React** como base de uma plataforma maior (não é só
landing page — vai crescer para checkout, afiliados, lista de espera).

**Arquitetura definida: o site inteiro é servido pelo design system.**
Ou seja, o design system é a **primeira entrega**, não um anexo. As páginas são composição de
componentes dele — nada de estilo solto por página.

**Fora do escopo desta migração** (trabalhos paralelos, já em andamento): o DNA de marca
(`CLAUDE.md`) e as skills em `.claude/`. Use-os como insumo, não como entrega.

---

## 1.1 Dois avisos que mudam decisões de arquitetura

### ⚠️ O wireframe está em ESCALA DE CINZA
O `wireframe_old.html` tem `html { filter: grayscale(100%) }` aplicado — era um modo de revisão
de estrutura. **O design aprovado é o layout, não as cores.** Não reconstruir um site cinza.
As cores vêm dos tokens (seção 7).

### ⚠️ As cores VÃO mudar
Já está decidido que a paleta será alterada depois da migração. Consequência direta na
arquitetura: **nenhum valor de cor pode estar escrito dentro de componente**. Tem que existir
uma única fonte de verdade de tokens, com nomes **semânticos** (`--surface`, `--accent`,
`--text-muted`) e não literais (`--terracota`, `--verde`). Trocar a paleta inteira precisa ser
editar um arquivo só.

### Onde estão as decisões mais recentes
Os ajustes finais **não** estão no HTML original do Framer: estão em um bloco
`<style id="wireframe-grayscale">` no topo do `<head>` e em alguns `<script>` logo depois dele.
É ali que vivem tamanhos, tempos de animação, o seletor de edição, a esteira e o contador.

---

## 2. O que NÃO aproveitar

- Todo o bundle e runtime do Framer
- Classes hashed (`.framer-8f3ii3`, `.framer-s1q3x7`, `.framer-1jb8crg`…) — são artefatos de build
- Os `!important` e contornos de especificidade (existiam só para brigar com o bundle)
- A camada de contorno de hidratação (sweep auto-corretivo, animação-como-rede-de-segurança)
- O filtro `grayscale(100%)` — era só para modo wireframe

---

## 3. Assets prontos (`/assets`)

| Arquivo | Conteúdo | Uso |
|---|---|---|
| `capa-2027-feminina.png` | Capa aquarela, patos, fundo claro | **Edição Color** |
| `capa-2027-masculina.png` | Capa azul-marinho com dourado | **Edição Clássica** |
| `capa-agenda-2027.png` | Composição dos dois livros juntos | Hero |
| `capa-agenda-2027-solo.png` | Capa aquarela isolada | Miniaturas |
| `logo-2027.png` | Marca: dois patos em moldura oval | Header e footer |

> ⚠️ Os nomes "feminina/masculina" são legado de uma etapa anterior. Na interface os rótulos
> corretos são **"Edição Color"** e **"Edição Clássica"**. Vale renomear os arquivos na migração.

Todas as capas são PNG com canal alfa (fundo transparente de verdade).
Dimensões: Color 1036×1519 · Clássica 1085×1519 (mesma altura de origem).

---

## 4. Especificações validadas (portar como comportamento, não como código)

### Preço
- **R$ 109,90** · linha de parcelamento: **"Ou 3x de R$ 36,63"** (centralizada, ~18px, 75% de opacidade)
- Selo **"Edição Limitada"** acima do preço

### Seletor de edição (seção "Explore a Agenda")
- Dois itens: **Edição Color** | **Edição Clássica**, ~22px, Manrope
- Item ativo: negrito, cor terracota `rgb(157,79,35)`, com **barra de progresso** de 3px embaixo
- A barra preenche de 0→100% em **6s** e então alterna automaticamente para a outra edição, em loop
- **Pausa** enquanto o mouse estiver sobre a capa ou sobre o próprio seletor; retoma de onde parou
- Clique manual troca e reinicia a barra

### Paridade das capas (regra importante)
As duas capas devem ter **altura fixa idêntica** (`height` fixo + `width: auto`).
**Não usar `object-fit: contain` para dimensionar** — nesse caso a altura renderizada passa a
depender da proporção de cada imagem, e capas com margens internas diferentes ficam
dessincronizadas. Foi um problema real nesta fase.

### Barra fixa do topo
- 36px de altura, fundo escuro, `position: fixed`
- Texto: **"Frete Grátis a partir de 4 unidades"** em esteira contínua horizontal
- Loop de **34s**, sem salto (duplicar o conteúdo e transladar exatamente −50%)
- Pausa no hover
- O layout precisa reservar essa altura (no protótipo: `padding-top: 42px`)

### Bloco de números (contagem animada)
- **365** Dias de Inspiração · **12** Temas Mensais · **100%** Prático e Formativo
- Sobem de 0 até o valor ao entrar na tela, **1,6s** com `easeOutCubic`
- Preservar o sufixo (`%`) e nunca reler um valor já em animação como se fosse o alvo

### Animações de entrada
- Todos os `h2`/`h3` de seção: fade + subida de ~28px + leve blur, 0,75s, `cubic-bezier(.22,.61,.36,1)`
- Blocos de conteúdo entram lateralmente em pares (um pela esquerda, outro pela direita, ~0,09s de defasagem)
- Respeitar `prefers-reduced-motion` **garantindo o estado final visível** (não basta remover a animação)

### Capa interativa
- Imagem da capa com **3 hotspots "+"** posicionados em percentuais, que abrem descrições
- ⚠️ **Pendência:** os textos dos hotspots ainda descrevem a capa de 2026 (estética de **vitral**).
  Precisam ser reescritos para a capa 2027 (aquarela, patos à água).

---

## 5. Estrutura de seções

Navegação: `Início · Sobre · O que tem dentro · Depoimentos · Afiliados · FAQ` + ícone de conta + botão **Comprar**

1. **Hero** — "Ano Novo, Luta Nova" / "Viva o caminho de santidade no dia a dia" + parágrafo + CTA
   "Garantir minha Agenda 2027" + selos (Nova Edição 2027 · Envio Imediato) + bloco de números
   + card flutuante de preço + composição dos dois livros
2. **Sobre / "Mais que uma agenda. Um caminho de santidade em cada página."**
3. **Explore a Agenda** — seletor de edição + abas (Capa · Propósitos do Mês e Calendário ·
   Planos e Metas · Planejamento Financeiro · Agenda Diária) + capa interativa
4. **Citação** de São Josemaria Escrivá (centralizada na largura da página)
5. **Persona** — "Feita para quem quer viver com propósito"
6. **Depoimentos**
7. **Oferta / Preço** — "Oferta e Condições Especiais"
8. **Datas importantes** para quem vive os ensinamentos de São Josemaria
9. **FAQ**
10. **Footer** — logo + tagline + links + copyright + nota sobre a ADEC

---

## 6. Recomendações para a nova base

- **`git init` antes de qualquer coisa.** Nesta fase os backups foram feitos à mão (16 arquivos
  `.bak` em `/backups`) porque não havia versionamento.
- Definir se o conteúdo (preço, depoimentos, FAQ, datas litúrgicas) vai para CMS/banco desde o
  início — a página tem bastante conteúdo que muda por ciclo sazonal anual.
- O ciclo comercial é sazonal e agressivo (pré-lançamento em setembro → pico de vendas de
  novembro a janeiro). Ver `CLAUDE.md`, seção 2.
- Considerar desde já: checkout, área de afiliados e lista de espera / Grupo VIP — são os pontos
  de crescimento citados como motivo da migração.

---

## 7. Design System — o que já está definido

O `design-system.html` está organizado em **6 eixos**, que devem virar a estrutura da
biblioteca em React:

1. **Tipografia**
2. **Cores & Superfícies**
3. **Componentes de UI**
4. **Layout & Espaçamento**
5. **Movimento & Interação**
6. **Ícones**

### Tokens de cor oficiais (extraídos do arquivo)

| Hex | Papel |
|---|---|
| `#9d4f23` | Terracota — destaque, item ativo, CTAs |
| `#344c24` | Verde médio |
| `#233319` | Verde escuro — barra do topo, superfícies escuras |
| `#efc886` | Dourado / mostarda — acento |
| `#f5f7f9` | Cinza claro — superfície |

Valores complementares em uso na página (candidatos a virar token):
fundo creme `#fff5eb` · texto corrido `rgb(94,92,88)` · título `rgb(29,50,45)`

### Tipografia
**Manrope** em todo o site (pesos 400/500/600/700). Uma face secundária "Alexandria"
aparece pontualmente no bloco de números.

> ⚠️ O arquivo se chama "Design System — **Agenda 2026**". Os tokens e escalas seguem válidos,
> mas o conteúdo de exemplo é do ciclo anterior — inclusive a seção de preço aparece como
> "Sob Consulta", que **não** é mais o caso (hoje é R$ 109,90 divulgado).
