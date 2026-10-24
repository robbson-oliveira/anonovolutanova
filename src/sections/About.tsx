import { Fragment } from "react";
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
import { OFFER_ANCHOR } from "@content/product";
const planoDeVida = "/img/sobre-plano-de-vida.webp";
const metasAnuais = "/img/sobre-metas-anuais.webp";
const fraseDia = "/img/sobre-frase-dia.webp";
const frase = "/img/sobre-frase.webp";
const vidaOracao = "/img/sobre-vida-oracao.webp";
const propositos = "/img/sobre-propositos.webp";
const folhaJaneiro = "/img/sobre-folha-janeiro.webp";
const folhaOutubro = "/img/sobre-folha-outubro.webp";
const sombra = "/img/sobre-sombra.svg";
const fundo = "/img/sobre-fundo.webp";

/**
 * Cada card tem título em duas ênfases — a primeira parte em tom apagado, a
 * segunda em destaque — e uma composição de páginas internas embaixo.
 *
 * As medidas vêm do Figma (nó 949:890) com o card em 586 × 600 px: `box` é a
 * parte VISÍVEL de cada arte, em px, relativa ao canto superior esquerdo do
 * card — as artes já foram exportadas cortadas pela borda do card, então
 * largura e posição são as da camada no Figma já recortada. Na tela, o
 * FeatureCard converte cada medida em fração da largura do card (`cardPx`),
 * então com o card em 586 px o resultado é o do Figma e, num card mais
 * estreito, a composição inteira encolhe junto, sem nada vazar.
 */
