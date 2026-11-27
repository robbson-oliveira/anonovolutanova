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
    <p className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[12px] leading-none md:text-[13px]">
      <span className="font-medium">{BLACK_FRIDAY.barEnds}</span>
      <span className="min-w-[4.75rem] font-bold tabular-nums text-gold-end">{time}</span>
    </p>
  );
}

/** Soft edges so a letter is never sliced in half at the marquee clip. */
const TICKER_MASK =
  "[mask-image:linear-gradient(to_right,transparent_0%,black_40px,black_calc(100%_-_40px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_40px,black_calc(100%_-_40px),transparent_100%)]";

const ticker = [
  <span key="gift" className="flex items-center gap-2 text-[13px] font-semibold text-text-on-inverse md:text-[15px]">
    <span aria-hidden className={cn("size-4 shrink-0 bg-gold-end", GIFT_MASK)} />
    {BLACK_FRIDAY.barGift}
  </span>,
  <span key="ship" className="flex items-center gap-2 text-[13px] font-semibold text-text-on-inverse md:text-[15px]">
    <IconPackage className="text-base text-text-on-inverse" />
    {BLACK_FRIDAY.barShipping}
  </span>,
];

/**
 * Top bar of `/home-2` only (Figma 2727:6214, 44px, petrol). The title and
 * the countdown stay put. Only the gift and shipping lines travel.
 *
 * On a phone the countdown sits on its own row so it never wraps, and the
 * travelling line uses the full width under the title.
 */
export function BlackFridayTopBar() {
  return (
    <div
      data-anln-topbar=""
      className="bg-surface-inverse-soft text-text-on-inverse max-lg:relative lg:fixed lg:inset-x-0 lg:top-0 lg:z-50"
    >
      <div className="mx-auto hidden h-11 max-w-[1140px] items-center gap-4 px-4 md:flex">
        <p className="flex shrink-0 items-center gap-2 text-sm font-semibold">
          <span aria-hidden className={cn("size-[18px] bg-gold-end", GIFT_MASK)} />
          {BLACK_FRIDAY.barTitle}
        </p>
        <span aria-hidden className="h-3.5 w-px shrink-0 bg-gold-end" />
        <Marquee items={ticker} gap={48} duration={22} className={cn("min-w-0 flex-1", TICKER_MASK)} />
        <span aria-hidden className="h-3.5 w-px shrink-0 bg-gold-end" />
        <Countdown />
      </div>

      <div className="mx-auto flex max-w-[1140px] flex-col gap-1 px-4 py-1.5 md:hidden">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <p className="flex min-w-0 items-center gap-1.5 text-[11px] leading-tight font-semibold">
            <span aria-hidden className={cn("size-4 shrink-0 bg-gold-end", GIFT_MASK)} />
            <span className="min-w-0">{BLACK_FRIDAY.barTitle}</span>
          </p>
          <Countdown />
        </div>
        <Marquee items={ticker} gap={28} duration={16} className={cn("w-full", TICKER_MASK)} />
      </div>
    </div>
  );
}
