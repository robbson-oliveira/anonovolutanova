import {
  Badge,
  IconSparkle,
  Button,
  Counter,
  Heading,
  Reveal,
  Text,
} from "@ds/index";
import { HERO, STATS } from "@content/home";
import { CHECKOUT_URL } from "@content/product";
import { BookStage } from "./BookStage";

/**
 * Primeira dobra. Todo o ritmo vertical abaixo foi MEDIDO no wireframe
 * (public/wireframe/wireframe-v2.html) em viewport 1440, com o topo da seção
 * em y=42:
 *   coluna de texto  x=62 (= (1440-1316)/2); selo 57px e título 96px abaixo
 *                    do fim do cabeçalho (padding-top 29, altura total 859)
 *   selo             36px de altura
 *   título           2 linhas de 80px, 3px abaixo do selo
 *   subtítulo        30px, 19px abaixo do título
 *   parágrafo        540px de largura, 19px abaixo do subtítulo
 *   botão            425 × 68, raio 10, 29px abaixo do parágrafo
 *   selos            36px, 10px abaixo do botão
 *   números          29px abaixo dos selos, alinhados pela base
 *   palco            740 × 740; capa colorida em x=653,5 / y=4 da seção
 */
export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-surface pb-[221px] pt-[29px]"
    >
      <div className="mx-auto w-full max-w-[1316px] px-6 lg:px-0">
        <div className="relative">
          {/* Palco: sangra para fora do container, como no wireframe. */}
          <div className="absolute left-[590px] top-[-67.5px] hidden lg:block">
            <BookStage />
          </div>

          <div className="relative z-10 flex max-w-[647.5px] flex-col">
            <Reveal variant="up">
              <Badge
                tone="plain"
                icon={<IconSparkle />}
                className="h-9 gap-2.5 text-text"
                style={{ fontWeight: 700 }}
              >
                {HERO.badge}
              </Badge>
            </Reveal>

            <Reveal variant="up" delay={60}>
              <Heading
                as="h1"
                level="display"
                tone="display"
                className="mt-[3px]"
              >
                {HERO.title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </Heading>
            </Reveal>

            <Reveal variant="up" delay={120}>
              <p className="mt-[19px] text-h3 text-accent">{HERO.subtitle}</p>
            </Reveal>

            <Reveal variant="up" delay={180}>
              {/* text-wrap: pretty evita a linha órfã no fim do parágrafo. */}
              <Text className="mt-[19px] max-w-[540px] text-pretty">
                {HERO.paragraph}
              </Text>
            </Reveal>

            <Reveal variant="up" delay={240}>
              <Button
                href={CHECKOUT_URL}
                size="lg"
                shape="block"
                className="mt-[29px] h-[68px] w-full max-w-[425px]"
                style={{ borderRadius: 10, fontSize: 16, lineHeight: "16px", letterSpacing: "-0.64px", fontWeight: 700 }}
              >
                {HERO.cta}
              </Button>
            </Reveal>

            <Reveal variant="up" delay={280}>
              <div className="mt-[10px] flex flex-wrap items-center gap-[12px]">
                {HERO.seals.map((seal) => (
                  <Badge
                    key={seal}
                    tone="plain"
                    icon={<IconSparkle />}
                    className="h-9 gap-2.5 px-2.5 text-accent"
                    style={{ fontWeight: 700, borderRadius: 10 }}
                  >
                    {seal}
                  </Badge>
                ))}
              </div>
            </Reveal>

            <Reveal variant="up" delay={320}>
              <dl className="mt-[29px] flex flex-wrap items-center gap-x-[20px] gap-y-6">
                {STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    style={{ width: [122, 107, 182][i] }}
                  >
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block text-stat text-accent">
                        <Counter value={stat.value} suffix={stat.suffix} />
                      </span>
                      <span className="mt-[4px] block text-sm text-text">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