type Layer = {
  /** Arte da camada (WebP ou SVG já com a opacidade do Figma). */
  src: string;
  box: { w: number; x: number; y: number };
  /**
   * Art cut by the bottom of the card. The export and the bitmap fringe land
   * a fraction short of that edge, so the petrol card fill reads as a hairline.
   * `bleed` runs the art 3 device pixels past the edge and the card clips it.
   */
  bleed?: true;
  /**
   * Uniform scale so the paper crosses a card edge that the export left
   * short, and the rounded card clips the excess. The layer box does not
   * move, so handwriting stays on the rules. Origin is the side that should
   * stay put. No non-uniform stretch.
   */
  fit?: number;
  fitOrigin?: string;
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


/** Palavras do título: as "dim" levam o degradê branco → cinza, as demais o dourado. */
type TitlePart = { text: string; dim?: true; br?: true };

export type Feature = {
  title: TitlePart[];
  layers: Layer[];
};

export const CARD_W = 586;
export const CARD_H = 600;

export const FEATURES: Feature[] = [
  {
    title: [{ text: "Espaço para o plano de vida e", dim: true, br: true }, { text: "suas metas anuais" }],
    layers: [
      {
        src: planoDeVida,
        box: { w: 454.22, x: 31.89, y: 302.85 },
        bleed: true,
        anim: { variant: "left" },
        handwriting: { items: ABOUT.features[0].items, top: 118.15, step: 29, left: 30.11, size: 20 },
      },
      {
        src: metasAnuais,
        box: { w: 323.56, x: 262.44, y: 143.17 },
        bleed: true,
        anim: { variant: "right", delay: 90 },
        /*
         * As metas vivem em ABOUT.features[1] no conteúdo, mas no design
         * aprovado elas são a segunda página DESTE card — o card 1 mostra as
         * duas listas. O agrupamento do conteúdo não reflete o layout.
         */
        handwriting: { items: ABOUT.features[1].items, top: 135.23, step: 13.4, left: 112.56, size: 9.41 },
      },
    ],
  },
  {
    title: [{ text: "Todo dia", dim: true }, { text: "uma frase de São Josemaria para inspirar" }],
    layers: [
      { src: fraseDia, box: { w: 414.41, x: 171.59, y: 22 }, bleed: true, fit: 1.08, fitOrigin: "left center" },
      /* Sombra em cunha que a página projeta sobre o card (Figma "sombra", 949:1011). */
      { src: sombra, box: { w: 547.64, x: 15.16, y: 190.79 }, anim: { variant: "pop" } },
      { src: frase, box: { w: 338, x: 53, y: 212 }, anim: { variant: "forward" } },
    ],
  },
  {
    title: [{ text: "Todo mês", dim: true }, { text: "um tema para viver a santidade no cotidiano" }],
    layers: [
      { src: vidaOracao, box: { w: 426.05, x: 0, y: 118.15 }, bleed: true, fit: 1.04, fitOrigin: "right center", anim: { variant: "left" } },
      { src: propositos, box: { w: 381.24, x: 204.76, y: 206.36 }, fit: 1.05, fitOrigin: "right top", anim: { variant: "right", delay: 90 } },
    ],
  },
  {
    title: [
      { text: "Datas especiais", dim: true, br: true },
      { text: "do calendário litúrgico e", br: true },
      { text: "datas", dim: true },
      { text: "importantes da Obra" },
    ],
    layers: [
      { src: folhaJaneiro, box: { w: 441, x: 135.5, y: 195 }, bleed: true, fit: 1.06, fitOrigin: "left center", anim: { variant: "up" } },
      { src: folhaOutubro, box: { w: 416.18, x: 0, y: 255.37 }, bleed: true, fit: 1.045, fitOrigin: "right bottom", anim: { variant: "up", delay: 120 } },
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
 * No Figma novo (949:890) o título tem 3 linhas e o apoio 2, ambos centralizados
 * numa caixa de 1037px; o título quebra nas 
 de ABOUT.title.
 */
export function AboutHeader() {
  return (
    <RevealGroup className="mx-auto flex w-full max-w-[1037px] flex-col items-center">
      <Reveal variant="up">
        {/* Olho: ícone 16 + 5px de respiro + rótulo 14/14, caixa de 24px. */}
        <span className="flex h-6 items-center gap-[5px]">
          <span aria-hidden className="text-kicker [&_svg]:size-4">
            <IconSparkle />
          </span>
          <Eyebrow>{ABOUT.eyebrow}</Eyebrow>
        </span>
      </Reveal>

      <Reveal variant="up" delay={60} className="w-[1037px] max-w-full">
        <Heading as="h2" className="mt-[11px] w-full text-center whitespace-pre-line text-text-heading-sea! max-md:text-[22px]! max-md:leading-[1.15]!">
          {ABOUT.title}
        </Heading>
      </Reveal>

      <Reveal variant="up" delay={120} className="w-[640px] max-w-full">
        <p className="mt-[23px] w-full text-center text-[20px] leading-7 tracking-[-0.2px] text-balance text-text-lead opacity-70 max-md:text-[16px] max-md:leading-6">
          {ABOUT.paragraph}
        </p>
      </Reveal>

      <Reveal variant="up" delay={180} className="mt-[27px] w-[600px] max-w-full">
        <Button
          href={OFFER_ANCHOR}
          size="lg"
          shape="block"
          // As medidas do botão vencem as do tamanho "lg" do Button (daí o !).
          className="h-[68px] w-[600px] max-w-full rounded-[10px]! border border-gold-end bg-linear-90 from-gold-start to-gold-end text-[16px]! leading-[16px]! font-bold! tracking-[-0.64px]! transition-[transform,box-shadow] [transition-duration:var(--duration-fast)] hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-6px] hover:shadow-gold-start/60 motion-reduce:hover:translate-y-0"
        >
          {ABOUT.cta}
        </Button>
      </Reveal>
    </RevealGroup>
  );
}

/**
 * About: centered header and a grid of four feature cards.
 *
 * Desktop: two 586px columns with a 28px gap. The grid fills the 1200px
 * Container (`-mx-10` cancels that Container's own padding).
 *
 * The gold panel itself stops at the hero's usable width (`max-w-page`,
 * 1316px) and keeps the hero's side margins (24px, 32px from `md`). It used
 * to run out to 1440px, past the hero. The cards are not scaled down to
 * achieve that: a narrower viewport just shrinks the panel around them.
 *   < 1024  one column, card at most 586px
 *   ≥ 1024  two fluid columns, reaching 586px once the panel is wide enough
 */
export function About() {
  return (
    <section
      id="sobre"
      className="relative mx-auto w-[calc(100%-3rem)] max-w-page overflow-clip rounded-[40px] bg-surface-gold pt-24 pb-16 md:w-[calc(100%-4rem)] md:rounded-[90px] md:pt-[208px] md:pb-[117px]"
    >
      {/* Aquarela do Figma (949:892), cortada pelos cantos arredondados da seção. */}
      <img
        src={fundo}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover object-top"
      />
      <Container className="relative">
        <AboutHeader />

        <ul className="mt-12 grid grid-cols-[minmax(0,586px)] justify-center gap-[27px] md:mt-[87px] lg:-mx-10 lg:grid-cols-[repeat(2,minmax(0,586px))]">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title[0].text} feature={feature} index={i} />
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

/** Device pixels of paper pulled past a card edge so subpixel rounding cannot reveal the fill. */
const PAPER_OVERSCAN = 3;
/** A layer this close to the card edge (design px) is treated as touching it. */
const PAPER_EDGE = 12;

/**
 * The teal line is not a CSS border. It is the petrol card showing through a
 * semi-transparent WebP fringe, plus a crop that stops a fraction short of the
 * edge. Stretch the bitmap 3px past every edge it actually meets; the rounded
 * card clips the excess. The drop shadow stays on its own SVG layer.
 */
function paperFrameStyle(layer: Layer): React.CSSProperties | undefined {
  if (layer.src.endsWith(".svg")) return undefined;
  const { x, y, w } = layer.box;
  const nearLeft = x <= PAPER_EDGE;
  const nearRight = x + w >= CARD_W - PAPER_EDGE;
  const sides = (nearLeft ? 1 : 0) + (nearRight ? 1 : 0);
  const style: React.CSSProperties = {};
  if (sides > 0) {
    style.width = `calc(100% + ${sides * PAPER_OVERSCAN}px)`;
    style.maxWidth = "none";
    if (nearLeft) style.marginLeft = `-${PAPER_OVERSCAN}px`;
  }
  if (layer.bleed) {
    style.height = `calc(${cardPx(CARD_H - y)} + ${PAPER_OVERSCAN}px)`;
  }
  if (layer.fit) {
    style.transform = `scale(${layer.fit})`;
    style.transformOrigin = layer.fitOrigin;
  }
  return Object.keys(style).length > 0 ? style : undefined;
}

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
        <div className="px-[calc(20*100cqw/586)] pt-[calc(60*100cqw/586)]">
          <Reveal variant="up">
            <h3
              className="text-center text-[length:calc(38*100cqw/586)] leading-[calc(38*100cqw/586)] font-bold tracking-[-0.04em]"
            >
              {feature.title.map((part) => (
                <Fragment key={part.text}>
                  <span
                    className={
                      part.dim
                        ? "bg-linear-230/srgb from-title-dim to-title-dim-end bg-clip-text text-transparent"
                        : "text-text-on-warm"
                    }
                  >
                    {part.text}
                  </span>
                  {part.br ? <br /> : " "}
                </Fragment>
              ))}
            </h3>
          </Reveal>
        </div>

        {feature.layers.map((layer, j) => {
          const content = (
            <>
              <img
                src={layer.src}
                alt=""
                aria-hidden
                className="h-auto w-full max-w-none"
                style={paperFrameStyle(layer)}
              />
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
