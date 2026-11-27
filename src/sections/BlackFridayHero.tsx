import { Playfair_Display } from "next/font/google";
import { cn } from "@ds/index";
import { BLACK_FRIDAY } from "@content/black-friday";
import { OFFER_ANCHOR, priceLabel } from "@content/product";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  display: "swap",
});

const GIFT_MASK =
  "[mask-image:url(/images/black-friday/icone-presente.svg)] [-webkit-mask-image:url(/images/black-friday/icone-presente.svg)] [mask-size:contain] [-webkit-mask-size:contain] [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-position:center]";

/**
 * First fold of `/home-2`. Desktop type and the page frame match the public
 * hero (1376px, display title, 68px button). The phone column follows
 * Figma 2758:6347. The public home keeps `Hero`. "Black Friday" corrects
 * the desktop frame, which says "Black Fiday".
 *
 * The stage is the 743×655 box of node 2727:5951. Percentages below are
 * of that box, so the cover title stays clear of the planner sheet.
 * The duck band is the shared `DuckStrip`, rendered by the storefront.
 */
export function BlackFridayHero() {
  return (
    <section id="inicio" className="bg-surface">
      <div className="@container mx-auto flex w-full max-w-[1376px] flex-col items-center gap-5 px-6 pt-[29px] pb-8 md:px-8 lg:grid lg:grid-cols-[minmax(0,560px)_minmax(320px,1fr)] lg:items-center lg:gap-10 lg:px-12 lg:pt-[29px] lg:pb-[120px]">
        <div className="flex w-full flex-col items-center gap-5 text-center lg:items-start lg:gap-5 lg:text-left">
          {/* On desktop these three join the column gap. On the phone they are their own 14px stack. */}
          <div className="flex w-full flex-col items-center gap-3.5 lg:contents">
            <p className="flex items-center justify-center gap-2.5 text-[16px] leading-4 font-bold tracking-[-0.64px] lg:justify-start lg:gap-2.5 lg:text-[16px] lg:leading-none lg:tracking-[-0.04em]">
              <img src="/images/black-friday/brilho.svg" alt="" width={16} height={16} className="size-4" />
              <span className="bg-linear-[211deg] from-text-on-inverse-badge to-text-strong bg-clip-text text-transparent">
                {BLACK_FRIDAY.heroEyebrow}
              </span>
            </p>

            <h1 className="flex flex-col items-center gap-2.5 text-text-strong lg:items-start lg:gap-0">
              <span className="relative inline-block">
                <span className="block text-[50px] leading-[52px] font-bold tracking-[-2px] lg:text-display lg:leading-none lg:tracking-[-0.04em]">
                  {BLACK_FRIDAY.heroTitle}
                </span>
                <img
                  src="/images/black-friday/pincelada.svg"
                  alt=""
                  width={349}
                  height={13}
                  className="pointer-events-none absolute top-[46.8px] left-1/2 h-2 w-[238.5px] max-w-none -translate-x-1/2 lg:static lg:mt-1 lg:block lg:h-[14px] lg:w-full lg:max-w-[420px] lg:translate-x-0"
                />
              </span>
              <span className="block text-[clamp(30px,9.2vw,36px)] leading-10 font-bold tracking-[-1.44px] whitespace-nowrap lg:mt-[3px] lg:text-[clamp(44px,3.4vw,56px)] lg:leading-[1.05] lg:tracking-[-0.03em]">
                {BLACK_FRIDAY.heroTitleLine}
              </span>
            </h1>

            <p className="text-[18px] leading-[22px] font-bold tracking-[-0.54px] whitespace-nowrap text-text lg:text-h3 lg:leading-none lg:tracking-[-0.04em] lg:whitespace-normal">
              {BLACK_FRIDAY.heroSubtitle}
            </p>
          </div>

          <p className="flex w-full max-w-[326px] items-center justify-center gap-[18px] rounded-[11px] border-[1.2px] border-gold-line bg-surface-plain/38 py-2.5 pr-5 pl-4 lg:w-auto lg:max-w-full lg:justify-start lg:gap-2 lg:rounded-pill lg:border-pill-border lg:bg-surface-card lg:px-3.5 lg:py-2 lg:whitespace-nowrap">
            <img
              src="/images/black-friday/icone-presente.svg"
              alt=""
              width={27}
              height={27}
              className="size-[27px] shrink-0 lg:size-[18px]"
            />
            <span className="text-center lg:text-left lg:whitespace-nowrap">
              <span className="block text-[14px] leading-[18px] font-medium text-on-badge lg:inline lg:text-[15px] lg:leading-snug lg:text-text-strong">
                {BLACK_FRIDAY.heroPillLead}
              </span>
              <span className="block text-[15px] leading-[19px] font-bold text-gold-start lg:inline lg:text-[15px] lg:leading-snug">
                {BLACK_FRIDAY.heroPillStrong}
              </span>
            </span>
          </p>
          <p className="max-w-[430px] text-[15px] leading-[22px] text-text-lead lg:max-w-[540px] lg:text-lead lg:leading-[1.25]">
            {BLACK_FRIDAY.heroParagraph}
            <span className="font-bold">{BLACK_FRIDAY.heroParagraphStrong}</span>
          </p>

          <a
            href={OFFER_ANCHOR}
            className="flex h-[54px] w-full items-center justify-center rounded-[10px] border border-gold-end bg-linear-90 from-gold-start to-gold-end text-[17px] font-bold tracking-[-0.17px] whitespace-nowrap text-on-action lg:h-[68px] lg:max-w-[425px] lg:text-[16px] lg:tracking-[-0.04em]"
          >
            {BLACK_FRIDAY.heroCta}
          </a>

          <dl className="flex w-full items-center pt-1.5 lg:max-w-[460px] lg:items-stretch lg:justify-between lg:gap-6 lg:pt-1">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center lg:flex-none lg:items-start lg:gap-0 lg:text-left">
              <dt className="text-[24px] leading-[26px] font-semibold text-text-strong lg:text-stat lg:leading-none">365</dt>
              <dd className="text-[13px] leading-4 text-text lg:mt-1 lg:text-sm lg:leading-[1.1]">
                Dias de
                <br />
                Inspiração
              </dd>
            </div>
            <div aria-hidden className="h-11 w-px shrink-0 bg-gold-line lg:my-1 lg:h-auto lg:self-stretch lg:bg-gold-line/40" />
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center lg:flex-none lg:items-start lg:gap-0 lg:text-left">
              <dt className="text-[24px] leading-[26px] font-semibold text-text-strong lg:text-stat lg:leading-none">12</dt>
              <dd className="text-[13px] leading-4 text-text lg:mt-1 lg:text-sm lg:leading-[1.1]">
                Temas
                <br />
                Mensais
              </dd>
            </div>
            <div aria-hidden className="h-11 w-px shrink-0 bg-gold-line lg:my-1 lg:h-auto lg:self-stretch lg:bg-gold-line/40" />
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center lg:flex-none lg:items-start lg:gap-0 lg:text-left">
              <dt className="flex h-[26px] items-center">
                <span aria-hidden className={cn("size-6 bg-gold-start", GIFT_MASK)} />
                <span className="sr-only">Brinde</span>
              </dt>
              <dd className="text-[13px] leading-4 text-text lg:mt-1 lg:text-sm lg:leading-[1.1]">
                Brinde exclusivo
                <br />
                na Black Friday
              </dd>
            </div>
          </dl>
        </div>

        {/* Node 2727:5951, 743.047 × 655.498. Percentages are of that box. */}
        <div className="relative mx-auto aspect-[743.047/655.498] w-full max-w-[388px] lg:mx-0 lg:w-full lg:max-w-[740px]">
          <img
            src="/images/black-friday/agenda-perspectiva.webp"
            alt="Agenda Ano Novo, Luta Nova 2027"
            width={928}
            height={1152}
            fetchPriority="high"
            className="absolute top-0 left-[-1.81%] h-[84.23%] w-[59.86%] rotate-[0.41deg] object-cover [filter:drop-shadow(var(--shadow-bf-soft))]"
          />

          {/* Node 2727:5971. Square, so the 1024×1024 sheet keeps its margins.
              The badge and the arrow are children of this box, as in Figma. */}
          <div className="absolute top-[20.57%] left-[29.93%] h-[79.43%] w-[70.07%]">
            <img
              src="/images/black-friday/planner-hoje.webp"
              alt="Folha do Planner Diário"
              width={1024}
              height={1024}
              className="absolute inset-0 size-full object-cover [filter:drop-shadow(var(--shadow-bf-soft))]"
            />
            <div className="@container absolute top-[-9.98%] right-[21.44%] bottom-[76.58%] left-[44.51%]">
              <img
                src="/images/black-friday/selo-brinde.webp"
                alt=""
                width={420}
                height={414}
                className="absolute inset-0 size-full object-contain"
              />
              <div
                className={cn(
                  playfair.className,
                  "absolute inset-[16%] flex flex-col items-center justify-center text-center text-text-seal",
                )}
              >
                <span aria-hidden className={cn("mb-[1.2cqw] size-[20cqw] bg-text-seal", GIFT_MASK)} />
                <p className="text-[18cqw] leading-none font-bold tracking-[0.02em]">
                  {BLACK_FRIDAY.sealTitle}
                </p>
                <p className="mt-[1.2cqw] text-[10.5cqw] leading-[1.1] font-semibold">
                  <span className="font-black">1 </span>
                  {BLACK_FRIDAY.sealLine}
                  <br />
                  {BLACK_FRIDAY.sealFoot}
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute top-[7.95%] right-[53.74%] left-[30.51%] aspect-square">
              <img
                src="/images/black-friday/seta-curva.webp"
                alt=""
                width={280}
                height={318}
                className="absolute inset-0 size-full object-contain rotate-[89.44deg]"
              />
            </div>
          </div>

          <a
            href={OFFER_ANCHOR}
            className="absolute top-[64%] left-1/2 flex w-[175px] -translate-x-1/2 flex-col items-center justify-center rounded-[10px] border border-gold-end bg-surface-card p-2 shadow-bf-card lg:top-[70.08%] lg:left-[26.53%] lg:w-[max(175px,27.04%)] lg:translate-x-0 lg:border-card-gold-border"
          >
            <span className="flex w-full items-center justify-center gap-2">
              {/* The sheet overlaps the cover's lower-right and stops before the lines. */}
              <span className="relative h-12 w-[50px] shrink-0">
                <img
                  src="/images/black-friday/agenda-capa.webp"
                  alt=""
                  width={220}
                  height={321}
                  className="absolute bottom-0 left-0 h-12 w-auto"
                />
                <img
                  src="/images/black-friday/planner-hoje.webp"
                  alt=""
                  width={1024}
                  height={1024}
                  className="absolute bottom-0 left-[14px] z-10 size-[34px] rotate-[5deg] object-contain"
                />
              </span>
              <span className="flex flex-col items-end">
                <span className="whitespace-nowrap text-[13px] leading-none font-bold text-text-card">{BLACK_FRIDAY.heroCardTitle}</span>
                <span className="mt-0.5 whitespace-nowrap text-[10px] leading-tight font-bold text-text-card">
                  {BLACK_FRIDAY.heroCardExtra}
                </span>
                <span className="whitespace-nowrap text-[12px] leading-tight font-bold text-text-price">
                  {priceLabel}
                </span>
              </span>
            </span>
            <span className="mt-1.5 flex h-[26px] w-[88%] items-center justify-center whitespace-nowrap rounded-[6px] bg-linear-90 from-gold-warm-start to-gold-warm-end text-[11px] font-bold text-on-action">
              {BLACK_FRIDAY.heroCardCta}
            </span>
          </a>
        </div>
      </div>

    </section>
  );
}
