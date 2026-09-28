import {
  Button,
  Container,
  Eyebrow,
  Heading,
  IconSparkle,
  Reveal,
  RevealGroup,
} from "@ds/index";
import { ABOUT } from "@content/home";
import { BUY_URL } from "@content/product";
const planoDeVida = "/img/interna-plano-de-vida.png";
const metasAnuais = "/img/interna-metas-anuais.png";
const agendaDiaria = "/img/interna-agenda-diaria.png";
const citacao = "/img/interna-citacao.png";
const vidaOracao = "/img/interna-vida-oracao.png";
const propositosMes = "/img/interna-propositos-mes.png";
const calendario = "/img/interna-calendario.png";
const datasObra = "/img/interna-datas-obra.png";

/**
 * Cada card tem título em duas ênfases — a primeira parte em tom apagado, a
 * segunda em destaque — e uma composição de páginas internas embaixo.
 *
 * Todas as medidas abaixo foram lidas no wireframe (public/wireframe/
 * wireframe-v2.html) com o card em 586 × 600 px: `box` é a caixa da página em
 * px, relativa ao canto superior esquerdo do card. Não mexer nos números: eles
 * são a "prancheta" de 586 px. Na tela, o FeatureCard converte cada medida em
 * fração da largura do card (`cardPx`), então com o card em 586 px o resultado
 * é exatamente o do wireframe e, num card mais estreito, a composição inteira
 * encolhe junto, sem nada vazar.
 */
type Layer = {
  /** Página (PNG). Ausente quando a camada é só uma forma vetorial. */
  src?: string;
  /** Sombra em cunha do wireframe: path SVG desenhado no viewBox da caixa. */
  wedge?: { path: string; h: number; opacity: number };
  /**
   * Quando o PNG é uma página inclinada em fundo transparente, a sombra
   * retangular do CSS aparece como um vinco reto no card. Nesses casos a
   * sombra real vem da cunha SVG, então a do CSS é desligada.
   */
  noShadow?: boolean;
  box: { w: number; x: number; y: number };
  /**
   * Entrada da camada, exatamente como no wireframe: quem anima é cada página
   * (não o card). Sem `anim`, a camada é estática, como lá.
   */
  anim?: { variant: "up" | "left" | "right" | "pop" | "forward"; delay?: number };
  /**
   * Linhas manuscritas sobre as pautas da página. No design aprovado é o que
   * mostra a agenda em uso — o PNG é a página em branco, a letra é texto por
   * cima. Medidas em px lidas no wireframe, relativas ao canto da CAIXA da
   * página: `top` é a primeira pauta, `step` o espaçamento entre pautas.
   */
  handwriting?: {
    items: readonly string[];
    top: number;
    step: number;
    left: number;
    /** corpo da letra em px, como no wireframe */
    size: number;
  };
};


export type Feature = {
  muted: string;
  strong: string;
  layers: Layer[];
};

export const CARD_W = 586;
export const CARD_H = 600;

export const FEATURES: Feature[] = [
  {
    muted: "Espaço para o plano de vida",
    strong: "e suas metas anuais",
    layers: [
      {
        src: planoDeVida,
        box: { w: 575, x: 21, y: 260 },
        anim: { variant: "left" },
        handwriting: {
          items: ABOUT.features[0].items,
          top: 161,
          step: 27,
          left: 41,
          size: 20,
        },
      },
      {
        src: metasAnuais,
        box: { w: 298, x: 323, y: 195 },
        anim: { variant: "right", delay: 90 },
        /*
         * As metas vivem em ABOUT.features[1] no conteúdo, mas no design
         * aprovado elas são a segunda página DESTE card — o card 1 mostra as
         * duas listas. O agrupamento do conteúdo não reflete o layout.
         */
        handwriting: {
          items: ABOUT.features[1].items,
          top: 84,
          step: 13.5,
          left: 52,
          size: 9.41,
        },
      },
    ],
  },
  {
    muted: "Todo dia",
    strong: "uma frase de São Josemaria para inspirar",
    layers: [
      { src: agendaDiaria, box: { w: 598, x: 177, y: 105 }, noShadow: true },
      {
        /* Sombra em cunha que a página projeta sobre o card (wireframe). */
        box: { w: 498, x: 29, y: 169 },
        anim: { variant: "pop" },
        wedge: {
          h: 523,
          opacity: 0.34,
          path: "M 432.044 462.613 L 52.696 326.925 C 46.057 324.55 43.894 316.234 48.536 310.926 L 293.943 30.262 C 298.519 25.028 306.908 25.946 310.244 32.046 L 477.206 337.287 C 478.486 339.626 478.778 342.379 478.018 344.934 L 444.997 456.046 C 443.363 461.545 437.446 464.545 432.044 462.613 Z",
        },
      },
      { src: citacao, box: { w: 276, x: 60, y: 188 }, anim: { variant: "forward" } },
    ],
  },

  {
    muted: "Todo mês",
    strong: "um tema para viver a santidade no cotidiano",
    layers: [
      { src: vidaOracao, box: { w: 451, x: -114, y: 180 }, anim: { variant: "left" } },
      { src: propositosMes, box: { w: 439, x: 261, y: 289 }, anim: { variant: "right", delay: 90 } },
    ],
  },
  {
    muted: "Datas especiais do calendário litúrgico e",
    strong: "datas importantes da Obra",
    layers: [
      { src: calendario, box: { w: 441, x: 136, y: 195 }, anim: { variant: "up" } },
      { src: datasObra, box: { w: 348, x: 9, y: 305 }, anim: { variant: "up", delay: 120 } },
    ],
  },
];

