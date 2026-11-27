"use client";

import { useSyncExternalStore } from "react";
import { IconPackage, Marquee, cn } from "@ds/index";
import { BLACK_FRIDAY } from "@content/black-friday";
import { BLACK_FRIDAY_END_MS } from "@/lib/black-friday";

const GIFT_MASK =
  "[mask-image:url(/images/black-friday/icone-presente.svg)] [-webkit-mask-image:url(/images/black-friday/icone-presente.svg)] [mask-size:contain] [-webkit-mask-size:contain] [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-position:center]";

function formatRemaining(now: number): string {
  const diff = Math.max(0, BLACK_FRIDAY_END_MS + 999 - now);
  const total = Math.floor(diff / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function subscribe(onChange: () => void): () => void {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}

/**
 * The server snapshot is a fixed placeholder. A clock rendered during the
 * static build would not match the browser a second later, and that is a
 * hydration warning. React hydrates the placeholder, then paints the live
 * remaining time.
 */
function Countdown() {
  const time = useSyncExternalStore(
    subscribe,
    () => formatRemaining(Date.now()),
    () => "--:--:--",
  );

  return (
    <p className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[12px] leading-none">
      <span className="font-medium">{BLACK_FRIDAY.barEnds}</span>
      <span className="min-w-[4.75rem] font-bold tabular-nums text-gold-end">{time}</span>
    </p>
  );
}

/** Soft edges so a letter is never sliced in half at the marquee clip. */
const TICKER_MASK =
  "[mask-image:linear-gradient(to_right,transparent_0%,black_40px,black_calc(100%_-_40px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_40px,black_calc(100%_-_40px),transparent_100%)]";

/**
 * Six copies, then the marquee duplicates the run. The wide margin is what
 * leaves about one and a half phrases in the track: the phrase is 216px, so
 * the margin is `track / 1.5 - 216` at 1440 (580px) and at 1920 (909px).
 */
const ticker = Array.from({ length: 6 }, (_, index) => (
  <span key={index} className="flex items-center gap-2 text-[12px] font-semibold text-text-on-inverse">
    <IconPackage className="text-base text-text-on-inverse" />
    {BLACK_FRIDAY.barShipping}
  </span>
));

/**
 * Top bar of `/home-2` only. The campaign name and the countdown stay put.
 * Between the rules, only the free-shipping line travels.
 *
 * On a phone that line is the row under the fixed title and timer.
 */
export function BlackFridayTopBar() {
  return (
    <div
      data-anln-topbar=""
      className="bg-surface-inverse-soft text-text-on-inverse max-lg:relative lg:fixed lg:inset-x-0 lg:top-0 lg:z-50"
    >
      <div className="mx-auto hidden h-[34px] w-full items-center gap-3 px-6 text-[12px] md:flex lg:w-[min(1316px,68.54vw)] lg:px-0">
        <p className="flex shrink-0 items-center gap-2 text-[12px] font-semibold">
          <span aria-hidden className={cn("size-4 bg-gold-end", GIFT_MASK)} />
          {BLACK_FRIDAY.barTitle}
        </p>
        <span aria-hidden className="h-3.5 w-px shrink-0 bg-gold-end" />
        <Marquee
          items={ticker}
          gap={170}
          duration={48}
          className={cn(
            "min-w-0 flex-1",
            TICKER_MASK,
            "min-[1600px]:[&_li]:mr-[250px]! min-[1800px]:[&_li]:mr-[340px]! min-[1920px]:[&_li]:mr-[390px]!",
          )}
        />
        <span aria-hidden className="h-3.5 w-px shrink-0 bg-gold-end" />
        <Countdown />
      </div>

      <div className="flex w-full flex-col md:hidden">
        <div className="flex h-8 items-center justify-center gap-2.5 px-3">
          <p className="text-[13px] leading-none font-extrabold tracking-[0.26px] whitespace-nowrap">
            {BLACK_FRIDAY.barTitleMobile}
          </p>
          <span aria-hidden className="h-3 w-px shrink-0 bg-gold-end opacity-70" />
          <Countdown />
        </div>
        <Marquee items={ticker} gap={72} duration={32} className={cn("flex h-[26px] w-full items-center", TICKER_MASK)} />
      </div>
    </div>
  );
}
