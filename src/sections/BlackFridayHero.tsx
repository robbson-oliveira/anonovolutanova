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

/**
 * First fold of `/home-2` (Figma 2727:4964). The public home keeps `Hero`.
 * "Black Friday" corrects the frame, which says "Black Fiday".
 */
export function BlackFridayHero() {
  return (
    <section id="inicio" className="bg-surface">
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-8 px-5 pt-6 pb-8 md:px-8 lg:grid-cols-[minmax(0,648px)_minmax(0,1fr)] lg:gap-2 lg:px-[62px] lg:pt-8 lg:pb-6">
        <div className="flex max-w-[648px] flex-col items-start gap-5 max-lg:mx-auto max-lg:items-center max-lg:text-center">
          <p className="flex items-center gap-2.5 text-base font-bold tracking-[-0.64px]">
            <img src="/images/black-friday/brilho.svg" alt="" width={16} height={16} className="size-4" />
            <span className="bg-linear-[211deg] from-text-on-inverse-badge to-text-strong bg-clip-text text-transparent">
              {BLACK_FRIDAY.heroEyebrow}
            </span>
          </p>

          <h1 className="font-bold tracking-[-0.04em] text-text-strong">
            <span className="block text-[40px] leading-none sm:text-[56px] lg:text-[80px] lg:tracking-[-3.2px]">
              {BLACK_FRIDAY.heroTitle}
            </span>
            <img
              src="/images/black-friday/pincelada.svg"
              alt=""
              width={349}
              height={13}
              className="pointer-events-none -mt-1 mb-1 h-[11px] w-[min(344px,72%)] max-lg:mx-auto lg:-mt-2 lg:mb-0 lg:h-[13px] lg:-rotate-1"
            />
            <span className="block text-[32px] leading-[1.05] sm:text-[44px] lg:text-[60px] lg:leading-[1.15] lg:tracking-[-3.2px]">
              {BLACK_FRIDAY.heroTitleLine}
            </span>
          </h1>

          <p className="text-[22px] font-bold tracking-[-0.04em] text-text sm:text-[30px] sm:tracking-[-1.2px] sm:leading-[30px]">
            {BLACK_FRIDAY.heroSubtitle}
          </p>

          <div className="flex max-w-[540px] flex-col items-start gap-4 max-lg:items-center">
            <p className="flex items-center gap-3 rounded-pill border-[1.2px] border-gold-line bg-surface-card px-4 py-2.5 text-left text-sm leading-6 sm:px-6 sm:py-3 sm:text-[18px]">
              <img
                src="/images/black-friday/icone-presente.svg"
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0"
              />
              <span>
                <span className="font-medium text-text-strong">{BLACK_FRIDAY.heroPillLead}</span>
                <span className="font-bold text-gold-start">{BLACK_FRIDAY.heroPillStrong}</span>
              </span>
            </p>
            <p className="text-base leading-6 text-text-lead sm:text-[20px]">
              {BLACK_FRIDAY.heroParagraph}
              <span className="font-bold">{BLACK_FRIDAY.heroParagraphStrong}</span>
            </p>
          </div>

          <Button
            href={OFFER_ANCHOR}
            size="lg"
            shape="block"
            className="h-[68px] w-full max-w-[425px] rounded-[10px]! border border-gold-end bg-linear-90 from-gold-start to-gold-end text-[18px]! font-bold! tracking-[-0.64px]! text-on-action"
          >
            {BLACK_FRIDAY.heroCta}
          </Button>

          <dl className="flex w-full max-w-[540px] items-stretch justify-between gap-3 sm:gap-6">
            <div className="min-w-0">
              <dt className="text-[26px] font-semibold leading-none text-text-strong sm:text-[30px]">365</dt>
              <dd className="mt-1 text-sm leading-[1.15] text-text sm:text-[18px] sm:leading-[19.8px]">
                Dias de
                <br />
                Inspiração
              </dd>
            </div>
            <div aria-hidden className="my-1.5 w-px self-stretch bg-gold-line/40" />
            <div className="min-w-0">
              <dt className="text-[26px] font-semibold leading-none text-text-strong sm:text-[30px]">12</dt>
              <dd className="mt-1 text-sm leading-[1.15] text-text sm:text-[18px] sm:leading-[19.8px]">
                Temas
                <br />
                Mensais
              </dd>
            </div>
            <div aria-hidden className="my-1.5 w-px self-stretch bg-gold-line/40" />
            <div className="min-w-0">
              <dt className="flex h-[26px] items-center sm:h-[30px]">
                <span aria-hidden className={cn("size-[26px] bg-gold-start sm:size-[30px]", GIFT_MASK)} />
                <span className="sr-only">Brinde</span>
              </dt>
              <dd className="mt-1 text-sm leading-[1.15] text-text sm:text-[18px] sm:leading-[19.8px]">
                Brinde exclusivo
                <br />
                na Black Friday
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto aspect-[743/640] w-full max-w-[743px]">
          <img
            src="/images/black-friday/agenda-perspectiva.webp"
            alt="Agenda Ano Novo, Luta Nova 2027"
            width={672}
            height={967}
            fetchPriority="high"
            className="absolute top-0 left-0 w-[62%]"
          />
          <img
            src="/images/black-friday/planner-hoje.webp"
            alt="Folha do Planner Diário"
            width={840}
            height={687}
            className="absolute top-[16%] left-[26%] w-[72%]"
          />
          <img
            src="/images/black-friday/seta-curva.webp"
            alt=""
            width={280}
            height={318}
            className="pointer-events-none absolute top-[6%] left-[46%] w-[22%]"
          />
          <div className="absolute top-[2%] right-0 w-[30%] min-w-[108px] max-w-[178px]">
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
                "absolute inset-[16%] flex flex-col items-center justify-center text-center text-text-strong",
              )}
            >
              <span aria-hidden className={cn("mb-0.5 size-[18%] min-h-4 min-w-4 bg-text-strong", GIFT_MASK)} />
              <p className="text-[clamp(11px,1.5vw,22px)] leading-none font-bold tracking-[0.02em]">
                {BLACK_FRIDAY.sealTitle}
              </p>
              <p className="mt-0.5 text-[clamp(7px,0.85vw,13px)] leading-[1.15] font-semibold tracking-[0.01em]">
                <span className="font-black">1 </span>
                {BLACK_FRIDAY.sealLine}
                <br />
                {BLACK_FRIDAY.sealFoot}
              </p>
            </div>
          </div>

          <a
            href={OFFER_ANCHOR}
            className="absolute bottom-[4%] left-[14%] flex w-[46%] min-w-[168px] max-w-[210px] flex-col items-center gap-1 rounded-[10px] bg-surface-card p-2.5 shadow-pop sm:p-3"
          >
            <span className="pointer-events-none absolute inset-0 rounded-[10px] border border-gold-end" />
            <span className="relative flex items-end">
              <img
                src="/images/black-friday/agenda-capa.webp"
                alt=""
                width={220}
                height={321}
                className="h-14 w-auto"
              />
              <img
                src="/images/black-friday/planner-hoje.webp"
                alt=""
                width={840}
                height={687}
                className="-ml-3 h-10 w-auto"
              />
            </span>
            <span className="relative text-center leading-none">
              <span className="block text-[15px] font-bold tracking-[-0.04em] text-text-card">
                {BLACK_FRIDAY.heroCardTitle}
              </span>
              <span className="mt-0.5 block text-[11px] font-bold tracking-[-0.04em] text-text-card">
                {BLACK_FRIDAY.heroCardExtra}
              </span>
              <span className="mt-1 block text-sm font-bold text-text-muted">{priceLabel}</span>
            </span>
            <span className="relative rounded-[5px] bg-linear-90 from-gold-start to-gold-end px-4 py-2 text-[15px] leading-none font-bold text-on-action">
              {BLACK_FRIDAY.heroCardCta}
            </span>
          </a>
        </div>
      </div>

      <div
        aria-hidden
        className="h-[62px] w-full bg-surface-inverse-soft bg-[url(/images/black-friday/patinho.webp)] bg-[length:48px_34px] bg-center bg-repeat-x"
      />
    </section>
  );
}