/**
 * Cabeçalho da seção "Sobre" — olho, título, apoio e CTA.
 *
 * Medidas lidas no wireframe (viewport 1440), relativas ao topo do bloco:
 *   olho    24px de altura, centralizado (pill 168 × 24)
 *   título  583px de largura, 60/60, ls -3px, 11px abaixo do olho
 *   apoio   583px de largura, 20/28, ls -0.2px, 23px abaixo do título
 *   botão   600 × 68, raio 10, 27px abaixo do apoio
 * O título e o apoio são alinhados à ESQUERDA dentro da caixa de 583px, e a
 * caixa é que está centralizada — não é texto centralizado.
 */
export function AboutHeader() {
  return (
    <RevealGroup className="mx-auto flex w-full max-w-[600px] flex-col items-center">
      <Reveal variant="up">
        {/* Olho: ícone 16 + 5px de respiro + rótulo 14/14, caixa de 24px. */}
        <span className="flex h-6 items-center gap-[5px]">
          <span aria-hidden className="text-kicker [&_svg]:size-4">
            <IconSparkle />
          </span>
          <Eyebrow>{ABOUT.eyebrow}</Eyebrow>
        </span>
      </Reveal>

      <Reveal variant="up" delay={60} className="w-[583px] max-w-full">
        <Heading as="h2" className="mt-[11px] w-full">
          {ABOUT.title}
        </Heading>
      </Reveal>

      <Reveal variant="up" delay={120} className="w-[583px] max-w-full">
        <p className="mt-[23px] w-full text-[20px] leading-7 tracking-[-0.2px] text-kicker">
          {ABOUT.paragraph}
        </p>
      </Reveal>

      <Reveal variant="up" delay={180} className="mt-[27px] w-full">
        <Button
          href={BUY_URL}
          size="lg"
          shape="block"
          className="h-[68px] w-[600px] max-w-full"
          style={{ borderRadius: 10, fontSize: 16, lineHeight: "16px", letterSpacing: "-0.64px", fontWeight: 700 }}
        >
          {ABOUT.cta}
        </Button>
      </Reveal>
    </RevealGroup>
  );
}

/**
 * Seção "Sobre": cabeçalho centralizado + grade de quatro FeatureCards.
 *
 * Desktop (≥ 1440): exatamente o wireframe — duas colunas de 586 px com 28 de
 * vão, a grade ocupando os 1200 px do Container (por isso o `-mx-10`, que
 * devolve à grade o respiro interno do Container, como já acontecia antes).
 *
 * Telas menores: a coluna nunca passa de 586 px, mas pode encolher até a
 * largura disponível — e o card encolhe proporcionalmente (ver FeatureCard).
 *   < 1024  uma coluna, card com a largura do conteúdo (máx. 586)
 *   ≥ 1024  duas colunas fluidas, que chegam a 586 px a partir de ~1330
 * No celular a seção dispensa o próprio respiro lateral (o Container já dá
 * 24 px) e usa respiros verticais menores.
 */
