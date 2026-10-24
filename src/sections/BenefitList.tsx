"use client";

import { useLayoutEffect, useRef } from "react";
import { IconCheck, Text } from "@ds/index";

type BenefitListProps = {
  lines: readonly string[];
};

/**
 * Each line fades and rises on its own as it enters, and the same math
 * runs backwards when the reader scrolls up. Only opacity and translate
 * move, so the list does not jump. Reduced motion leaves every line still.
 */
export function BenefitList({ lines }: BenefitListProps) {
  const ref = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const ul = ref.current;
    if (!ul) return;
    const items = [...ul.querySelectorAll<HTMLLIElement>("li")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const apply = () => {
      frame = 0;
      if (reduce.matches) {
        for (const li of items) {
          li.style.opacity = "";
          li.style.transform = "";
        }
        return;
      }
      const vh = window.innerHeight || 1;
      const start = vh * 0.96;
      const end = vh * 0.7;
      const span = start - end;
      for (const li of items) {
        const top = li.getBoundingClientRect().top;
        const t = Math.min(1, Math.max(0, (start - top) / span));
        li.style.opacity = t.toFixed(3);
        li.style.transform = `translateY(${((1 - t) * 18).toFixed(2)}px)`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduce.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    <ul
      ref={ref}
      className="mt-4 grid gap-3 sm:grid-cols-2 max-md:mx-auto max-md:w-full max-md:max-w-[17rem]"
    >
      {lines.map((line) => (
        <li key={line} className="flex items-start gap-3 text-text max-md:gap-2.5">
          <span
            aria-hidden
            className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-pill bg-action text-on-action max-md:size-[18px] max-md:text-[15px]"
          >
            <IconCheck />
          </span>
          <Text as="span" size="xs" className="leading-snug max-md:text-[14px] max-md:leading-relaxed">
            {line}
          </Text>
        </li>
      ))}
    </ul>
  );
}
