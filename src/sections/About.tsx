import Image, { type StaticImageData } from "next/image";
import { Button, Container, Eyebrow, Heading, Reveal, Text } from "@ds/index";
import { ABOUT } from "@content/home";
import { CHECKOUT_URL } from "@content/product";
import planoDeVida from "@/public/img/interna-plano-de-vida.png";
import metasAnuais from "@/public/img/interna-metas-anuais.png";
import agendaDiaria from "@/public/img/interna-agenda-diaria.png";
import citacao from "@/public/img/interna-citacao.png";
import vidaOracao from "@/public/img/interna-vida-oracao.png";
import propositosMes from "@/public/img/interna-propositos-mes.png";
import calendario from "@/public/img/interna-calendario.png";
import datasObra from "@/public/img/interna-datas-obra.png";

/**
 * Cada card tem título em duas ênfases — a primeira parte em tom apagado, a
 * segunda em destaque — e uma composição de páginas internas embaixo.
 */
type Feature = {
  muted: string;
  strong: string;
  layers: { src: StaticImageData; className: string }[];
};

const FEATURES: Feature[] = [
  {
    muted: "Espaço para o plano de vida",
    strong: "e suas metas anuais",
    layers: [
      { src: planoDeVida, className: "left-[4%] top-[14%] w-[97%]" },
      { src: metasAnuais, className: "left-[55%] top-0 w-[50%]" },
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
      className="rounded-b-[48px] bg-surface-muted px-6 pb-24 pt-24 md:px-16"
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
              <article className="h-full overflow-hidden rounded-lg bg-surface-inverse p-10 pb-0">
                <h3 className="text-h3 text-center leading-tight tracking-[-0.04em]">
                  <span className="text-text-on-inverse/45">
                    {feature.muted}{" "}
                  </span>
                  <span className="font-bold text-text-on-inverse">
                    {feature.strong}
                  </span>
                </h3>

                <div className="relative mt-12 h-[520px]">
                  {feature.layers.map((layer, j) => (
                    <Image
                      key={j}
                      src={layer.src}
                      alt=""
                      aria-hidden
                      className={`absolute h-auto ${layer.className}`}
                    />
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
