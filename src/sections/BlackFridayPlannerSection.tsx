import { Playfair_Display } from "next/font/google";
import { cn } from "@ds/index";
import { BLACK_FRIDAY } from "@content/black-friday";
import { PLANNER } from "@content/home";
import { OFFER_ANCHOR } from "@content/product";
import { formatBRL } from "@/lib/format";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  display: "swap",
});

const GIFT_MASK =
  "[mask-image:url(/images/black-friday/icone-presente.svg)] [-webkit-mask-image:url(/images/black-friday/icone-presente.svg)] [mask-size:contain] [-webkit-mask-size:contain] [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-position:center]";

const copy = BLACK_FRIDAY.plannerSection;

/**
 * Planner block of `/home-2` (Figma 2727:798). The public home keeps `Planner`.
 */
export function BlackFridayPlannerSection() {
  return (
    <section id="planner-bf" className="bg-surface px-4 py-8 md:px-6 md:py-12">
      <div className="relative mx-auto flex w-full max-w-[1252px] flex-col gap-8 rounded-[20px] border-[1.2px] border-gold-line bg-surface px-5 py-7 lg:flex-row lg:items-center lg:gap-8 lg:rounded-[24px] lg:px-12 lg:py-10">
        <div className="flex w-full flex-col items-start gap-4 lg:w-[540px] lg:shrink-0 lg:gap-4">
          <div className="flex flex-col items-start gap-2.5">
            <p className="inline-flex w-fit items-center gap-2 rounded-pill bg-gold-start px-3.5 py-1.5">
              <img src="/black-friday/icone-presente-pill.svg" alt="" width={16} height={16} className="size-4" />
              <span className="text-sm leading-4 font-semibold text-on-action">{copy.pill}</span>
            </p>
            <h2 className="text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-text-strong lg:text-[50px] lg:leading-[54px] lg:tracking-[-2px]">
              {copy.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="max-w-[500px] text-[15px] leading-[25px] tracking-[-0.15px] text-text lg:text-[17px]">
              {copy.subtitle}
            </p>
          </div>

          <div className="flex w-full max-w-[500px] items-center gap-4 rounded-[14px] border border-gold-line bg-surface-card py-[18px] pr-[22px] pl-5">
            <img src="/black-friday/icone-presente-box.svg" alt="" width={38} height={44} className="h-11 w-[38px] shrink-0" />
            <span aria-hidden className="h-[60px] w-px shrink-0 bg-gold-line/55" />
            <span className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-[15px] leading-[22px] text-text-strong lg:text-[17px]">
                <span className="block font-semibold">{copy.giftLine}</span>
                <span className="block font-bold">{copy.giftStrong}</span>
              </span>
              <span className="text-[13px] leading-4 text-text">
                {copy.giftNote.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </span>
          </div>

          <p className="flex w-full max-w-[500px] items-center gap-3 text-[15px] leading-[21px] text-text">
            <img src="/black-friday/icone-etiqueta.svg" alt="" width={22} height={22} className="size-[22px] shrink-0" />
            <span>
              {copy.extraLead}
              <strong className="font-bold text-text-strong">{formatBRL(PLANNER.price)}</strong>
              {copy.extraTail}
            </span>
          </p>

          <a
            href={OFFER_ANCHOR}
            className="flex h-14 w-full max-w-[500px] items-center justify-center rounded-[10px] bg-linear-90 from-gold-start to-gold-end text-[17px] font-bold text-on-action"
          >
            {copy.cta}
          </a>
        </div>

        <div className="relative mx-auto min-h-[280px] w-full max-w-[620px] lg:min-h-[440px] lg:flex-1">
          <img
            src="/black-friday/planner-secao-inclined.png"
            alt="Folha inclinada do Planner Diário"
            width={1200}
            height={896}
            className="ml-auto w-[92%] max-w-[625px] [filter:drop-shadow(var(--shadow-bf-soft))] lg:absolute lg:right-0 lg:bottom-4 lg:w-[min(625px,100%)]"
          />
          <img
            src="/images/black-friday/seta-curva.webp"
            alt=""
            width={280}
            height={318}
            className="pointer-events-none absolute top-[8%] right-[34%] w-16 rotate-[89.44deg] lg:top-[4%] lg:w-24"
          />
          <div className="@container absolute top-0 right-0 w-[128px] lg:w-[174px]">
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
                "absolute inset-[16%] flex flex-col items-center justify-center text-center text-text-seal",
              )}
            >
              <span aria-hidden className={cn("mb-[1cqw] size-[18cqw] bg-text-seal", GIFT_MASK)} />
              <p className="text-[16cqw] leading-none font-bold">{BLACK_FRIDAY.sealTitle}</p>
              <p className="mt-[1cqw] text-[9cqw] leading-[1.1] font-semibold">
                <span className="font-black">1 </span>
                {BLACK_FRIDAY.sealLine}
                <br />
                {BLACK_FRIDAY.sealFoot}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
