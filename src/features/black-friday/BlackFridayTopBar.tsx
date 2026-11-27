"use client";

import { useSyncExternalStore } from "react";
import { Marquee, cn } from "@ds/index";
import { BLACK_FRIDAY } from "@content/black-friday";
import { blackFridayClock, type BlackFridayClock } from "@/lib/black-friday";

const GIFT_MASK =
  "[mask-image:url(/images/black-friday/icone-presente.svg)] [-webkit-mask-image:url(/images/black-friday/icone-presente.svg)] [mask-size:contain] [-webkit-mask-size:contain] [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-position:center]";

function subscribe(onChange: () => void): () => void {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}

/** Stable server snapshot. A live clock in the static HTML would mismatch hydration. */
const SERVER_CLOCK: BlackFridayClock = { phase: "end", time: "--:--:--" };

/**
 * `useSyncExternalStore` compares snapshots with `Object.is`. A fresh object
 * on every read is a new snapshot, so React re-renders forever and the page
 * dies right after the server HTML flashes on screen.
 */
let cachedClock: BlackFridayClock = SERVER_CLOCK;

function readClock(): BlackFridayClock {
  const next = blackFridayClock(Date.now());
  if (cachedClock.phase === next.phase && cachedClock.time === next.time) return cachedClock;
  cachedClock = next;
  return cachedClock;
}

/**
 * Before 08:00 BRT the label is "Começa em". At 08:00 it flips to "Termina em"
 * on the next tick, without a reload, and holds 00:00:00 after midnight.
 */
function Countdown() {
  const clock = useSyncExternalStore(subscribe, readClock, () => SERVER_CLOCK);

  return (
    <p className="flex shrink-0 items-center gap-1.5 text-[15px] leading-none whitespace-nowrap">
      <span className="font-medium">
        {clock.phase === "start" ? BLACK_FRIDAY.barStarts : BLACK_FRIDAY.barEnds}
      </span>
      <span className="min-w-[5.25rem] font-bold tabular-nums text-gold-end">{clock.time}</span>
    </p>
  );
}

/** One phrase wide. The run is duplicated inside `Marquee`, so the loop has no jump. */
const shippingTicker = Array.from({ length: 6 }, (_, index) => (
  <span key={index} className="text-[15px] font-medium whitespace-nowrap text-text-on-inverse">
    <span aria-hidden className="mr-2">📦</span>
    {BLACK_FRIDAY.barShipping}
  </span>
));

/**
 * Top bar of `/home-2` only. Desktop is one centered cluster: the campaign
 * name, a one-phrase window where the shipping line travels, and the
 * countdown. Spare space stays on the outer edges. The phone keeps the name
 * and the clock fixed, and lets the shipping line travel on the row below.
 */
export function BlackFridayTopBar() {
  return (
    <div
      data-anln-topbar=""
      className="bg-surface-inverse text-text-on-inverse max-lg:relative lg:fixed lg:inset-x-0 lg:top-0 lg:z-50"
    >
      <div className="hidden h-9 w-full items-center justify-center gap-5 px-6 md:flex">
        <p className="flex shrink-0 items-center gap-2 text-[15px] font-semibold whitespace-nowrap">
          <span aria-hidden className={cn("size-4 bg-gold-end", GIFT_MASK)} />
          {BLACK_FRIDAY.barTitle}
        </p>
        <span aria-hidden className="h-4 w-px shrink-0 bg-gold-end" />
        <Marquee items={shippingTicker} gap={32} duration={28} fade className="w-[17.5rem] shrink-0" />
        <span aria-hidden className="h-4 w-px shrink-0 bg-gold-end" />
        <Countdown />
      </div>

      <div className="flex w-full flex-col md:hidden">
        <div className="flex h-9 items-center justify-center gap-2.5 px-3">
          <p className="text-[15px] leading-none font-extrabold tracking-[0.26px] whitespace-nowrap">
            {BLACK_FRIDAY.barTitleMobile}
          </p>
          <span aria-hidden className="h-3.5 w-px shrink-0 bg-gold-end opacity-70" />
          <Countdown />
        </div>
        <Marquee items={shippingTicker} gap={48} duration={22} fade className="flex h-9 w-full items-center" />
      </div>
    </div>
  );
}
