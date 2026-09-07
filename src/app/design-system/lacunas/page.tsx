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

/**
 * Bloco de oferta fiel ao wireframe: painel claro arredondado, título escuro
 * centralizado, cartão escuro cobrindo as duas imagens inclinadas (capa à
 * esquerda, página interna à direita), caixa interna com selo + preço +
 * parcelamento, botão laranja em degradê, ícones de pagamento e checklist.
 * É uma montagem de auditoria — não altera a seção Offer do site.
 */
function DemoOferta() {
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-surface-muted px-6 py-14 md:px-16">
      <div className="mx-auto max-w-[720px] text-center">
        <Heading as="h3" className="text-text-strong">
          {OFFER.title}
        </Heading>
        <Text className="mx-auto mt-4 max-w-[560px]" tone="muted">
          2027 já começou por aqui. A nova edição será produzida em quantidade
          limitada — então não espere o momento perfeito para garantir a sua.
          Patos à água!
        </Text>
      </div>

      <div className="relative mx-auto mt-14 max-w-[880px] pb-10">
        {/* Imagens inclinadas atrás do cartão, como no wireframe. */}
        <img
          src="/img/capa-solo.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-[-4%] top-10 w-[44%] -rotate-[14deg] shadow-float"
        />
        <img
          src="/img/interna-oferta.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-[-4%] top-6 w-[40%] rotate-[13deg] shadow-float"
        />

        <div className="relative z-10 mx-auto w-full max-w-[520px] rounded-[28px] bg-surface-inverse p-6 shadow-float md:p-8">
          <div className="rounded-[18px] bg-surface-inverse-soft/60 p-6 text-center ring-1 ring-border-inverse">
            <Badge tone="plainInverse" icon={<IconSparkle />}>
              {OFFER.badge}
            </Badge>
            <p className="mt-3 text-display font-bold tracking-[-0.04em] text-text-on-inverse">
              {priceLabel}
            </p>
            <p className="mt-1 text-base text-text-on-inverse/70">
              {installmentLabel}
            </p>
          </div>

          {/* Botão em degradê laranja→dourado, como no wireframe (hoje não
              existe essa variante no catálogo de botões). */}
          <a
            href="#comprar"
            className="mt-4 block rounded-[9px] border border-[#5D754D] bg-gradient-to-br from-[#FF7A2F] to-[#F4D36A] py-4 text-center text-lg font-bold tracking-[-0.02em] text-white"
          >
            {OFFER.cta}
          </a>

          <ul className="mt-4 flex items-center justify-center gap-4">
            {["Mastercard", "Visa", "Elo", "Pix"].map((m) => (
              <li
                key={m}
                className="text-xs font-semibold text-text-on-inverse/60"
              >
                {m}
              </li>
            ))}
          </ul>

          <p className="mt-8 font-semibold text-text-on-inverse">
            {OFFER.listTitle}
          </p>
          <ul className="mt-4 space-y-4">
            {OFFER.list.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-text-on-inverse/85"
              >
                <span
                  aria-hidden
                  className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-surface-inverse-soft text-text-on-inverse ring-1 ring-border-inverse"
                >
                  <IconCheck className="text-[0.7rem]" />
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
          "Painel claro arredondado, cartão escuro cobrindo as imagens inclinadas, caixa interna com selo e preço, botão laranja em degradê, ícones de pagamento e checklist. É o bloco de conversão e não tem anatomia documentada — e a seção Offer do site já diverge do wireframe (fundo sage, botão escuro, texto diferente).",
        prioridade: "alta",
        larga: true,
        demo: <DemoOferta />,
        demoNota: "Montagem fiel ao wireframe, não a seção atual do site.",
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
            <Container>
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
            </Container>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
