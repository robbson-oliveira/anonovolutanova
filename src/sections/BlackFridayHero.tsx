import { Playfair_Display } from "next/font/google";
import { Button, cn } from "@ds/index";
import { BLACK_FRIDAY } from "@content/black-friday";
import { OFFER_ANCHOR, priceLabel } from "@content/product";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  display: "swap",
});

const GIFT_MASK =
  "[mask-image:url(/images/black-friday/icone-presente.svg)] [-webkit-mask-image:url(/images/black-friday/icone-presente.svg)] [mask-size:contain] [-webkit-mask-size:contain] [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-position:center]";

const DUCKS = Array.from({ length: 36 }, (_, i) => i);

/**
 * First fold of `/home-2` (Figma 2727:4964). The public home keeps `Hero`.
 * "Black Friday" corrects the frame, which says "Black Fiday".
 *
 * The stage is the 743×655 box of node 2727:5951. Percentages below are
 * of that box, so the cover title stays clear of the planner sheet.
 */
export function BlackFridayHero() {
  return (
    <section id="inicio" className="bg-surface">
      <div className="mx-auto grid w-full max-w-[1140px] items-center gap-8 px-6 pt-8 pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-10 lg:px-8 lg:pt-10 lg:pb-8">
        <div className="flex max-w-[480px] flex-col items-start gap-3.5 max-lg:mx-auto max-lg:items-center max-lg:text-center">
          <p className="flex items-center gap-2 text-[12px] font-bold tracking-[-0.04em]">
            <img src="/images/black-friday/brilho.svg" alt="" width={14} height={14} className="size-3.5" />
            <span className="bg-linear-[211deg] from-text-on-inverse-badge to-text-strong bg-clip-text text-transparent">
              {BLACK_FRIDAY.heroEyebrow}
            </span>
          </p>

          <h1 className="text-text-strong">
            <span className="inline-block max-lg:mx-auto">
              <span className="block text-[40px] leading-[1.02] font-bold tracking-[-0.02em] sm:text-[48px] xl:text-[56px]">
                {BLACK_FRIDAY.heroTitle}
              </span>
              <img
                src="/images/black-friday/pincelada.svg"
                alt=""
                width={349}
                height={13}
                className="pointer-events-none -mt-0.5 block h-[10px] w-[95%] max-lg:mx-auto"
              />
            </span>
            <span className="mt-1 block text-[28px] leading-[1.08] font-bold sm:text-[34px] xl:text-[40px]">
              {BLACK_FRIDAY.heroTitleLine}
            </span>
          </h1>

          <p className="text-[16px] font-bold text-text sm:text-[18px] xl:text-[20px]">
            {BLACK_FRIDAY.heroSubtitle}
          </p>

          <div className="flex max-w-[430px] flex-col items-start gap-3 max-lg:items-center">
            <p className="flex items-center gap-2 rounded-pill border-[1.2px] border-pill-border bg-surface-card px-4 py-2 text-left text-[13px] leading-snug xl:text-[14px]">
              <img
                src="/images/black-friday/icone-presente.svg"
                alt=""
                width={18}
                height={18}
                className="size-[18px] shrink-0"
              />
              <span>
                <span className="font-medium text-text-strong">{BLACK_FRIDAY.heroPillLead}</span>
                <span className="font-bold text-gold-start">{BLACK_FRIDAY.heroPillStrong}</span>
              </span>
            </p>
            <p className="text-[14px] leading-[1.55] text-text-lead xl:text-[15px]">
              {BLACK_FRIDAY.heroParagraph}
              <span className="font-bold">{BLACK_FRIDAY.heroParagraphStrong}</span>
            </p>
          </div>

          <Button
            href={OFFER_ANCHOR}
            size="lg"
            shape="block"
            className="h-[46px]! w-full max-w-[340px] rounded-[10px]! border border-gold-end bg-linear-90 from-gold-start to-gold-end text-[14px]! font-semibold! text-on-action"
          >
            {BLACK_FRIDAY.heroCta}
          </Button>

          <dl className="flex w-full max-w-[460px] items-stretch justify-between gap-3 pt-1">
            <div className="min-w-0">
              <dt className="text-[24px] leading-none font-semibold text-text-strong xl:text-[26px]">365</dt>
              <dd className="mt-1 text-[13px] leading-[1.15] text-text xl:text-[14px]">
                Dias de
                <br />
                Inspiração
              </dd>
            </div>
            <div aria-hidden className="my-1 w-px self-stretch bg-gold-line/40" />
            <div className="min-w-0">
              <dt className="text-[24px] leading-none font-semibold text-text-strong xl:text-[26px]">12</dt>
              <dd className="mt-1 text-[13px] leading-[1.15] text-text xl:text-[14px]">
                Temas
                <br />
                Mensais
              </dd>
            </div>
            <div aria-hidden className="my-1 w-px self-stretch bg-gold-line/40" />
            <div className="min-w-0">
              <dt className="flex h-6 items-center xl:h-[26px]">
                <span aria-hidden className={cn("size-6 bg-gold-start", GIFT_MASK)} />
                <span className="sr-only">Brinde</span>
              </dt>
              <dd className="mt-1 text-[13px] leading-[1.15] text-text xl:text-[14px]">
                Brinde exclusivo
                <br />
                na Black Friday
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto aspect-[743/655] w-full max-w-[560px]">
          <img
            src="/images/black-friday/agenda-perspectiva.webp"
            alt="Agenda Ano Novo, Luta Nova 2027"
            width={672}
            height={967}
            fetchPriority="high"
            className="absolute top-[2%] left-0 w-[56%]"
          />
          <img
            src="/images/black-friday/planner-hoje.webp"
            alt="Folha do Planner Diário"
            width={840}
            height={687}
            className="absolute top-[30%] left-[48%] w-[50%]"
          />
          <img
            src="/images/black-friday/seta-curva.webp"
            alt=""
            width={280}
            height={318}
            className="pointer-events-none absolute top-[16%] left-[54%] w-[9.5%] max-w-[56px] min-w-[36px]"
          />
          <div className="absolute top-0 left-[63%] w-[22%] max-w-[128px] min-w-[88px]">
            <img
              src="/images/black-friday/selo-brinde.webp"
              alt=""
              width={420}
              height={414}
              className="w-full"
            />
            <div
              className={cn(
                playfair.className,
                "absolute inset-[18%] flex flex-col items-center justify-center text-center text-text-strong",
              )}
            >
              <span aria-hidden className={cn("mb-0.5 size-3.5 bg-text-strong", GIFT_MASK)} />
              <p className="text-[11px] leading-none font-bold tracking-[0.02em] xl:text-[13px]">
                {BLACK_FRIDAY.sealTitle}
              </p>
              <p className="mt-0.5 text-[7px] leading-[1.15] font-semibold xl:text-[8px]">
                <span className="font-black">1 </span>
                {BLACK_FRIDAY.sealLine}
                <br />
                {BLACK_FRIDAY.sealFoot}
              </p>
            </div>
          </div>

          <a
            href={OFFER_ANCHOR}
            className="absolute bottom-[6%] left-[24%] flex w-[195px] max-w-[58%] flex-col gap-1.5 rounded-[10px] bg-surface-card p-2.5 shadow-bf-card"
          >
            <span className="flex items-center gap-2">
              <span className="relative h-[52px] w-[46px] shrink-0">
                <img
                  src="/images/black-friday/agenda-capa.webp"
                  alt=""
                  width={220}
                  height={321}
                  className="absolute bottom-0 left-0 h-[52px] w-auto"
                />
                <img
                  src="/images/black-friday/planner-hoje.webp"
                  alt=""
                  width={840}
                  height={687}
                  className="absolute right-0 bottom-1 h-[28px] w-auto"
                />
              </span>
              <span className="min-w-0 text-left leading-tight">
                <span className="block text-[15px] font-bold text-text-card">{BLACK_FRIDAY.heroCardTitle}</span>
                <span className="block text-[10px] font-bold text-text-card">{BLACK_FRIDAY.heroCardExtra}</span>
                <span className="mt-0.5 block text-[14px] font-semibold text-text-price">{priceLabel}</span>
              </span>
            </span>
            <span className="flex h-[28px] w-full items-center justify-center rounded-[6px] bg-linear-90 from-gold-start to-gold-end text-[11px] font-semibold text-on-action">
              {BLACK_FRIDAY.heroCardCta}
            </span>
          </a>
        </div>
      </div>

      <div aria-hidden className="flex h-9 items-center justify-center gap-3.5 overflow-hidden bg-surface-inverse-soft">
        {DUCKS.map((i) => (
          <img
            key={i}
            src="/images/black-friday/patinho.webp"
            alt=""
            width={120}
            height={76}
            className="h-5 w-auto shrink-0"
          />
        ))}
      </div>
    </section>
  );
}
