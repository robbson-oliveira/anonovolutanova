import Image from "next/image";
import {
  Badge,
  Button,
  Counter,
  Heading,
  Reveal,
  Text,
} from "@ds/index";
import { HERO, STATS } from "@content/home";
import { CHECKOUT_URL, CYCLE_YEAR, priceLabel } from "@content/product";
import capaColor from "@/public/img/capa-color.png";
import capaClassica from "@/public/img/capa-classica.png";
import capaSolo from "@/public/img/capa-solo.png";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-surface px-6 md:px-16"
    >
      {/* O palco sangra para fora do container e passa da borda direita da
          janela. É a composição aprovada: as agendas não são uma "imagem ao
          lado do texto", elas atravessam o limite da página. */}
      <BookStage />

      <div className="relative z-10 flex min-h-[720px] max-w-[540px] flex-col justify-center py-20">
        <Reveal variant="up">
          <Badge tone="plain" icon="✦">
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
          <p className="mt-4 text-h3 font-bold tracking-[-0.04em] text-accent">
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
            {HERO.seals.map((seal, i) => (
              <Badge key={seal} tone="plain" icon={i === 0 ? "⚡" : "◈"}>
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
                  <span className="block text-[38px] font-bold leading-none tracking-[-0.04em] text-text-display">
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
    </section>
  );
}

/**
 * As duas agendas entram em leque: a Clássica assenta primeiro, a Color pousa
 * sobre ela, encosta e desliza girando ao redor da própria âncora até a
 * posição final. Ângulos, porcentagens e o `transform-origin` são o resultado
 * aprovado no protótipo — não são valores arbitrários e não devem ser
 * "arredondados".
 */
function BookStage() {
  return (
    /* 740px é a medida do palco no protótipo aprovado; as porcentagens
       internas de cada agenda são relativas a ela. */
    <div
      aria-hidden
      className="pointer-events-none absolute left-[46%] top-2 hidden aspect-square w-[740px] lg:block"
    >
      {/* Clássica — assenta primeiro, fica atrás */}
      <div
        data-motion="hero-book"
        style={{ left: "45.2%", top: "23.5%" }}
        className="absolute z-[2] w-[48%] origin-center [animation:ds-book-back-in_0.9s_var(--ease-out-soft)_both]"
      >
        <Image
          src={capaClassica}
          alt="Agenda Ano Novo, Luta Nova — Edição Clássica"
          priority
          className="h-auto w-full"
        />
      </div>

      {/* Color — pousa sobre a outra, encosta e desliza girando na âncora */}
      <div
        data-motion="hero-book"
        style={{ left: "0.8%", top: "11.5%" }}
        className="absolute z-[5] w-[46.6%] [transform-origin:70%_92%] [animation:ds-book-fan-out_var(--duration-book)_var(--ease-out-soft)_both]"
      >
        <Image
          src={capaColor}
          alt="Agenda Ano Novo, Luta Nova — Edição Color"
          priority
          className="h-auto w-full"
        />
      </div>

      <PriceCard />
    </div>
  );
}

/**
 * Card flutuante de compra. Compacto e horizontal: miniatura à esquerda,
 * preço à direita, botão embaixo. A linha de parcelamento NÃO entra aqui —
 * ela pertence ao card da seção de oferta.
 */
function PriceCard() {
  return (
    <div
      data-motion="hero-card"
      className="pointer-events-auto absolute left-[30%] top-[61%] z-10 w-[200px] rounded-md bg-surface p-2.5 shadow-float [animation:ds-pop-in_0.6s_var(--ease-overshoot)_2.1s_both]"
    >
      <div className="flex items-center gap-2.5">
        <Image
          src={capaSolo}
          alt=""
          className="h-9 w-auto rounded-[3px]"
          style={{ height: "36px", width: "auto" }}
        />
        <div>
          <p className="text-xs text-text-muted">Agenda {CYCLE_YEAR}</p>
          <p className="text-sm font-bold text-text-strong">{priceLabel}</p>
        </div>
      </div>
      <Button
        href={CHECKOUT_URL}
        shape="block"
        className="mt-2.5 h-9 w-full text-xs"
      >
        Comprar Agora
      </Button>
    </div>
  );
}
