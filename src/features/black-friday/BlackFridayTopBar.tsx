"use client";

import { useSyncExternalStore } from "react";
import { IconPackage, cn } from "@ds/index";
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

function ShippingLine() {
  return (
    <p className="flex shrink-0 items-center gap-2 text-[12px] font-semibold whitespace-nowrap">
      <IconPackage className="text-base text-text-on-inverse" />
      {BLACK_FRIDAY.barShipping}
    </p>
  );
}

/**
 * Top bar of `/home-2` only. Desktop is one centered cluster: the campaign
 * name, the free-shipping line, and the countdown, with the spare space on
 * the outer edges of the bar. The phone stacks the name and the clock, then
 * the shipping line on its own.
 */
export function BlackFridayTopBar() {
  return (
    <div
      data-anln-topbar=""
      className="bg-surface-inverse-soft text-text-on-inverse max-lg:relative lg:fixed lg:inset-x-0 lg:top-0 lg:z-50"
    >
      <div className="hidden h-[34px] w-full items-center justify-center gap-5 px-6 text-[12px] md:flex">
        <p className="flex shrink-0 items-center gap-2 text-[12px] font-semibold whitespace-nowrap">
          <span aria-hidden className={cn("size-4 bg-gold-end", GIFT_MASK)} />
          {BLACK_FRIDAY.barTitle}
        </p>
        <span aria-hidden className="h-3.5 w-px shrink-0 bg-gold-end" />
        <ShippingLine />
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
        <div className="flex h-[26px] items-center justify-center px-3">
          <ShippingLine />
        </div>
      </div>
    </div>
  );
}
