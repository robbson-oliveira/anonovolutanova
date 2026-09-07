import type { ReactNode } from "react";
import {
  Badge,
  Button,
  Card,
  Carousel,
  Container,
  Counter,
  Eyebrow,
  Heading,
  IconAsterisk,
  IconCheck,
  IconSparkle,
  IconStar,
  Reveal,
  Section,
  Text,
  BookCover,
  cn,
} from "@ds/index";
import { TopBar } from "@sections/TopBar";
import { SiteHeader } from "@sections/SiteHeader";
import { SiteFooter } from "@sections/SiteFooter";
import { BookStage } from "@sections/BookStage";
import { Faq } from "@sections/Faq";
import { Quote } from "@sections/Quote";
import { Persona } from "@sections/Persona";
import { Closing } from "@sections/Closing";
import { Explore } from "@sections/Explore";
import { STATS } from "@content/home";
import { OFFER } from "@content/offer";
import { installmentLabel, priceLabel } from "@content/product";

/* -----------------------------------------------------------------------------
   Inventário das peças da home que ainda não têm ficha no catálogo — agora com
   a peça renderizada ao lado da descrição, para discussão. Esta página não
   altera token, componente nem wireframe.
   -------------------------------------------------------------------------- */

type Prioridade = "alta" | "media" | "baixa";

type Lacuna = {
  nome: string;
  onde: string;
  falta: string;
  prioridade: Prioridade;
  demo?: ReactNode;
  demoNota?: string;
  /** Peças largas ocupam a linha inteira do preview. */
  larga?: boolean;
};

type Grupo = {
  id: string;
  n: string;
  titulo: string;
  descricao: string;
  itens: Lacuna[];
};

/* ---------------------------------- demos --------------------------------- */

function DemoContainerSection() {
  return (
    <div className="space-y-3">
      <Section surface="warm" spacing="tight" className="rounded-card">
        <Text size="sm" tone="muted">
          Section surface=&quot;warm&quot; · spacing=&quot;tight&quot; ·
          Container max-w-content
        </Text>
      </Section>
      <Section surface="inverse" spacing="tight" className="rounded-card">
        <Text size="sm" className="text-text-on-inverse">
          Section surface=&quot;inverse&quot;
        </Text>
      </Section>
      <Container width="prose" className="border border-dashed border-border py-4">
        <Text size="sm" tone="muted">
          Container width=&quot;prose&quot; (~640px de leitura)
        </Text>
      </Container>
    </div>
  );
}

function DemoCarousel() {
  return (
    <Carousel label="Exemplo de carrossel">
      {[1, 2, 3, 4].map((i) => (
        <li key={i} className="w-[240px] shrink-0 snap-start">
          <Card surface="plain" elevation="raised" padding="md">
            <Text size="sm">Item {i} do trilho com scroll-snap.</Text>
          </Card>
        </li>
      ))}
    </Carousel>
  );
}

function DemoBookCover() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {[
        { src: "/img/capa-color.png", alt: "Capa Color" },
        { src: "/img/capa-classica.png", alt: "Capa Clássica" },
        { src: "/img/capa-solo.png", alt: "Capa Solo" },
      ].map((c) => (
        <div key={c.src} className="text-center">
          <BookCover src={c.src} alt={c.alt} height={180} />
          <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-text-muted">
            {c.alt}
          </p>
        </div>
      ))}
    </div>
  );
}

function DemoBookStage() {
  return (
    <div className="h-[380px] overflow-hidden">
      <div className="origin-top-left scale-[0.5]">
        <BookStage />
      </div>
    </div>
  );
}

function DemoTipografia() {
  return (
    <div className="space-y-4">
      <Eyebrow>Eyebrow · olho de seção</Eyebrow>
      <Heading as="p" level="display">
        Display
      </Heading>
      <Heading as="p" level="hero">
        Hero
      </Heading>
      <Heading as="p" level="section">
        Título de seção
      </Heading>
      <Heading as="p" level="subsection">
        Subseção
      </Heading>
      <Heading as="p" level="card" tone="accent">
        Título de card (tom accent)
      </Heading>
      <Text>Corpo padrão do site.</Text>
      <Text size="sm" tone="muted">
        Corpo pequeno, tom discreto.
      </Text>
    </div>
  );
}