export function About() {
  return (
    <section id="sobre" className="bg-surface-gold py-16 md:px-16 md:py-24">
      <Container>
        <AboutHeader />

        <ul className="mt-12 grid grid-cols-[minmax(0,586px)] justify-center gap-7 md:mt-20 lg:-mx-10 lg:grid-cols-[repeat(2,minmax(0,586px))]">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.strong} feature={feature} index={i} />
          ))}
        </ul>
      </Container>
    </section>
  );
}


/**
 * Converte uma medida da prancheta de 586 px em fração da largura do card.
 * O `li` do FeatureCard é um container de consulta (`@container`), então
 * 100cqw é a largura real do card: com ele em 586 px, `cardPx(20)` dá 20 px.
 */
const cardPx = (px: number) => `calc(${px} * 100cqw / ${CARD_W})`;

/**
 * Um box da seção "O que a torna especial" — 586 × 600 px no desktop,
 * exatamente como no wireframe. A animação de entrada (Reveal) vem junto:
 * alterna lado e ganha atraso conforme a coluna. Reutilizado pelo catálogo.
 *
 * Em telas menores o card não quebra nem esconde nada: ele vira uma prancheta
 * proporcional. A largura é a da coluna (máx. 586), a altura segue a
 * proporção 586:600, e título, respiros, páginas e letra manuscrita são
 * medidos em `cardPx` — a composição inteira encolhe junto, como uma imagem.
 * Num celular de 360 px o título fica em ~20 px.
 */
export function FeatureCard({
  feature,
  index = 0,
}: {
  feature: Feature;
  index?: number;
}) {
  void index;
  return (
    <li className="@container w-[586px] max-w-full">
      <RevealGroup
        as="article"
        className="relative aspect-[586/600] w-full overflow-hidden rounded-card bg-surface-warm-card shadow-inset-card"
      >
        {/* Respiro do título (20 nas laterais, 60 no topo), na escala do card. */}
        <div style={{ paddingInline: cardPx(20), paddingTop: cardPx(60) }}>
          <Reveal variant="up">
            <h3
              className="text-center font-bold tracking-[-0.04em]"
              style={{ fontSize: cardPx(38), lineHeight: cardPx(38) }}
            >
              <span className="ds-title-dim">{feature.muted} </span>
              <span className="text-text-on-warm">{feature.strong}</span>
            </h3>
          </Reveal>
        </div>

        {feature.layers.map((layer, j) => {
          const content = (
            <>
              {layer.src ? (
                <img
                  src={layer.src}
                  alt=""
                  aria-hidden
                  className={
                    layer.noShadow
                      ? "h-auto w-full rounded-xs"
                      : "h-auto w-full rounded-xs shadow-page"
                  }
                />
              ) : null}
              {layer.wedge ? (
                <svg
                  aria-hidden
                  width={layer.box.w}
                  height={layer.wedge.h}
                  viewBox={`0 0 ${layer.box.w} ${layer.wedge.h}`}
                  className="block h-auto w-full"
                  style={{ opacity: layer.wedge.opacity }}
                >
                  <defs>
                    <linearGradient
                      id={`wedge-${j}`}
                      x1="0"
                      x2="1"
                      y1="0.2196"
                      y2="0.7804"
                    >
                      <stop offset="0" stopColor="#000" stopOpacity="1" />
                      <stop offset="1" stopColor="#000" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={layer.wedge.path} fill={`url(#wedge-${j})`} />
                </svg>
              ) : null}
              {layer.handwriting ? <Handwriting {...layer.handwriting} /> : null}
            </>
          );

          return (
            <div
              key={j}
              className="absolute"
              style={{
                width: cardPx(layer.box.w),
                left: cardPx(layer.box.x),
                top: cardPx(layer.box.y),
              }}
            >
              {layer.anim ? (
                <Reveal variant={layer.anim.variant} delay={layer.anim.delay}>
                  {content}
                </Reveal>
              ) : (
                content
              )}
            </div>
          );
        })}
      </RevealGroup>
    </li>
  );
}

/** Cada linha cai sobre uma pauta da arte, por isso é posicionada uma a uma. */
function Handwriting({
  items,
  top,
  step,
  left,
  size,
}: NonNullable<Layer["handwriting"]>) {
  return (
    <ul aria-hidden className="pointer-events-none absolute inset-0">
      {items.map((item, i) => (
        <li
          key={item}
          className="absolute whitespace-nowrap font-script text-text-strong"
          style={{
            top: cardPx(top + i * step),
            left: cardPx(left),
            fontSize: cardPx(size),
            lineHeight: 1,
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );

}
