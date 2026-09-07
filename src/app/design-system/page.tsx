import {
  Accordion,
  Badge,
  Button,
  Card,
  Container,
  Counter,
  Eyebrow,
  Heading,
  Marquee,
  Reveal,
  Tabs,
  IconAniversarios,
  IconArrowRight,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconNovenaImaculada,
  IconOitavario,
  IconOutrasDatas,
  IconPlus,
  IconSeteDomingosSaoJose,
  IconSparkle,
  IconStar,
  IconTrisagio,
  Text,
  cn,
} from "@ds/index";
import { EditionSelectorDemo } from "./EditionSelectorDemo";
import { Metrics } from "./TokenMetrics";
import { AxisNav } from "./AxisNav";
import { TopBar } from "@sections/TopBar";
import { FEATURES, FeatureCard } from "@sections/About";
import { SiteHeader } from "@sections/SiteHeader";
import { Hero } from "@sections/Hero";
import { SiteFooter } from "@sections/SiteFooter";

const imgAvatarAndrea = "/img/avatar-andrea.jpg";
const imgAvatarJeje = "/img/avatar-jeje.jpg";
const imgAvatarRobson = "/img/avatar-robson.jpeg";
const imgCapaClassica = "/img/capa-classica.png";
const imgCapaColor = "/img/capa-color.png";
const imgCapaDupla = "/img/capa-dupla.png";
const imgCapaSolo = "/img/capa-solo.png";
const imgInternaAgendaDiaria = "/img/interna-agenda-diaria.png";
const imgInternaCalendario = "/img/interna-calendario.png";
const imgInternaCitacao = "/img/interna-citacao.png";
const imgInternaDatasObra = "/img/interna-datas-obra.png";
const imgInternaMetasAnuais = "/img/interna-metas-anuais.png";
const imgInternaOferta = "/img/interna-oferta.png";
const imgInternaPlanoDeVida = "/img/interna-plano-de-vida.png";
const imgInternaPropositosMes = "/img/interna-propositos-mes.png";
const imgInternaVidaOracao = "/img/interna-vida-oracao.png";
const imgLogo = "/img/logo.png";
const imgOrnamentoRodape = "/img/ornamento-rodape.png";
const imgTexturaLiturgica = "/img/textura-liturgica.png";
const imgTexturaRodape = "/img/textura-rodape.png";

/* -----------------------------------------------------------------------------
   Esta página lê os MESMOS tokens que o site. Não é documentação escrita à mão:
   se um token mudar, a página muda junto. É por isso que ela substitui um
   Storybook nesta fase — é revisável numa URL, no mesmo deploy.
   -------------------------------------------------------------------------- */

/* As 27 semânticas, agrupadas pelo papel. A página mostrava 14 e omitia a
   família --color-action inteira — justamente a que o tokens.css marca como
   "separado de accent de propósito: conflatar os dois inverteu a paleta".

   `dark` diz se O PRÓPRIO VALOR é escuro o bastante para pedir texto claro
   por cima — calculado pela luminância relativa do primitivo real em
   tokens.css, não estimado visualmente. É o que permite mostrar a cor
   preenchendo o bloco inteiro (como amostra de tinta) em vez de uma tira
   de cor colada sobre um rótulo em card branco. */