function DemoStats() {
  return (
    <div className="flex flex-wrap gap-12">
      {STATS.map((s) => (
        <div key={s.label}>
          <p className="text-h2 text-accent">
            <Counter value={s.value} suffix={s.suffix} />
          </p>
          <Text size="sm" tone="muted" className="mt-1">
            {s.label}
          </Text>
        </div>
      ))}
    </div>
  );
}

function DemoCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Card surface="plain" elevation="raised">
        <span className="text-accent">
          <IconSparkle />
        </span>
        <p className="mt-3 font-semibold text-text-strong">Card branco</p>
        <Text size="sm" tone="muted" className="mt-1">
          Datas litúrgicas e depoimentos.
        </Text>
      </Card>
      <Card surface="warm" elevation="flat">
        <p className="font-semibold text-text-strong">Card creme</p>
        <Text size="sm" tone="muted" className="mt-1">
          Única versão hoje no catálogo.
        </Text>
      </Card>
      <Card surface="muted" elevation="subtle">
        <p className="font-semibold text-text-strong">Card muted</p>
        <Text size="sm" tone="muted" className="mt-1">
          Superfície de apoio.
        </Text>
      </Card>
      <Card surface="inverse" elevation="float">
        <p className="font-semibold">Card escuro</p>
        <Text size="sm" className="mt-1 text-text-on-inverse opacity-80">
          Fechamento e blocos de destaque.
        </Text>
      </Card>
    </div>
  );
}

function DemoCardDepoimento() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Card surface="plain" elevation="raised">
        <div className="flex items-center gap-3">
          <img
            src="/img/avatar-andrea.jpg"
            alt=""
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-text-strong">Andrea</p>
            <div className="flex text-accent">
              {[0, 1, 2, 3, 4].map((i) => (
                <IconStar key={i} />
              ))}
            </div>
          </div>
        </div>
        <Text size="sm" className="mt-4">
          Card de depoimento: avatar, nome, estrelas e relato.
        </Text>
      </Card>
      <Card surface="plain" elevation="raised" className="flex flex-col justify-between">
        <div>
          <Text size="sm" tone="muted">
            Agenda 2027
          </Text>
          <p className="text-h3 text-text-strong">R$ 109,90</p>
        </div>
        <Button className="mt-4">Comprar Agora</Button>
      </Card>
    </div>
  );
}

function DemoBadges() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="accent">accent</Badge>
        <Badge tone="soft">soft</Badge>
        <Badge tone="outline">outline</Badge>
        <Badge tone="plain" icon={<IconSparkle />}>
          plain (hero)
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-card bg-surface-inverse p-5">
        <Badge tone="support">support</Badge>
        <Badge tone="plainInverse" icon={<IconAsterisk />}>
          plainInverse (fundo escuro)
        </Badge>
      </div>
    </div>
  );
}

function DemoBotoes() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary">primary</Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="inverse">inverse</Button>
        <span className="inline-flex rounded-card bg-surface-inverse p-2">
          <Button variant="ghost">ghost</Button>
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="md">tamanho md</Button>
        <Button size="lg">tamanho lg</Button>
        <Button shape="block">shape block</Button>
        <Button shape="pill">shape pill</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button>repouso</Button>
        <Button disabled>desabilitado</Button>
      </div>
    </div>
  );
}

function DemoChecklist() {
  return (
    <ul className="space-y-3">
      {[
        "Quem quer organizar o dia sem perder a vida interior",
        "Quem recomeça em janeiro e quer um sistema diário",
        "Quem procura um presente com propósito",
      ].map((t) => (
        <li key={t} className="flex items-start gap-3">
          <span className="mt-1 text-accent">
            <IconCheck />
          </span>
          <Text size="sm">{t}</Text>
        </li>
      ))}
    </ul>
  );
}

/* -----------------------------------------------------------------------------
   Seção de oferta reconstruída a partir do CSS REAL do wireframe, não de print.
   Origem de cada valor: public/wireframe/wireframe-v2.html, section#price
   ("Price -Section"). As classes .framer-* citadas abaixo são as do próprio
   arquivo — dá para conferir cada número buscando a classe lá.

   Duas armadilhas que derrubaram as tentativas anteriores, ambas causadas pelo
   `html { filter: grayscale(100%) }` que o wireframe aplica em si mesmo:
     · o cartão NÃO é cinza — é verde-escuro #374e24 com borda #81884d;
     · o botão NÃO é claro/translúcido — é o degradê laranja
       linear-gradient(62deg, #FF7A2F 0%, #FF7A2F 42%, #F4D36A 100%).
   Quem olhou só a captura leu os dois dessaturados e documentou ao contrário.

   Breakpoints do wireframe: <768 / 768–1199,98 / ≥1200. O 768 coincide com o
   `md` padrão do Tailwind; para o 1200 não há equivalente padrão, daí o
   arbitrário `min-[1200px]:`.
   -------------------------------------------------------------------------- */

