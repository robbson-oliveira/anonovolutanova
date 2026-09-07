import { Button, Container, Eyebrow, Heading, Reveal, Text } from "@ds/index";
import { ABOUT } from "@content/home";
import { CHECKOUT_URL } from "@content/product";
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
 * px, relativa ao canto superior esquerdo do card. Não escalar.
 */
type Layer = {
  src: string;
  box: { w: number; x: number; y: number };
  /**
   * Linhas manuscritas sobre as pautas da página. No design aprovado é o que
   * mostra a agenda em uso — o PNG é a página em branco, a letra é texto por
   * cima. Cada item cai numa pauta: `top` é a primeira, `step` o espaçamento,
   * ambos em % da altura da imagem, medidos sobre a arte.
   */
  handwriting?: {
    items: readonly string[];
    top: number;
    step: number;
    left: string;
    /** corpo da letra em % da largura da imagem, para escalar junto */
    size: string;
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
        handwriting: {
          items: ABOUT.features[0].items,
          top: 20.4,
          step: 3.24,
          left: "7.5%",
          size: "3.4cqw",
        },
      },
      {
        src: metasAnuais,
        box: { w: 298, x: 323, y: 195 },
        /*
         * As metas vivem em ABOUT.features[1] no conteúdo, mas no design
         * aprovado elas são a segunda página DESTE card — o card 1 mostra as
         * duas listas. O agrupamento do conteúdo não reflete o layout.
         */
        handwriting: {
          items: ABOUT.features[1].items,
          top: 20.4,
          step: 3.25,
          left: "17.5%",
          size: "3.1cqw",
        },
      },
    ],
  },
  {
    muted: "Todo dia",
    strong: "uma frase de São Josemaria para inspirar",
    layers: [
      { src: agendaDiaria, box: { w: 598, x: 177, y: 105 } },
      { src: citacao, box: { w: 276, x: 60, y: 188 } },
    ],
  },
  {
    muted: "Todo mês",
    strong: "um tema para viver a santidade no cotidiano",
    layers: [
      { src: vidaOracao, box: { w: 451, x: -114, y: 180 } },
      { src: propositosMes, box: { w: 439, x: 261, y: 289 } },
    ],
  },
  {
    muted: "Datas especiais do calendário litúrgico e",
    strong: "datas importantes da Obra",
    layers: [
      { src: calendario, box: { w: 441, x: 136, y: 195 } },
      { src: datasObra, box: { w: 348, x: 9, y: 305 } },
    ],
  },
];

export function About() {
  return (
    <section id="sobre" className="bg-surface-gold px-6 pb-24 pt-24 md:px-16">
      <Container>
        <Reveal variant="up" className="mx-auto max-w-[720px] text-center">
          <Eyebrow className="justify-center">{ABOUT.eyebrow}</Eyebrow>
          <Heading as="h2" className="mt-5">
            {ABOUT.title}
          </Heading>
          <Text className="mx-auto mt-6 max-w-[560px]">{ABOUT.paragraph}</Text>
          <Button
            href={CHECKOUT_URL}
            size="lg"
            shape="block"
            className="mt-8 w-full max-w-[600px]"
          >
            {ABOUT.cta}
          </Button>
        </Reveal>

        <ul className="mt-20 grid justify-center gap-7 lg:grid-cols-[repeat(2,586px)]">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.strong} feature={feature} index={i} />
          ))}
        </ul>
      </Container>
    </section>
  );
}

/**
 * Um box da seção "O que a torna especial" — 586 × 600 px, exatamente como no
 * wireframe. A animação de entrada (Reveal) vem junto: alterna lado e ganha
 * atraso conforme a coluna. Reutilizado pelo catálogo.
 */
export function FeatureCard({
  feature,
  index = 0,
}: {
  feature: Feature;
  index?: number;
}) {
  return (
    <Reveal
      as="li"
      variant={index % 2 === 0 ? "left" : "right"}
      delay={(index % 2) * 90}
    >
      <article
        className="relative h-[600px] w-[586px] max-w-full overflow-hidden rounded-[12px] bg-surface-warm-card px-5 pt-[60px] shadow-inset-card"
      >
        <h3 className="text-center text-[38px] font-bold leading-[38px] tracking-[-0.04em]">
          <span className="ds-title-dim">{feature.muted} </span>
          <span className="text-text-on-warm">{feature.strong}</span>
        </h3>

        {feature.layers.map((layer, j) => (
          <div
            key={j}
            className="absolute [container-type:inline-size]"
            style={{ width: layer.box.w, left: layer.box.x, top: layer.box.y }}
          >
            <img
              src={layer.src}
              alt=""
              aria-hidden
              className="h-auto w-full rounded-xs shadow-page"
            />
            {layer.handwriting ? <Handwriting {...layer.handwriting} /> : null}
          </div>
        ))}
      </article>
    </Reveal>
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
          style={{ top: `${top + i * step}%`, left, fontSize: size }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