const COLOR_GROUPS = [
  {
    group: "Superfícies",
    colors: [
      { name: "--color-surface", role: "Padrão (creme)", dark: false },
      { name: "--color-surface-plain", role: "Card branco", dark: false },
      { name: "--color-surface-muted", role: "Neutra", dark: false },
      { name: "--color-surface-warm", role: "Creme quente, tile de ícone", dark: false },
      { name: "--color-surface-sage", role: "Seção de oferta", dark: false },
      { name: "--color-surface-inverse", role: "Escura", dark: true },
      { name: "--color-surface-inverse-soft", role: "Escura suave", dark: true },
      { name: "--color-surface-accent-soft", role: "Acento suave", dark: false },
      { name: "--color-surface-gold", role: "Fundo da seção Sobre", dark: false },
      { name: "--color-surface-warm-card", role: "Cards da seção Sobre", dark: true },
    ],
  },
  {
    group: "Texto",
    colors: [
      { name: "--color-text", role: "Corrido", dark: true },
      { name: "--color-text-strong", role: "Títulos", dark: true },
      { name: "--color-text-muted", role: "Secundário", dark: false },
      { name: "--color-text-display", role: "Display do hero", dark: true },
      { name: "--color-text-card", role: "Título dentro de card", dark: true },
      { name: "--color-text-on-inverse", role: "Sobre superfície escura", dark: false },
      { name: "--color-text-on-warm", role: "Sobre o card terracota", dark: false },
    ],
  },
  {
    group: "Ação — fundo de botão. É verde, e é separado de acento de propósito",
    colors: [
      { name: "--color-action", role: "Fundo de botão", dark: true },
      { name: "--color-action-hover", role: "Botão em hover", dark: true },
      { name: "--color-on-action", role: "Texto sobre o botão", dark: false },
    ],
  },
  {
    group: "Acento — destaque de TEXTO, nunca fundo de botão",
    colors: [
      { name: "--color-accent", role: "Subtítulo, selo, número", dark: true },
      { name: "--color-accent-hover", role: "Acento em hover, traço de ícone", dark: true },
      { name: "--color-accent-track", role: "Trilho do seletor", dark: false },
    ],
  },
  {
    group: "Apoio",
    colors: [
      { name: "--color-kicker", role: "Olho de seção", dark: true },
      { name: "--color-highlight", role: "Destaque dourado", dark: false },
      { name: "--color-border", role: "Traço / divisor", dark: false },
      { name: "--color-border-inverse", role: "Traço sobre superfície escura", dark: false },
    ],
  },
];

/* Os 11 degraus reais. Antes a página mostrava 7 e nenhuma métrica: peso,
   entrelinha e tracking ficavam invisíveis mesmo estando nos tokens. */
const TYPE_SCALE = [
  { token: "--text-display", label: "Display do hero", sample: "Ano Novo, Luta Nova" },
  { token: "--text-h2-hero", label: "Título de seção (hero)", sample: "Datas importantes" },
  { token: "--text-h2", label: "Título de seção", sample: "Explore a Agenda" },
  { token: "--text-h3", label: "Subtítulo", sample: "O ritmo do seu ano" },
  { token: "--text-h4", label: "Título em card", sample: "Triságio Angélico" },
  { token: "--text-stat", label: "Número de estatística", sample: "365" },
  { token: "--text-lead", label: "Lead", sample: "Santificar o cotidiano" },
  { token: "--text-base", label: "Corpo", sample: "A santidade se constrói nas pequenas coisas." },
  { token: "--text-sm", label: "Apoio", sample: "Frete grátis a partir de 4 unidades" },
  { token: "--text-xs", label: "Legenda", sample: "Edição Limitada" },
  { token: "--text-eyebrow", label: "Olho de seção", sample: "O QUE A TORNA ESPECIAL" },
];

const FONTS = [
  {
    token: "--font-sans",
    name: "Manrope",
    role: "Toda a interface: títulos, corpo, selos, números.",
    sample: "Ano Novo, Luta Nova 2027",
  },
  {
    token: "--font-script",
    name: "Yellowtail",
    role:
      "Manuscrita dos mockups de página interna — mostra a agenda preenchida. " +
      "Peso único (400).",
    sample: "Contemplar o Rosário às 16h",
  },
];

/* O design aprovado referencia 23 arquivos; estes são os que o site usa.
   A galeria mostra a arte, não o nome do arquivo: numa lista de `interna-*.png`
   ninguém reconhece qual página é qual. `tall` marca as artes de proporção
   retrato (páginas internas e capas), que ocupam duas faixas no mosaico. */
type Asset = { src: string; role: string; group: string; tall?: boolean };