const CARD_BG = "#374e24";
const CARD_BORDER = "#81884d";
const BOTAO_GRADIENTE =
  "linear-gradient(62deg, #FF7A2F 0%, #FF7A2F 42%, #F4D36A 100%)";
const CHECK_GRADIENTE = "linear-gradient(225deg, #81884D 0%, #344C24 100%)";

/* Medidas do wireframe a 1440px de viewport, lidas com getComputedStyle no DOM
   renderizado (com as animações de entrada neutralizadas):

     painel ............... 1440×1266, bg #d0d1b1, raio 90px, overflow clip
     container ............ 1200 de largura, padding-top 208px, gap 87px
     bloco de texto ....... 760×197, gap 21px
     coluna do preço ...... 537×774, centrada  →  @452
     cartão ............... 537×774 @452,492, pad-top 54px, gap 16px
     caixa do preço ....... 394×180 @523,546
     botão ................ 394×72  @523,742
     bandeiras ............ 128×21  @656,840   (SVG único, centrado)
     checklist ............ 537×309 @452,877, pad-top 50px
       └ frame ............ 354×259 @543,927, gap 21px

   Os gaps fecham exatos: 546+180+16=742 · 742+72+16+10=840 · 840+21+16=877.
   O cartão termina em 1266 — a mesma base do painel, por isso só o topo é
   arredondado. Quem sangra e é cortado pelo `overflow: clip` são as imagens. */

/**
 * Cartão escuro central (.framer-11n5j7r "Content").
 *
 * Só o topo é arredondado (24px) e a altura é fixa (774px no desktop): o
 * cartão encosta na base do painel de propósito. Quem sangra e é cortado pela
 * borda arredondada são as duas imagens, não ele.
 */
