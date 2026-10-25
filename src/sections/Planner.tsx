import { Badge, Button, IconSparkle, Reveal } from "@ds/index";
import { PLANNER } from "@content/home";
import { OFFER_ANCHOR } from "@content/product";

/**
 * Chamada do Planner Diário (Figma "Seção 3", 949:788): cartão de 1023×487 no Figma (aqui 4% mais estreito, 982× a mesma proporção, para ficar dentro do grid da página)
 * com borda dourada de 2px, raio 20, texto à esquerda e a folha à direita.
 *
 * A partir de lg as duas colunas ficam posicionadas em % do cartão, medidas
 * no Figma (texto a 79px e 515 de largura; folha a 521px, 499×373), então o
 * conjunto acompanha a largura do cartão. A folha (folha visível a 54% do cartão e 42,5% de largura, como no Figma; o PNG tem 39px de margem à esquerda) invade o texto e o cartão (overflow-hidden) corta a sombra que passar da borda:
 * ela tem sombra e transparência assadas no PNG, e o parágrafo (395px) não
 * chega lá. Abaixo de lg o texto vem primeiro e a folha embaixo.
 *
 * Espaços da seção, do Figma: 132px sob "Explore a Agenda" e 163px até a
 * seção seguinte.
 */
export function Planner() {
  return (
    <section className="bg-surface px-5 pb-16 pt-4 md:px-8 md:pb-24 lg:px-12 xl:px-[60px] xl:pb-[163px] xl:pt-[32px]">
      <Reveal
        variant="up"
        className="relative mx-auto flex w-[96%] max-w-[982px] flex-col items-center gap-6 overflow-hidden rounded-[20px] border-2 border-gold-start px-6 py-6 text-center lg:block lg:aspect-[1023/440] lg:p-0 lg:text-left"
      >
        <div className="lg:absolute lg:left-[7.72%] lg:top-[11%] lg:w-[50.34%]">
          <Badge
            tone="plain"
            icon={<IconSparkle />}
            className="gap-1 text-[10px] font-bold! tracking-[-0.04em] text-text-heading-sea"
          >
            {PLANNER.badge}
          </Badge>

          <h2 className="mt-3 text-[30px] font-bold leading-[1.05] tracking-[-0.05em] text-text-heading-sea sm:text-[43.776px] sm:leading-[43.776px] sm:tracking-[-2.1888px]">
            {PLANNER.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <p className="mt-[13px] max-w-[395px] text-[14.592px] leading-[20.429px] tracking-[-0.1459px] text-text-lead opacity-70 max-lg:mx-auto">
            {PLANNER.paragraph}
          </p>

          <Button
            href={OFFER_ANCHOR}
            size="lg"
            shape="block"
            // As medidas do Figma vencem as do tamanho "lg" do Button (daí o !).
            className="mt-[41px] h-14 w-[310px] max-w-full rounded-[12px]! border border-gold-end bg-linear-90 from-gold-start to-gold-end text-[20px]! font-semibold! leading-[27.5px]! transition-[transform,box-shadow] [transition-duration:var(--duration-fast)] hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-6px] hover:shadow-gold-start/60 motion-reduce:hover:translate-y-0"
          >
            {PLANNER.cta}
          </Button>
        </div>

        {/*
         * Mobile: the PNG is 642×472 with the paper (alpha ≥ 200) at
         * x39–472, y30–364. The frame matches that paper, almost as wide as
         * the button, and the file hangs off it so the baked-in shadow can
         * sit inside the card. The card's overflow clips whatever crosses
         * the border. Desktop keeps the Figma placement of the whole file.
         */}
        <div className="relative aspect-[434/335] w-full max-w-[480px] lg:hidden">
          <img
            src="/img/planner-diario.webp"
            alt={PLANNER.imageAlt}
            width={642}
            height={472}
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute top-[-8.96%] left-[-8.99%] w-[147.93%] max-w-none"
          />
        </div>
        <img
          src="/img/planner-diario.webp"
          alt=""
          aria-hidden
          width={642}
          height={472}
          loading="lazy"
          decoding="async"
          className="pointer-events-none hidden lg:absolute lg:left-[50.2%] lg:top-[2.9%] lg:block lg:h-auto lg:w-[62.9%] lg:max-w-none"
        />
      </Reveal>
    </section>
  );
}