const ASSETS: Asset[] = [
  { src: imgCapaSolo, role: "Capa solo", group: "Capas", tall: true },
  { src: imgCapaDupla, role: "Duas edições", group: "Capas" },
  { src: imgCapaClassica, role: "Edição Clássica", group: "Capas", tall: true },
  { src: imgCapaColor, role: "Edição Color", group: "Capas", tall: true },
  { src: imgInternaPlanoDeVida, role: "Plano de vida", group: "Páginas internas", tall: true },
  { src: imgInternaMetasAnuais, role: "Metas anuais", group: "Páginas internas", tall: true },
  { src: imgInternaAgendaDiaria, role: "Agenda diária", group: "Páginas internas", tall: true },
  { src: imgInternaCitacao, role: "Citação", group: "Páginas internas", tall: true },
  { src: imgInternaVidaOracao, role: "Vida de oração", group: "Páginas internas", tall: true },
  { src: imgInternaPropositosMes, role: "Propósitos do mês", group: "Páginas internas", tall: true },
  { src: imgInternaCalendario, role: "Calendário", group: "Páginas internas", tall: true },
  { src: imgInternaDatasObra, role: "Datas da Obra", group: "Páginas internas", tall: true },
  { src: imgInternaOferta, role: "Página da oferta", group: "Páginas internas", tall: true },
  { src: imgTexturaLiturgica, role: "Textura litúrgica", group: "Texturas" },
  { src: imgTexturaRodape, role: "Textura do rodapé", group: "Texturas" },
  { src: imgOrnamentoRodape, role: "Ornamento do rodapé", group: "Texturas" },
  { src: imgLogo, role: "Marca", group: "Marca" },
  { src: imgAvatarRobson, role: "Robson", group: "Depoimentos" },
  { src: imgAvatarAndrea, role: "Andrea", group: "Depoimentos" },
  { src: imgAvatarJeje, role: "Jejé", group: "Depoimentos" },
];

const SHADOWS = [
  { token: "--shadow-subtle", role: "Cards de depoimento", on: "plain" },
  { token: "--shadow-card", role: "Card elevado, painel do seletor", on: "plain" },
  { token: "--shadow-float", role: "Card flutuante sobre imagem", on: "plain" },
  { token: "--shadow-page", role: "Páginas internas dentro dos cards da seção Sobre", on: "warm" },
  { token: "--shadow-inset-card", role: "Os 4 cards da seção Sobre — única sombra interna do design", on: "warm" },
  { token: "--shadow-book", role: "Agenda da frente no leque do hero (via drop-shadow)", on: "plain" },
  { token: "--shadow-book-back", role: "Agenda de trás no leque do hero (via drop-shadow)", on: "plain" },
];

const RADII = [
  "--radius-xs",
  "--radius-sm",
  "--radius-md",
  "--radius-card",
  "--radius-lg",
  "--radius-pill",
];

const LITURGICAL_ICONS = [
  { Icon: IconOitavario, label: "Oitavário" },
  { Icon: IconNovenaImaculada, label: "Novena da Imaculada" },
  { Icon: IconSeteDomingosSaoJose, label: "7 Domingos de São José" },
  { Icon: IconAniversarios, label: "Aniversários" },
  { Icon: IconTrisagio, label: "Triságio Angélico" },
  { Icon: IconOutrasDatas, label: "Outras datas" },
];

const UI_ICONS = [
  { Icon: IconSparkle, label: "Sparkle" },
  { Icon: IconArrowRight, label: "Seta" },
  { Icon: IconCheck, label: "Check" },
  { Icon: IconPlus, label: "Plus" },
  { Icon: IconChevronLeft, label: "Chevron ‹" },
  { Icon: IconChevronRight, label: "Chevron ›" },
  { Icon: IconStar, label: "Estrela" },
];

const MOTION = [
  { token: "--duration-fast", role: "Micro-interação: hover, giro do + do acordeão" },
  { token: "--duration-reveal", role: "Entrada de blocos e títulos" },
  { token: "--duration-count", role: "Contagem dos números" },
  { token: "--duration-book", role: "Leque das agendas no hero" },
  { token: "--duration-edition", role: "Ciclo do seletor de edição" },
  { token: "--duration-ticker", role: "Volta completa da esteira" },
  { token: "--ease-enter", role: "Easing das entradas" },
  { token: "--ease-out-soft", role: "Easing do movimento das capas" },
  { token: "--ease-overshoot", role: "Easing do card de preço" },
];

const AXES = [
  { id: "tipografia", n: "01", kind: "Fundamentos", title: "Tipografia" },
  { id: "cores", n: "02", kind: "Fundamentos", title: "Cores & Superfícies" },
  { id: "componentes", n: "03", kind: "Elementos de UI", title: "Componentes" },
  { id: "layout", n: "04", kind: "Fundamentos", title: "Layout & Espaçamento" },
  { id: "elevacao", n: "05", kind: "Fundamentos", title: "Elevação & Sombras" },
  { id: "movimento", n: "06", kind: "Interação", title: "Movimento" },
  { id: "icones", n: "07", kind: "Ativos", title: "Ícones" },
  { id: "assets", n: "08", kind: "Ativos", title: "Assets" },
];

