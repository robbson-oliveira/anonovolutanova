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
 */
type Layer = {
  src: string;
  className: string;
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

type Feature = {
  muted: string;
  strong: string;
  layers: Layer[];
};

const FEATURES: Feature[] = [
  {
    muted: "Espaço para o plano de vida",
    strong: "e suas metas anuais",
    layers: [
      {
        src: planoDeVida,
        className: "left-[4%] top-[14%] w-[97%]",
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
        className: "left-[55%] top-0 w-[50%]",
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
      { src: agendaDiaria, className: "left-[30%] top-0 w-[101%]" },
      { src: citacao, className: "left-[10%] top-[14%] w-[47%]" },
    ],
  },
  {
    muted: "Todo mês",
    strong: "um tema para viver a santidade no cotidiano",
    layers: [
      { src: vidaOracao, className: "left-[-19%] top-0 w-[76%]" },
      { src: propositosMes, className: "left-[44%] top-[38%] w-[74%]" },
    ],
  },
  {
    muted: "Datas especiais do calendário litúrgico e",
    strong: "datas importantes da Obra",
    layers: [
      { src: calendario, className: "left-[23%] top-0 w-[75%]" },
      { src: datasObra, className: "left-[1%] top-[22%] w-[59%]" },
    ],
  },
];

export function About() {
  return (
    <section
      id="sobre"
      className="bg-surface-gold px-6 pb-24 pt-24 md:px-16"
    >
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

        <ul className="mt-20 grid gap-6 lg:grid-cols-2">
          {FEATURES.map((feature, i) => (
            <Reveal
              as="li"
              key={feature.strong}
              variant={i % 2 === 0 ? "left" : "right"}
              delay={(i % 2) * 90}
            >
              <article className="h-full overflow-hidden rounded-lg bg-surface-warm-card p-10 pb-0 shadow-inset-card">
                <h3 className="text-center text-[38px] font-bold leading-tight tracking-[-0.04em]">
                  <span className="ds-title-dim">
                    {feature.muted}{" "}
                  </span>
                  <span className="text-text-on-warm">
                    {feature.strong}
                  </span>
                </h3>

                <div className="relative mt-12 h-[520px]">
                  {feature.layers.map((layer, j) => (
                    <div
                      key={j}
                      className={`absolute [container-type:inline-size] ${layer.className}`}
                    >
                      <img
                        src={layer.src}
                        alt=""
                        aria-hidden
                        className="h-auto w-full rounded-xs shadow-page"
                      />
                      {layer.handwriting ? (
                        <Handwriting {...layer.handwriting} />
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
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
