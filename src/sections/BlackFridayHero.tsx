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
      {/* 1316/1920 is the Figma content width. The same ratio keeps 1920, 1440 and 1280 in proportion. */}
      <div className="@container mx-auto grid w-full items-center gap-8 px-6 pt-[clamp(1.25rem,2.4cqw,2.25rem)] pb-[clamp(1.75rem,4.2cqw,3.25rem)] max-lg:max-w-[420px] lg:w-[min(1316px,68.54vw)] lg:grid-cols-[minmax(0,1fr)_56.5%] lg:gap-[clamp(1.25rem,2.6cqw,2.5rem)] lg:px-0">
        <div className="flex flex-col items-start gap-[clamp(0.7rem,1.35cqw,1rem)] max-lg:mx-auto max-lg:items-center max-lg:text-center">
          <p className="flex items-center gap-2 text-[12px] font-bold tracking-[-0.04em]">
            <img src="/images/black-friday/brilho.svg" alt="" width={14} height={14} className="size-3.5" />
            <span className="bg-linear-[211deg] from-text-on-inverse-badge to-text-strong bg-clip-text text-transparent">
              {BLACK_FRIDAY.heroEyebrow}
            </span>
          </p>

          <h1 className="text-text-strong">
            <span className="inline-block max-lg:mx-auto">
              <span className="block text-[clamp(36px,4.26cqw,56px)] leading-[1.02] font-bold tracking-[-0.02em]">
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
            <span className="mt-1 block text-[clamp(26px,3.04cqw,40px)] leading-[1.08] font-bold">
              {BLACK_FRIDAY.heroTitleLine}
            </span>
          </h1>

          <p className="text-[clamp(16px,1.52cqw,20px)] font-bold text-text">
            {BLACK_FRIDAY.heroSubtitle}
          </p>

          <div className="flex max-w-[430px] flex-col items-start gap-3 max-lg:items-center">
            <p className="flex items-center gap-2 rounded-pill border-[1.2px] border-pill-border bg-surface-card px-4 py-2 text-left text-[clamp(13px,1.06cqw,14px)] leading-snug">
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
            <p className="max-w-[430px] text-[clamp(14px,1.14cqw,15px)] leading-[1.55] text-text-lead">
              {BLACK_FRIDAY.heroParagraph}
              <span className="font-bold">{BLACK_FRIDAY.heroParagraphStrong}</span>
            </p>
          </div>

          <Button
            href={OFFER_ANCHOR}
            size="lg"
            shape="block"
            className="h-[clamp(44px,3.65cqw,48px)]! w-full max-w-[min(330px,32cqw)] rounded-[10px]! border border-gold-end bg-linear-90 from-gold-start to-gold-end text-[clamp(13px,1.06cqw,14px)]! font-semibold! text-on-action"
          >
            {BLACK_FRIDAY.heroCta}
          </Button>

          <dl className="flex w-full max-w-[460px] items-stretch justify-between gap-6 pt-1">
            <div className="min-w-0">
              <dt className="text-[clamp(22px,1.98cqw,26px)] leading-none font-semibold text-text-strong">365</dt>
              <dd className="mt-1 text-[clamp(12px,1.06cqw,14px)] leading-[1.15] text-text">
                Dias de
                <br />
                Inspiração
              </dd>
            </div>
            <div aria-hidden className="my-1 w-px self-stretch bg-gold-line/40" />
            <div className="min-w-0">
              <dt className="text-[clamp(22px,1.98cqw,26px)] leading-none font-semibold text-text-strong">12</dt>
              <dd className="mt-1 text-[clamp(12px,1.06cqw,14px)] leading-[1.15] text-text">
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
              <dd className="mt-1 text-[clamp(12px,1.06cqw,14px)] leading-[1.15] text-text">
                Brinde exclusivo
                <br />
                na Black Friday
              </dd>
            </div>
          </dl>
        </div>

        {/* Node 2727:5951, 743.047 × 655.498. Percentages are of that box. */}
        <div className="relative mx-auto aspect-[743.047/655.498] w-full max-w-[360px] lg:mx-0 lg:max-w-none">
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
            className="absolute top-[70.08%] left-[26.53%] flex w-[27.04%] flex-col items-center justify-center rounded-[10px] border border-card-gold-border bg-surface-card p-2 shadow-bf-card"
          >
            <span className="flex w-full items-end gap-1">
              <span className="relative h-12 w-[42px] shrink-0">
                <img
                  src="/images/black-friday/agenda-capa.webp"
                  alt=""
                  width={220}
                  height={321}
                  className="absolute bottom-0 left-0 h-full w-auto"
                />
                {/* Tilted sheet in front of the cover's lower right, under the A of "Agenda". */}
                <img
                  src="/images/black-friday/planner-hoje.webp"
                  alt=""
                  width={1024}
                  height={1024}
                  className="absolute -right-1 bottom-0 h-[62%] w-auto rotate-[8deg]"
                />
              </span>
              {/* The two lines sit on the right, under "2027" (Figma 2727:6007). */}
              <span className="inline-grid min-w-0 flex-1 justify-items-start">
                <span className="text-[13px] leading-none font-bold text-text-card">{BLACK_FRIDAY.heroCardTitle}</span>
                <span className="mt-0.5 justify-self-end text-[10px] leading-tight font-bold text-text-card">
                  {BLACK_FRIDAY.heroCardExtra}
                </span>
                <span className="justify-self-end text-[12px] leading-tight font-bold text-text-price">
                  {priceLabel}
                </span>
              </span>
            </span>
            <span className="mt-1.5 flex h-[26px] w-[88%] items-center justify-center rounded-[6px] bg-linear-90 from-gold-warm-start to-gold-warm-end text-[11px] font-bold text-on-action">
              {BLACK_FRIDAY.heroCardCta}
            </span>
          </a>
        </div>
      </div>

      <div aria-hidden className="flex h-[34px] items-center justify-center gap-3.5 overflow-hidden bg-surface-inverse-soft">
        {DUCKS.map((i) => (
          <img
            key={i}
            src="/images/black-friday/patinho.webp"
            alt=""
            width={120}
            height={76}
            className="h-[19px] w-auto shrink-0"
          />
        ))}
      </div>
    </section>
  );
}
