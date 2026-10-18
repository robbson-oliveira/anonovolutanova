"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@ds/index";

/** Geometry carried over from the strip on the affiliate pages. */
const DUCK_COUNT = 40;
/** Delay between neighbouring ducks: each one steps right after the one on its left. */
const STAGGER_MS = 120;
/** Ducks past this index are off screen on any desktop, so they all move together. */
const STAGGER_CAP = 30;
const STEP_MS = 1700;
const REST_MS = 800;
/** Time until the last visible duck has stopped, plus a small margin. */
const SETTLE_MS = STAGGER_CAP * STAGGER_MS + STEP_MS + 400;

/**
 * Strip of gold ducks above the footer (71px tall, same band as before).
 *
 * Two motions stack on purpose:
 * - the whole row drifts left very slowly (`animate-duck-drift`, CSS only);
 * - on top of that, the ducks step left one by one: each takes a 76px step a
 *   moment after its left neighbour, so it reads as a wave, not a block.
 *
 * The step is driven by state because it has to restart from the origin: when
 * every duck has moved one slot, `snap` turns the transition off and puts them
 * all back at once. They are identical, so nobody sees the jump.
 *
 * The cycle only runs while the strip is on screen, and not at all for people
 * who ask for reduced motion (the row then just sits there).
 */
export function DuckStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(false);
  const [snap, setSnap] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timers: number[] = [];
    const run = () => {
      setSnap(false);
      setStep(true);
      timers.push(
        window.setTimeout(() => {
          // Back to the origin with no transition; re-enable it two frames later.
          setSnap(true);
          setStep(false);
          requestAnimationFrame(() => requestAnimationFrame(() => setSnap(false)));
          timers.push(window.setTimeout(run, REST_MS));
        }, SETTLE_MS),
      );
    };
    timers.push(window.setTimeout(run, 1200));

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      setStep(false);
      setSnap(true);
    };
  }, [visible]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative z-10 h-[71px] overflow-hidden bg-surface-inverse-soft lg:top-[-82px]"
    >
      <div className="-ml-[76px] flex h-full w-max animate-duck-drift items-center gap-7 motion-reduce:animate-none">
        {Array.from({ length: DUCK_COUNT }, (_, i) => (
          <Image
            key={i}
            src="/img/footer/pato.png"
            alt=""
            width={96}
            height={68}
            sizes="48px"
            className={cn(
              "h-auto w-12 shrink-0 transition-transform duration-[1700ms] ease-[cubic-bezier(0.45,0,0.25,1)]",
              step && "-translate-x-[76px]",
              snap && "transition-none",
            )}
            style={{ transitionDelay: `${Math.min(i, STAGGER_CAP) * STAGGER_MS}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
