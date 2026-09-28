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
import { BUY_URL } from "@content/product";
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
 *
 * Telas menores (mobile first; a 1440 tudo acima vale ao pixel):
 *   < 768   uma coluna. O palco entra no fluxo logo depois do subtítulo, em
 *           largura total (até 480px), para a agenda aparecer na primeira
 *           dobra; parágrafo, botão, selos e números vêm depois. O palco é o
 *           mesmo BookStage em modo `fluid` (o card de preço vira barra).
 *   ≥ 768   duas colunas, como a variante tablet do wireframe: texto em até
 *           54% e o palco absoluto à direita, centralizado na altura.
 *   ≥ 1024  o palco volta ao topo, 67,5/740 da própria altura acima da coluna.
 *   Em qualquer largura ≥ 768 o palco começa em min(600px, 54%) e termina 24px
 *   além do container — a 1316px de container isso dá exatamente os 740px e o
 *   x=600 medidos; abaixo disso ele encolhe pela direita em vez de ser cortado
 *   ou invadir o texto. O container tem max 1380 com padding de 32px: a 1440
 *   a coluna continua em x=62, e entre 1024 e 1380 o texto não cola na borda.
 */
export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-surface pb-16 pt-[29px] md:pb-24 lg:pb-[221px]"
    >
      <div className="mx-auto w-full max-w-[1380px] px-6 md:px-8">
        {/* isolate: o palco fica atrás do texto (-z-10) sem cair para trás
            do fundo da seção. */}
        <div className="relative isolate">
          <div className="flex flex-col md:max-w-[min(647.5px,54%)]">
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

            {/* Palco. No celular fica no fluxo, entre o subtítulo e o
                parágrafo; a partir de md sai do fluxo e sangra para fora do
                container, como no wireframe. Não pode ir dentro de um Reveal:
                o transform dele viraria o bloco de contenção do absoluto. */}
            <div className="mx-auto mt-2 w-full max-w-[480px] md:absolute md:-right-6 md:left-[min(600px,54%)] md:top-1/2 md:-z-10 md:mx-0 md:mt-0 md:w-auto md:max-w-none md:-translate-y-1/2 lg:top-0 lg:-translate-y-[9.1216%]">
              <BookStage fluid />
            </div>

            <Reveal variant="up" delay={180}>
              {/* text-wrap: pretty evita a linha órfã no fim do parágrafo. */}
              <Text className="mt-[19px] max-w-[540px] text-pretty">
                {HERO.paragraph}
              </Text>
            </Reveal>

            <Reveal variant="up" delay={240}>
              <Button
                href={BUY_URL}
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