function OfertaCartao() {
  return (
    <div
      className={cn(
        "relative z-10 flex w-full flex-col items-center justify-start overflow-clip",
        "h-[774px] max-w-[588px] rounded-t-[24px] pt-[54px]",
        "max-[1199px]:h-[760px] max-[1199px]:w-[477px] max-[1199px]:max-w-[558px] max-[1199px]:px-[60px]",
        "max-md:h-[645px] max-md:px-6 max-md:pt-[30px]",
        "gap-4",
        "shadow-[0_22px_15.1px_#00000080]",
      )}
      style={{ backgroundColor: CARD_BG }}
    >
      {/* Caixa do preço (394×180): fundo #81884d4d, raio 12px e um fio de
          1.03822px SÓ na base — não é um contorno completo. */}
      <div
        className={cn(
          "flex w-full max-w-[394px] flex-col items-center rounded-[12px] p-5",
          "gap-5 max-md:gap-1.5",
          "border-b-[1.03822px] border-b-[#dcdcdc33]",
        )}
        style={{ backgroundColor: "#81884d4d" }}
      >
        {/* Selo (139×36): py 10px + texto de 16px com leading 100%. O texto
            precisa do tamanho explícito — herdando o do pai daria 40px. */}
        <div className="flex items-center gap-2.5 py-2.5 max-md:gap-[5px] max-md:py-1">
          <IconSparkle className="text-[16px] text-white" />
          <p className="text-[16px] font-bold leading-none tracking-[-0.04em] text-white">
            {OFFER.badge}
          </p>
        </div>

        {/* Preço (234×84): no wireframe o valor e o parcelamento são irmãos
            dentro do MESMO container, então o gap de 10,38px da coluna não
            entra entre os dois. A conta é 54 + 6 (margem) + 24 (leading). */}
        <div className="flex flex-col items-center">
          <p className="text-[54px] font-bold leading-none tracking-[-0.05em] text-white">
            {priceLabel}
          </p>
          <p className="mt-[6px] text-[18px] font-medium leading-[24px] tracking-[-0.02em] text-white/75">
            {installmentLabel}
          </p>
        </div>
      </div>

      {/* Botão (394×72): raio 9px, borda 1.3px #5D754D e o degradê laranja. */}
      <a
        href="#comprar"
        className={cn(
          "flex h-[72px] w-full max-w-[394px] items-center justify-center rounded-[9px]",
          "max-md:h-[58px]",
          "border-[1.3px] border-[#5d754d]",
          "text-[20px] font-bold leading-[1.2em] tracking-[-0.02em] text-white",
          "shadow-[0_12px_24px_rgba(0,0,0,0.3)]",
        )}
        style={{ backgroundImage: BOTAO_GRADIENTE }}
      >
        {OFFER.cta}
      </a>

      {/* Bandeiras de pagamento: um SVG único de 128,25×21, centrado, 10px
          abaixo do gap de 16px do cartão (medido em y=840). */}
      <img
        src="/img/bandeiras-pagamento.svg"
        alt=""
        aria-hidden
        className="mt-[10px] h-[21px] w-[128.25px]"
      />

      {/* Checklist (537×309, pad-top 50): o bloco de 354px é centrado no
          cartão, mas o conteúdo dentro dele alinha à esquerda. */}
      <div className="flex w-full items-start justify-center pt-[50px] max-md:pt-5">
        <div className="flex w-full max-w-[354px] flex-col items-start gap-[21px] max-md:max-w-[310px] max-md:gap-[18px] max-md:px-4">
          <p className="text-[20.76px] font-semibold leading-[120%] tracking-[-0.04em] text-white">
            {OFFER.listTitle}
          </p>
          <ul className="flex w-full flex-col gap-[20.7644px] max-md:gap-[18px]">
            {OFFER.list.map((item) => (
              <li
                key={item}
                className="flex w-full items-center gap-4 max-md:gap-[13px]"
              >
                {/* Bolinha: 32px (23px no mobile) com degradê 225deg — não é
                    um círculo chapado. */}
                <span
                  aria-hidden
                  className="relative size-8 shrink-0 rounded-full max-md:size-[23px]"
                  style={{ backgroundImage: CHECK_GRADIENTE }}
                >
                  <IconCheck className="absolute left-[10px] top-[10px] text-[12px] text-white max-md:left-[8px] max-md:top-[7px] max-md:text-[8px]" />
                </span>
                <p className="flex-1 text-[18.17px] leading-[120%] tracking-[-0.04em] text-white">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* A borda do wireframe vem do `data-border` do Framer, que é um
          pseudo-elemento: ela NÃO entra no box model. Uma `border` de verdade
          no cartão encolheria o conteúdo em 4,16px e estreitaria o checklist
          (537 → 533). Por isso ela é desenhada por cima, em absoluto. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-t-[24px] border-x-[2.08px] border-t-[2.08px]"
        style={{ borderColor: CARD_BORDER }}
      />
    </div>
  );
}

/**
 * Composição do preço (.framer-1lygbgi): uma coluna ESTREITA de 537px com o
 * cartão dentro, e as duas agendas posicionadas em absoluto a partir dela,
 * muito maiores que a coluna. É isso que produz o efeito do wireframe — as
 * agendas não são "imagens ao lado do cartão", elas são peças gigantes que
 * vazam para os dois lados e o painel corta.
 *
 * Capa (.framer-6ev259): 1414×879, bottom -199, right -69, object-contain,
 * translateX(81px) rotate(-2deg).
 * Interna (.framer-2bicl9): 711×879, bottom -168, left 101%,
 * translateX(-50%) translateX(-81px) rotate(3deg), raio 2px e sombra própria.
 */
function OfertaComposicao() {
  return (
    <div
      className={cn(
        "relative flex w-[537px] max-w-[588px] items-center justify-center",
        "max-[1199px]:w-min",
        "max-md:w-full max-md:max-w-[584px] max-md:px-[10px]",
      )}
    >
      {/* Capa: 1414×879 ancorada pela DIREITA da coluna (right -69), com
          object-contain — a arte fica centrada na caixa larga e por isso
          aparece bem à esquerda, atravessando o painel. */}
      <img
        src="/img/capa-solo.png"
        alt=""
        aria-hidden
        loading="lazy"
        className={cn(
          "pointer-events-none absolute z-[1] h-[879px] w-[1414px] max-w-none object-contain",
          "bottom-[-199px] right-[-69px]",
          "max-[1199px]:right-[-156px]",
          "max-md:bottom-[-219px] max-md:right-[-532px]",
        )}
        style={{ transform: "translateX(81px) rotate(-2deg)" }}
      />
      {/* Página interna: 711×879 ancorada em left:101% da coluna e recuada
          por translateX(-50%) − 81px. object-fill (a proporção bate: 0,809). */}
      <img
        src="/img/interna-oferta.png"
        alt=""
        aria-hidden
        loading="lazy"
        className={cn(
          "pointer-events-none absolute z-[1] h-[879px] w-[711px] max-w-none rounded-[2px] object-fill",
          "shadow-[11px_-3px_10.2px_rgba(0,0,0,0.2)]",
          "bottom-[-168px] left-[101%]",
          "max-[1199px]:bottom-[-118px] max-[1199px]:left-[97%]",
          "max-md:bottom-[-178px]",
        )}
        style={{
          transform: "translateX(-50%) translateX(-81px) rotate(3deg)",
        }}
      />

      <OfertaCartao />
    </div>
  );
}

/**
 * Painel externo (.framer-1h0xv8m "Background" + .framer-52glac "Container").
 *
 * O fundo é #d0d1b1 — que já é o token --brand-sage-300 / --color-surface-sage
 * do design system, o mesmo `bg-surface-sage` que o Offer.tsx usa hoje. A cor
 * nunca foi o problema; o que falta no site é a FORMA: no wireframe título,
 * parágrafo e composição de preço ficam dentro de um painel único recuado, com
 * canto arredondado e `overflow: clip`, não um fundo de seção de ponta a ponta.
 *
 * Valores lidos das media queries (não arbitrados):
 *   ≥1200px ..... raio 90px, padding-top 208px, gap 87px
 *   768–1199px .. raio 67px, padding-top 180px, gap 87px
 *   <768px ...... raio 24px, padding-top  78px, gap 50px, + 20px lateral
 */
function DemoOfertaPainel() {
  return (
    <div
      className={cn(
        "overflow-clip bg-surface-sage",
        "rounded-[90px] max-[1199px]:rounded-[67px] max-md:rounded-[24px] max-md:px-5",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1200px] flex-col items-center",
          "gap-[87px] pt-[208px]",
          "max-[1199px]:pt-[180px]",
          "max-md:gap-[50px] max-md:pt-[78px]",
        )}
      >
        {/* Bloco de texto: 67% de largura com teto de 800px (760 úteis, o
            padding lateral é de 20px), gap 21px entre título e parágrafo.
            Tipografia medida no wireframe, não a escala do DS — esta página é
            de auditoria e precisa ser comparável ao original. */}
        <div className="flex w-[67%] max-w-[800px] flex-col items-center gap-[21px] px-5 text-center">
          <h3 className="text-[60px] font-bold leading-[60px] tracking-[-3px] text-[#1a2510] max-md:text-[40px] max-md:leading-[40px]">
            {OFFER.title}
          </h3>
          <p className="text-[20px] leading-[28px] tracking-[-0.2px] text-[#344c24] opacity-70 max-md:text-[15px]">
            {OFFER.paragraph}
          </p>
        </div>

        <OfertaComposicao />
      </div>
    </div>
  );
}


/* --------------------------------- conteúdo -------------------------------- */

const GRUPOS: Grupo[] = [
  {
    id: "estrutura",
    n: "01",
    titulo: "Estrutura de página",
    descricao:
      "As peças fixas que envolvem todo o site. Aparecem em toda página e nenhuma tem ficha própria no catálogo.",
    itens: [
      {
        nome: "Barra fixa do topo (TopBar)",
        onde: "Topo de todas as páginas",
        falta:
          "Faixa escura de 36px com esteira de avisos, ícones alternados (caixa e asterisco) e botão de fechar. O catálogo mostra só a esteira isolada, sem o comportamento fixo, sem o dispensar e sem a altura reservada no shell.",
        prioridade: "alta",
        larga: true,
        demo: <TopBar sticky={false} />,
        demoNota: "Peça real, sem o comportamento fixo.",
      },
      {
        nome: "Cabeçalho do site (SiteHeader)",
        onde: "Abaixo da barra do topo",
        falta:
          "Marca, navegação, botão de conta e CTA. Sem ficha, sem estado mobile e sem regra de comportamento no scroll.",
        prioridade: "alta",
        larga: true,
        demo: <SiteHeader />,
      },
      {
        nome: "Rodapé (SiteFooter)",
        onde: "Fim de todas as páginas",
        falta:
          "Textura de fundo, ornamento e blocos de links. Nenhuma documentação de anatomia nem de superfícies usadas.",
        prioridade: "media",
        larga: true,
        demo: <SiteFooter />,
      },
      {
        nome: "Container, Section",
        onde: "Estrutura de toda seção",
        falta:
          "Primitivos exportados pelo design system e nunca exibidos: larguras, respiro vertical e quando usar cada um.",
        prioridade: "media",
        demo: <DemoContainerSection />,
      },
    ],
  },
  {
    id: "componentes",
    n: "02",
    titulo: "Componentes",
    descricao:
      "Componentes que o design system já exporta, mas que o catálogo não demonstra.",
    itens: [
      {
        nome: "Carousel",
        onde: "Depoimentos",
        falta:
          "Exportado e usado na home, ausente do catálogo. Faltam controles, navegação por teclado e comportamento em telas pequenas.",
        prioridade: "alta",
        larga: true,
        demo: <DemoCarousel />,
      },
      {
        nome: "BookCover",
        onde: "Hero e seleção de edição",
        falta:
          "Peça central do produto: proporções, sombra, variação por edição e uso das imagens de capa.",
        prioridade: "alta",
        larga: true,
        demo: <DemoBookCover />,
        demoNota: "Altura fixa de 180px — regra de paridade entre edições.",
      },
      {
        nome: "BookStage e card de preço flutuante",
        onde: "Hero",
        falta:
          "Composição animada das duas agendas em leque mais o card de preço sobreposto. Nenhuma ficha, apesar de ser a peça mais complexa do site.",
        prioridade: "alta",
        larga: true,
        demo: <DemoBookStage />,
        demoNota: "Palco 740×740 exibido a 50%.",
      },
      {
        nome: "Heading, Text, Eyebrow",
        onde: "Todas as seções",
        falta:
          "A escala tipográfica está documentada em tokens, mas os componentes que a aplicam não: níveis, tons, tamanhos e quando cada um é o correto.",
        prioridade: "media",
        larga: true,
        demo: <DemoTipografia />,
      },
    ],
  },
  {
    id: "blocos",
    n: "03",
    titulo: "Blocos de conteúdo",
    descricao:
      "Composições recorrentes da home. São reutilizáveis, mas hoje só existem dentro das seções.",
    itens: [
      {
        nome: "Bloco de FAQ",
        onde: "Seção de perguntas",
        falta:
          "O acordeão aparece cru no catálogo. Falta a variação real: em cards, numerada e com o primeiro item aberto.",
        prioridade: "alta",
        larga: true,
        demo: <Faq />,
        demoNota: "Seção real do site.",
      },
      {
        nome: "Bloco de estatísticas",
        onde: "Hero",
        falta:
          "Números grandes com contagem animada e legenda. O contador está documentado sozinho, o bloco não.",
        prioridade: "media",
        larga: true,
        demo: <DemoStats />,
      },
      {
        nome: "Bloco de citação",
        onde: "Entre Sobre e Explore",
        falta:
          "Citação em tipografia manuscrita com atribuição. Não há ficha da composição nem da regra de atribuição.",
        prioridade: "media",
        larga: true,
        demo: <Quote />,
      },
      {
        nome: "Bloco de persona / checklist",
        onde: "Para quem é a agenda",
        falta: "Lista de itens com ícone de check, espaçamento e ritmo próprios.",
        prioridade: "baixa",
        larga: true,
        demo: (
          <div className="space-y-8">
            <DemoChecklist />
            <Persona />
          </div>
        ),
      },
      {
        nome: "Bloco de oferta",
        onde: "Seção de oferta",
        falta:
          "O site já usa a cor certa (bg-surface-sage = #d0d1b1 do wireframe), mas aplica no fundo da seção inteira, de ponta a ponta. No wireframe, título + parágrafo + card de preço ficam dentro de um painel único recuado, com canto arredondado responsivo (90px → 67px → 24px) — o site não tem esse painel. Falta também o cartão escuro estreito sobre as duas imagens inclinadas (capa e página interna), com selo, preço, botão translúcido, bandeiras de pagamento e checklist — hoje o card do site usa botão laranja e proporção diferente.",
        prioridade: "alta",
        larga: true,
        demo: <DemoOfertaPainel />,
        demoNota:
          "Montagem fiel ao wireframe (painel + cartão), valores extraídos do CSS real do arquivo — não da seção atual do site.",
      },
      {
        nome: "Bloco de fechamento",
        onde: "Antes do rodapé",
        falta: "Superfície escura com selos e CTA final; sem ficha.",
        prioridade: "baixa",
        larga: true,
        demo: <Closing />,
      },
    ],
  },
  {
    id: "variacoes",
    n: "04",
    titulo: "Estados e variações",
    descricao:
      "Peças que existem no catálogo, mas só em amostra genérica — sem as variações que o site realmente usa.",
    itens: [
      {
        nome: "Cards em suas variações reais",
        onde: "Datas litúrgicas, depoimentos, Sobre, preço",
        falta:
          "Hoje há apenas uma amostra de elevação. Faltam: card de data litúrgica com ícone, card de depoimento com avatar e estrelas, card de conteúdo terracota da seção Sobre e card de preço.",
        prioridade: "alta",
        larga: true,
        demo: (
          <div className="space-y-6">
            <DemoCards />
            <DemoCardDepoimento />
          </div>
        ),
      },
      {
        nome: "Selos em contexto",
        onde: "Hero, oferta, fechamento",
        falta:
          "Os tons estão listados, mas não há exemplo de uso real: selo sobre foto e selo sobre fundo escuro.",
        prioridade: "media",
        larga: true,
        demo: <DemoBadges />,
      },
    ],
  },
  {
    id: "divergencias",
    n: "05",
    titulo: "Documentado errado (não bate com o site)",
    descricao:
      "Peças que já aparecem no catálogo, mas em versão diferente da que a home realmente usa — quem consulta o catálogo vê algo que não existe no site.",
    itens: [
      {
        nome: "Perguntas frequentes (FAQ)",
        onde: "Seção de perguntas",
        falta:
          "No site cada pergunta é um cartão branco separado, com sombra e numeração. No catálogo aparece como lista contínua com fio de divisão, sem fundo branco e sem número — é a versão errada da peça.",
        prioridade: "alta",
        larga: true,
        demo: <Faq />,
        demoNota: "Versão correta (a do site).",
      },
      {
        nome: "Cartões",
        onde: "Datas litúrgicas, depoimentos, Sobre, preço",
        falta:
          "O catálogo mostra só a versão em fundo creme. Os cartões do site são brancos (datas, depoimentos) e terracota (Sobre) — nenhuma dessas superfícies aparece.",
        prioridade: "alta",
        larga: true,
        demo: <DemoCards />,
      },
      {
        nome: "Abas (Explore)",
        onde: "Explore a Agenda",
        falta:
          "No catálogo os painéis têm texto de exemplo. No site cada aba mostra uma página interna da agenda com legenda manuscrita — a anatomia real não está representada.",
        prioridade: "media",
        larga: true,
        demo: <Explore />,
        demoNota: "Seção real do site.",
      },
      {
        nome: "Selos",
        onde: "Hero, oferta, fechamento",
        falta:
          "O rótulo diz 6 tons, mas só 5 aparecem; falta o tom usado sobre fundo escuro no fechamento e na oferta.",
        prioridade: "media",
        larga: true,
        demo: <DemoBadges />,
        demoNota: "Os 6 tons reais.",
      },
      {
        nome: "Botões",
        onde: "Hero, oferta, cabeçalho",
        falta:
          "O rótulo diz 4 variantes, mas uma das amostras é apenas o tamanho grande. Faltam separar variante de tamanho e mostrar os estados (repouso, hover, desabilitado).",
        prioridade: "media",
        larga: true,
        demo: <DemoBotoes />,
      },
    ],
  },
];

const PRIORIDADE_LABEL: Record<Prioridade, string> = {
  alta: "Prioridade alta",
  media: "Prioridade média",
  baixa: "Prioridade baixa",
};

const PRIORIDADE_CLASS: Record<Prioridade, string> = {
  alta: "border-accent text-accent",
  media: "border-border text-text-muted",
  baixa: "border-border text-text-muted opacity-70",
};

const TOTAL = GRUPOS.reduce((acc, g) => acc + g.itens.length, 0);
const ALTAS = GRUPOS.reduce(
  (acc, g) => acc + g.itens.filter((i) => i.prioridade === "alta").length,
  0,
);

function Preview({
  children,
  nota,
}: {
  children: ReactNode;
  nota?: string;
}) {
  return (
    <figure className="mt-5">
      <div className="overflow-hidden rounded-card border border-border bg-surface-plain">
        {children}
      </div>
      <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-widest text-text-muted">
        {nota ?? "Peça renderizada como está hoje no site"}
      </figcaption>
    </figure>
  );
}

export default function DesignSystemLacunasPage() {
  return (
    <>
      <TopBar sticky={false} />
      <div>
        <SiteHeader />
        <main>
          <section className="bg-surface px-6 py-24 md:px-16">
            {/* Grade mais larga que a do site (1360px) para os previews
                respirarem — só nesta página de auditoria. */}
            <div className="mx-auto w-full max-w-[1360px]">
              <Reveal variant="up" className="mx-auto max-w-[760px] text-center">
                <Eyebrow className="justify-center">
                  Auditoria · Design System
                </Eyebrow>
                <Heading as="h1" className="mt-5">
                  O que ainda falta documentar
                </Heading>
                <Text className="mt-6">
                  Levantamento das peças que já existem na home e nas seções do
                  site e ainda não têm ficha no catálogo — mais as que estão no
                  catálogo em versão diferente da do site. São{" "}
                  <strong>{TOTAL} itens</strong> pendentes, sendo{" "}
                  <strong>{ALTAS} de prioridade alta</strong>.
                </Text>
                <Text size="sm" tone="muted" className="mt-4">
                  Cada item aparece renderizado abaixo da descrição, para
                  discussão. Nada aqui altera tokens, componentes ou o
                  wireframe.
                </Text>
                <a
                  href="/design-system"
                  className="mt-8 inline-block text-sm font-semibold text-accent underline underline-offset-4"
                >
                  Voltar ao catálogo
                </a>
              </Reveal>

              <div className="mt-16 space-y-16">
                {GRUPOS.map((grupo) => (
                  <section key={grupo.id} id={grupo.id} className="scroll-mt-24">
                    <div className="border-b border-border pb-4">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                        {grupo.n} · {grupo.itens.length} itens
                      </span>
                      <Heading as="h2" className="mt-2">
                        {grupo.titulo}
                      </Heading>
                      <Text size="sm" tone="muted" className="mt-2 max-w-prose">
                        {grupo.descricao}
                      </Text>
                    </div>

                    <ul>
                      {grupo.itens.map((item) => (
                        <li
                          key={`${grupo.id}-${item.nome}`}
                          className={cn(
                            "grid gap-3 border-b border-border py-10",
                            item.larga
                              ? "md:grid-cols-1"
                              : "md:grid-cols-[240px_1fr] md:gap-8",
                          )}
                        >
                          <div
                            className={cn(
                              item.larga && "md:flex md:items-baseline md:gap-8",
                            )}
                          >
                            <div className={cn(item.larga && "md:w-[240px] md:shrink-0")}>
                              <p className="text-base font-semibold text-text-strong">
                                {item.nome}
                              </p>
                              <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-text-muted">
                                {item.onde}
                              </p>
                            </div>
                            {item.larga ? (
                              <div className="mt-3 md:mt-0">
                                <Text size="sm">{item.falta}</Text>
                                <span
                                  className={cn(
                                    "mt-3 inline-block rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest",
                                    PRIORIDADE_CLASS[item.prioridade],
                                  )}
                                >
                                  {PRIORIDADE_LABEL[item.prioridade]}
                                </span>
                              </div>
                            ) : null}
                          </div>

                          {item.larga ? null : (
                            <div>
                              <Text size="sm">{item.falta}</Text>
                              <span
                                className={cn(
                                  "mt-3 inline-block rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest",
                                  PRIORIDADE_CLASS[item.prioridade],
                                )}
                              >
                                {PRIORIDADE_LABEL[item.prioridade]}
                              </span>
                            </div>
                          )}

                          {item.demo ? (
                            <Preview nota={item.demoNota}>{item.demo}</Preview>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
