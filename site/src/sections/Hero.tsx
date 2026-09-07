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

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-surface px-6 md:px-16"
    >
      {/* O palco sangra para fora do container e passa da borda direita da
          janela. É a composição aprovada: as agendas não são uma "imagem ao
          lado do texto", elas atravessam o limite da página. O posicionamento
          mora aqui, não no BookStage — o componente é só o palco 740×740. */}
      <div className="absolute left-[46%] top-2 hidden lg:block">
        <BookStage />
      </div>

      {/* Medido direto no design aprovado, não estimado: a coluna de texto
          do Hero segue esquerda=(viewport-1316)/2 — testado em 4 larguras de
          1538 a 3000px, erro zero nas quatro. NÃO é o --container-content de
          1200px do resto do site. O header (SiteHeader.tsx) usa essa MESMA
          medida agora — o logo precisa cair na borda do texto, então os dois
          compartilham max-w-[1316px] + px-6 lg:px-0. Antes o header tinha
          seu próprio 1390px, e o logo ficava ~23px à direita do texto.

          A medição não tinha padding nenhum somado ao teto (a fórmula bate
          exata sem termo extra) — daí o `px-6 lg:px-0`: só existe gutter
          abaixo de 1024px, faixa em que o teto de 1316px ainda não entra em
          jogo. Empilhar `md:px-16` por cima do teto foi o erro da primeira
          tentativa: empurrava o texto 64px além do medido e criava a
          sobreposição de novo, só que em todas as larguras.

          A seção não pode ganhar esse teto de largura ela mesma — o
          BookStage acima depende do padding desta <section> para o
          posicionamento em porcentagem, e mudar isso desalinha a animação
          toda. Em vez disso: cancela o padding da seção só para este ramo
          (-mx-6 md:-mx-16) e reaplica a centralização medida, a partir da
          viewport inteira de novo. */}
      <div className="relative z-10 -mx-6 md:-mx-16">
        <div className="mx-auto max-w-[1316px] px-6 lg:px-0">
          <div className="flex min-h-[720px] max-w-[540px] flex-col justify-center py-20">
        <Reveal variant="up">
          <Badge tone="plain" icon={<IconSparkle />}>
            {HERO.badge}
          </Badge>
        </Reveal>

        <Reveal variant="up" delay={60}>
          <Heading as="h1" level="display" tone="display" className="mt-4">
            {HERO.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </Heading>
        </Reveal>

        <Reveal variant="up" delay={120}>
          <p className="mt-4 text-h3 text-accent">
            {HERO.subtitle}
          </p>
        </Reveal>

        <Reveal variant="up" delay={180}>
          {/* text-wrap: pretty evita a linha órfã no fim do parágrafo —
              era um ajuste explícito do design aprovado. */}
          <Text className="mt-5 text-pretty">{HERO.paragraph}</Text>
        </Reveal>

        <Reveal variant="up" delay={240}>
          <Button
            href={CHECKOUT_URL}
            size="lg"
            shape="block"
            className="mt-8 w-full max-w-[425px]"
          >
            {HERO.cta}
          </Button>
        </Reveal>

        <Reveal variant="up" delay={280}>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            {HERO.seals.map((seal) => (
              <Badge key={seal} tone="plain" icon={<IconSparkle />}>
                {seal}
              </Badge>
            ))}
          </div>
        </Reveal>

        <Reveal variant="up" delay={320}>
          <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="max-w-[150px]">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-stat text-accent">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="mt-2 block text-sm text-text">
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
