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

import { SiteHeader } from "@sections/SiteHeader";
import { SiteFooter } from "@sections/SiteFooter";
import { BookStage } from "@sections/BookStage";
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

/**
 * Painel externo da seção de oferta, extraído do CSS real do wireframe
 * (classes .framer-1gvz3z6 / .framer-1h0xv8m / .framer-52glac em
 * wireframe-v2.html) em vez de estimado por print — o painel aparece cinza
 * na captura porque o wireframe roda inteiro com filter:grayscale(100%);
 * a cor real do fundo é #d0d1b1, que já é --brand-sage-300 /
 * --color-surface-sage no token, a mesma usada em bg-surface-sage no
 * Offer.tsx real. O que falta no site é a FORMA: no wireframe título +
 * parágrafo + card de preço ficam dentro de um único painel recuado com
 * canto arredondado, não um fundo de seção de ponta a ponta.
 *
 * border-radius e padding-top são responsivos, valores lidos direto das
 * media queries do arquivo (não arbitrados):
 *   >=1200px .......... radius 90px, padding-top 208px
 *   768-1199px ........ radius 67px, padding-top 180px
 *   <768px ............. radius 24px, padding-top 78px, + padding lateral 20px
 * 768px bate com o breakpoint `md` padrão do Tailwind; 1200px não tem
 * breakpoint padrão equivalente, por isso o arbitrário `min-[1200px]:`.
 */
function DemoOfertaPainel() {
  return (
    <div
      className={cn(
        "bg-surface-sage px-5 pt-[78px] pb-10",
        "rounded-[24px] md:rounded-[67px] min-[1200px]:rounded-[90px]",
        "md:px-0 md:pt-[180px] min-[1200px]:pt-[208px]",
      )}
    >
      <Reveal variant="up" className="mx-auto max-w-[720px] text-center">
        <Heading as="h2">{OFFER.title}</Heading>
        <Text className="mx-auto mt-5 max-w-[560px]">{OFFER.paragraph}</Text>
      </Reveal>
      <div className="mx-auto mt-16 max-w-[800px]">
        <DemoOferta />
      </div>
    </div>
  );
}

/**
 * Bloco de oferta fiel ao wireframe: painel claro arredondado, título escuro
 * centralizado, cartão escuro cobrindo as duas imagens inclinadas (capa à
 * esquerda, página interna à direita), caixa interna com selo + preço +
 * parcelamento, botão laranja em degradê, ícones de pagamento e checklist.
 * É uma montagem de auditoria — não altera a seção Offer do site.
 */
function DemoOferta() {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#EDEDED]">
      {/* Palco: as duas peças ocupam quase toda a área, o cartão fica por cima
          e sangra para fora do topo e da base — como no wireframe. */}
      <div className="relative mx-auto flex min-h-[520px] w-full items-center justify-center px-4 py-10">
        <img
          src="/img/capa-solo.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-[-6%] left-[-2%] w-[46%] -rotate-[4deg]"
        />
        <img
          src="/img/interna-oferta.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-[-8%] right-[-2%] w-[46%] rotate-[3deg]"
        />

        <div className="relative z-10 w-full max-w-[380px] rounded-[20px] bg-[#3B3B3B] p-5 shadow-float">
          <div className="rounded-[14px] bg-white/10 px-6 py-5 text-center">
            <span className="inline-flex items-center gap-2 text-sm text-white/85">
              <IconSparkle /> {OFFER.badge}
            </span>
            <p className="mt-2 text-[2.6rem] font-bold leading-none tracking-[-0.04em] text-white">
              {priceLabel}
            </p>
            <p className="mt-2 text-sm text-white/60">{installmentLabel}</p>
          </div>

          {/* Botão neutro claro, não o degradê laranja do site. */}
          <a
            href="#comprar"
            className="mt-3 block rounded-[12px] bg-white/25 py-4 text-center text-base font-semibold text-white"
          >
            {OFFER.cta}
          </a>

          <ul className="mt-4 flex items-center justify-center gap-3 opacity-70">
            {["mc", "visa", "elo", "pix"].map((m) => (
              <li
                key={m}
                aria-hidden
                className="h-4 w-8 rounded-[3px] bg-white/70"
              />
            ))}
          </ul>

          <p className="mt-7 text-[0.95rem] font-semibold text-white">
            {OFFER.listTitle}
          </p>
          <ul className="mt-4 space-y-4">
            {OFFER.list.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[0.9rem] leading-snug text-white/85"
              >
                <span
                  aria-hidden
                  className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/25 text-white"
                >
                  <IconCheck className="text-[0.6rem]" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
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
        demoNota:
          "Palco 740×740 exibido a 50%. Peça única: o mesmo BookStage do Hero — ajustes só em /lab/hero-animation, nunca duplicando a animação aqui.",
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