/**
 * A página abre com o site: mesma barra, mesmo cabeçalho, mesmo hero. Só
 * depois dele o sistema se explica, na linguagem do próprio site — faixas em
 * creme/dourado/sage, olho de seção, títulos centrados, Reveal — mas com a
 * estrutura compacta de ficha técnica da referência: linha cheia com fio de
 * divisão em vez de card flutuante, cor preenchendo o bloco inteiro em vez de
 * tira de cor sobre rótulo. A sombra só aparece onde ela É o conteúdo sendo
 * demonstrado (Componentes, Elevação) — em todo o resto o wrapper é plano.
 */
export default function DesignSystemPage() {
  return (
    <>
      {/* Sem `sticky`: aqui a barra rola com a página. Ela não compete pelo
          topo fixo com a navegação dos eixos — essa assume o posto assim
          que o scroll a alcança, como convém a quem "entrou" no design
          system, não a quem ainda está vendo a vitrine do site. */}
      <TopBar sticky={false} />
      <div>
        <SiteHeader />
        <main>
          <Hero />
          <AxisNav axes={AXES} />

          {/* Link discreto para o levantamento de peças ainda não
              documentadas. Não entra na navegação pública do site. */}
          <div className="px-6 pt-10 text-center md:px-16">
            <a
              href="/design-system/lacunas"
              className="text-sm font-semibold text-accent underline underline-offset-4"
            >
              Ver o que ainda falta documentar
            </a>
          </div>

          <AxisSection {...AXES[0]}>
            <Note>
              Duas famílias, não uma. Os componentes escolhem papel, nunca
              tamanho: a medida vive no token e é fluida entre as três larguras
              do design aprovado. Peso, entrelinha e tracking vêm com o degrau.
            </Note>

            <div>
              {FONTS.map((f) => (
                <Row key={f.token} label={f.name} meta={f.role.includes("Manuscrita") ? "Manuscrita" : "Primária"}>
                  <p
                    className="text-h3 text-text-strong"
                    style={{ fontFamily: `var(${f.token})` }}
                  >
                    {f.sample}
                  </p>
                  <Text size="sm" tone="muted" className="mt-2">
                    {f.role}
                  </Text>
                </Row>
              ))}

              {TYPE_SCALE.map((item) => (
                <Row
                  key={item.token}
                  label={item.label}
                  meta={<Metrics token={item.token} />}
                >
                  <p
                    className="text-text-strong"
                    style={{
                      fontSize: `var(${item.token})`,
                      lineHeight: `var(${item.token}--line-height, 1.15)`,
                      letterSpacing: `var(${item.token}--letter-spacing, normal)`,
                      fontWeight: `var(${item.token}--font-weight, 700)`,
                    }}
                  >
                    {item.sample}
                  </p>
                </Row>
              ))}
            </div>
          </AxisSection>

          <AxisSection {...AXES[1]} surface="gold">
            <Note>
              Duas camadas: primitivas (os valores da marca) e semânticas (o
              papel que cada valor cumpre). Componente só consome semântica — um
              lint bloqueia cor literal, então isto é regra, não convenção.
            </Note>

            <div className="space-y-10">
              {COLOR_GROUPS.map((g) => (
                <div key={g.group}>
                  <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-border/60 pb-2">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                      {g.group}
                    </span>
                    <span className="font-mono text-[11px] text-text-muted">
                      {g.colors.length} tokens
                    </span>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-y divide-border border border-border sm:grid-cols-3 lg:grid-cols-5">
                    {g.colors.map((color) => (
                      <div
                        key={color.name}
                        className={cn(
                          "flex aspect-square flex-col justify-end p-4",
                          color.dark ? "text-text-on-inverse" : "text-text-strong",
                        )}
                        style={{ background: `var(${color.name})` }}
                      >
                        <span className="text-sm font-semibold leading-snug">
                          {color.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AxisSection>

          <AxisSection {...AXES[2]}>
            <Note>
              Cada componente aqui é o mesmo que o site usa — não há cópia de
              demonstração. Mudar um deles muda o site junto.
            </Note>

            <div>
              <Row label="TopBar" meta="faixa fixa · marquee centralizada · fade lateral">
                <div className="w-full overflow-hidden rounded-lg">
                  <TopBar sticky={false} />
                </div>
              </Row>

              <Row label="Button" meta="4 variantes">

                <div className="flex flex-wrap items-center gap-3">
                  <Button>Primário</Button>
                  <Button variant="secondary">Secundário</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button size="lg">Grande</Button>
                </div>
              </Row>

              <Row label="Badge" meta="6 tons">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>Edição Limitada</Badge>
                  <Badge tone="accent">Nova Edição 2027</Badge>
                  <Badge tone="support">Envio Imediato!</Badge>
                  <Badge tone="outline">Frete Grátis</Badge>
                  <Badge tone="plain" icon={<IconSparkle />}>
                    Com ícone
                  </Badge>
                </div>
              </Row>

              <Row label="Card" meta="4 elevações">
                <div className="grid gap-4 sm:grid-cols-4">
                  <Card surface="warm">Flat</Card>
                  <Card surface="warm" elevation="subtle">
                    Subtle
                  </Card>
                  <Card surface="warm" elevation="raised">
                    Raised
                  </Card>
                  <Card surface="warm" elevation="float">
                    Float
                  </Card>
                </div>
              </Row>

              <Row label="Tabs" meta="3 painéis">
                <Tabs
                  items={[
                    { label: "Capa", content: <Text>Painel da capa.</Text> },
                    {
                      label: "Planos e Metas",
                      content: <Text>Painel de metas.</Text>,
                    },
                    {
                      label: "Agenda Diária",
                      content: <Text>Painel diário.</Text>,
                    },
                  ]}
                />
              </Row>

              <Row label="Accordion" meta="variant cards · numerado">
                <Accordion
                  variant="cards"
                  numbered
                  defaultOpen={0}
                  items={[
                    {
                      question: "A agenda é entregue na minha cidade?",
                      answer: (
                        <p>
                          Sim! Enviamos para todo o Brasil. Na hora do pedido,
                          você informa o endereço e nós cuidamos do envio com
                          todo carinho.
                        </p>
                      ),
                    },
                    {
                      question: "Qual é o tamanho e o acabamento da agenda?",
                      answer: <p>Formato A5, capa dura e espiral wire-o.</p>,
                    },
                    {
                      question: "Como posso pagar?",
                      answer: <p>Cartão de crédito e PIX.</p>,
                    },
                  ]}
                />
              </Row>


              <Row label="EditionSelector">
                <EditionSelectorDemo />
              </Row>

              <Row label="FeatureCard" last meta="4 cards · 586×600 · animação por camadas">
                <Text className="mx-auto mb-4 max-w-[620px]">
                  Os quatro boxes de destaque da seção “O que a torna especial”:
                  medidas exatas do wireframe (586×600), grade de duas colunas e a
                  animação de entrada por camadas, compartilhando um único gatilho
                  de scroll por card.
                </Text>
                <ul className="mt-8 grid justify-center gap-7 lg:grid-cols-[repeat(2,586px)]">
                  {FEATURES.map((feature, i) => (
                    <FeatureCard key={feature.strong} feature={feature} index={i} />
                  ))}
                </ul>
              </Row>
            </div>
          </AxisSection>

          <AxisSection {...AXES[3]}>
            <Note>
              O conteúdo vive em 1200px, com uma medida estreita para leitura
              corrida. Nenhuma seção define largura por conta própria.
            </Note>

            <div>
              <Row label="Medidas" meta="4 tokens">
                <div className="space-y-4">
                  <Measure token="--container-content" label="Largura de conteúdo" />
                  <Measure token="--container-prose" label="Medida de leitura" />
                  <Measure token="--spacing-section" label="Ritmo vertical de seção" />
                  <Measure token="--spacing-section-sm" label="Ritmo vertical curto" />
                </div>
              </Row>

              <Row label="Raios" meta={`${RADII.length} tokens`} last>
                <div className="flex flex-wrap gap-5">
                  {RADII.map((token) => (
                    <div key={token} className="text-center">
                      <div
                        className="size-20 border border-border bg-surface-warm"
                        style={{ borderRadius: `var(${token})` }}
                      />
                      <code className="mt-2 block text-xs text-text-muted">
                        {token.replace("--radius-", "")}
                      </code>
                    </div>
                  ))}
                </div>
              </Row>
            </div>
          </AxisSection>

          <AxisSection {...AXES[4]} surface="sage">
            <Note>
              Sete níveis, todos medidos no DOM do design aprovado — nenhum foi
              estimado. A <code>inset-card</code> é a única sombra interna do
              projeto: é ela que dá profundidade aos cards da seção Sobre.
            </Note>

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SHADOWS.map((sh) => (
                <li key={sh.token}>
                  <div
                    className={cn(
                      "grid h-28 place-items-center rounded-card",
                      sh.on === "warm"
                        ? "bg-surface-warm-card"
                        : "bg-surface-plain",
                    )}
                    style={{ boxShadow: `var(${sh.token})` }}
                  >
                    <code
                      className={cn(
                        "text-xs",
                        sh.on === "warm"
                          ? "text-text-on-warm"
                          : "text-text-strong",
                      )}
                    >
                      {sh.token.replace("--shadow-", "")}
                    </code>
                  </div>
                  <Text size="xs" tone="muted" className="mt-3">
                    {sh.role}
                  </Text>
                </li>
              ))}
            </ul>
          </AxisSection>

          <AxisSection {...AXES[5]}>
            <Note>
              Duração e easing são token, não número solto no componente. Todo o
              movimento respeita <code>prefers-reduced-motion</code> garantindo o
              estado final visível — sem isso, remover a animação deixaria blocos
              invisíveis, que foi um problema real do protótipo.
            </Note>

            <div>
              <Row label="Tokens" meta={`${MOTION.length} tokens`}>
                <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                  {MOTION.map((item) => (
                    <li key={item.token} className="text-sm text-text-strong">
                      {item.role}
                    </li>
                  ))}
                </ul>
              </Row>

              <Row label="Reveal">
                <div className="grid gap-4 sm:grid-cols-4">
                  {(["up", "left", "right", "pop"] as const).map((variant) => (
                    <Reveal key={variant} variant={variant}>
                      <Card surface="warm" className="text-center">
                        <code className="text-xs">{variant}</code>
                      </Card>
                    </Reveal>
                  ))}
                </div>
              </Row>

              <Row label="Counter">
                <div className="flex flex-wrap gap-12">
                  <div>
                    <span className="text-stat text-text-display">
                      <Counter value={365} />
                    </span>
                    <Text size="sm" tone="muted">
                      Dias de Inspiração
                    </Text>
                  </div>
                  <div>
                    <span className="text-stat text-text-display">
                      <Counter value={100} suffix="%" />
                    </span>
                    <Text size="sm" tone="muted">
                      Prático e Formativo
                    </Text>
                  </div>
                </div>
              </Row>

              <Row label="Marquee" last>
                <div className="rounded-card bg-surface-inverse py-2">
                  <Marquee
                    items={Array.from({ length: 6 }, (_, i) => (
                      <span key={i} className="text-xs text-text-on-inverse">
                        Frete Grátis a partir de 4 unidades
                      </span>
                    ))}
                  />
                </div>
              </Row>
            </div>
          </AxisSection>

          <AxisSection {...AXES[6]}>
            <Note>
              Contrato de texto, não de imagem: todo ícone é <code>1em</code> e{" "}
              <code>currentColor</code>, então herda tamanho e cor de quem o
              contém e a troca de paleta o repinta sozinho. Nenhum valor de cor
              sobrevive dentro de um SVG.
            </Note>

            <div>
              <Row label="Litúrgicos" meta="do design aprovado">
                <ul className="flex flex-wrap gap-6">
                  {LITURGICAL_ICONS.map(({ Icon, label }) => (
                    <li key={label} className="w-[104px] text-center">
                      <span className="mx-auto grid size-14 place-items-center rounded-card bg-surface-warm text-accent-hover">
                        <Icon className="size-full" />
                      </span>
                      <Text size="xs" tone="muted" className="mt-2">
                        {label}
                      </Text>
                    </li>
                  ))}
                </ul>
              </Row>

              <Row label="Interface" meta="grid 16×16">
                <ul className="flex flex-wrap items-center gap-8 text-2xl text-text-strong">
                  {UI_ICONS.map(({ Icon, label }) => (
                    <li key={label} className="text-center">
                      <Icon />
                      <Text size="xs" tone="muted" className="mt-2 text-base">
                        {label}
                      </Text>
                    </li>
                  ))}
                </ul>
              </Row>

              <Row label="Herança" meta="1em · currentColor" last>
                <div className="flex flex-wrap items-center gap-8">
                  <span className="text-sm text-text-muted">
                    <IconSparkle /> text-sm
                  </span>
                  <span className="text-2xl text-accent">
                    <IconSparkle /> text-2xl
                  </span>
                  <span className="text-4xl text-action">
                    <IconSparkle /> text-4xl
                  </span>
                </div>
              </Row>
            </div>
          </AxisSection>

          <AxisSection {...AXES[7]}>
            <Note>
              A arte que o site carrega, por papel. As páginas internas são{" "}
              <strong>páginas em branco</strong> — a letra manuscrita sobre elas é
              texto em <code>--font-script</code>, não parte do PNG. É o que
              permite corrigir a cópia sem reexportar imagem.
            </Note>

            <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [column-fill:balance]">
              {ASSETS.map((a) => (
                <figure
                  key={a.role}
                  className="mb-4 break-inside-avoid overflow-hidden rounded-xs border border-border bg-surface-plain"
                >
                  <img
                    src={a.src}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="h-auto w-full"
                  />
                  <figcaption className="flex items-baseline justify-between gap-2 px-3 py-2">
                    <span className="text-xs font-semibold text-text-strong">
                      {a.role}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                      {a.group}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </AxisSection>

        </main>
        <SiteFooter />
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

const AXIS_SURFACE = {
  warm: "bg-surface",
  gold: "bg-surface-gold",
  sage: "bg-surface-sage",
} as const;

function AxisSection({
  id,
  n,
  kind,
  title,
  surface = "warm",
  children,
}: {
  id: string;
  n: string;
  kind: string;
  title: string;
  surface?: keyof typeof AXIS_SURFACE;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 px-6 py-24 md:px-16",
        AXIS_SURFACE[surface],
      )}
    >
      <GridGuides />
      <Container className="relative z-10">
        <Reveal variant="up" className="mx-auto max-w-[760px] text-center">
          <Eyebrow className="justify-center">
            {n} · {kind}
          </Eyebrow>
          <Heading as="h2" className="mt-5">
            {title}
          </Heading>
        </Reveal>
        <div className="mt-14">{children}</div>
      </Container>
    </section>
  );
}

/**
 * Guia de grade — a textura da referência, bem apagada de propósito: ela dá o
 * ar de "ficha técnica" sem competir com o conteúdo. Some abaixo de md porque
 * numa coluna só ela não organiza nada, só teria peso visual grátis.
 */
function GridGuides() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 hidden md:block"
    >
      <div className="mx-auto grid h-full max-w-content grid-cols-12 px-6 md:px-10">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="border-r border-border/10 last:border-r-0" />
        ))}
      </div>
    </div>
  );
}

/** Texto de abertura do eixo, na medida de leitura e centrado como no site. */
function Note({ children }: { children: React.ReactNode }) {
  return (
    <Text className="mx-auto mb-4 max-w-[620px] text-center">{children}</Text>
  );
}

/**
 * A linha da ficha técnica: rótulo · espécime · métrica, separada só por um
 * fio — sem card, sem sombra, sem canto arredondado. A sombra que aparece
 * dentro de uma linha (Card raised, Reveal) é do COMPONENTE sendo demonstrado,
 * nunca do wrapper da própria linha.
 */
function Row({
  label,
  meta,
  last = false,
  children,
}: {
  label: string;
  meta?: React.ReactNode;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 border-border/60 py-7 md:grid-cols-12 md:items-start md:gap-6",
        !last && "border-b",
      )}
    >
      <div className="font-mono text-[11px] uppercase tracking-widest text-text-muted md:col-span-3">
        {label}
      </div>
      <div className="md:col-span-7">{children}</div>
      <div className="font-mono text-[11px] text-text-muted md:col-span-2 md:text-right">
        {meta}
      </div>
    </div>
  );
}

function Measure({ token, label }: { token: string; label: string }) {
  return (
    <div>
      <span className="text-sm text-text-strong">{label}</span>
      <div
        className="mt-2 h-3 rounded-pill bg-accent"
        style={{ width: `min(100%, var(${token}))` }}
      />
    </div>
  );
}
