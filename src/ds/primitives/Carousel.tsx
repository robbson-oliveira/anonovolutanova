"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@ds/utils/cn";

type CarouselProps = {
  children: React.ReactNode;
  /** Rótulo acessível da região. */
  label: string;
  className?: string;
};

/**
 * Trilho horizontal com scroll-snap e botões de passo.
 *
 * O deslocamento é medido a partir da largura real do primeiro item, não de um
 * número fixo: os cards mudam de largura entre breakpoints e um passo fixo
 * deixaria de coincidir com o snap.
 */
export function Carousel({ children, label, className }: CarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const step = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const amount = first ? first.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <div className={className}>
      <ul
        ref={trackRef}
        aria-label={label}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>

      <div className="mt-6 flex gap-2.5">
        {([-1, 1] as const).map((direction) => (
          <button
            key={direction}
            type="button"
            aria-label={direction === -1 ? "Anterior" : "Próximo"}
            disabled={direction === -1 ? atStart : atEnd}
            onClick={() => step(direction)}
            className={cn(
              "grid size-12 cursor-pointer place-items-center rounded-card",
              "bg-surface-inverse text-text-on-inverse",
              "transition-opacity [transition-duration:var(--duration-fast)]",
              "disabled:cursor-not-allowed disabled:opacity-35",
            )}
          >
            <span aria-hidden>{direction === -1 ? "‹" : "›"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
