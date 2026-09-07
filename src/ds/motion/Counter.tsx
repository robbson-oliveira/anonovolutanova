"use client";

import { useEffect, useRef, useState } from "react";

type CounterProps = {
  /** Valor final. */
  value: number;
  /** Sufixo preservado durante toda a contagem (ex.: "%"). */
  suffix?: string;
  className?: string;
};

const DURATION = 1600;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Número que sobe de 0 até o valor ao entrar na tela.
 *
 * O valor final vem por prop e nunca é lido de volta do DOM. No protótipo o
 * alvo era lido do texto renderizado, e um segundo disparo lia um número já
 * em animação como se fosse o destino.
 */
export function Counter({ value, suffix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (started.current) return;
      started.current = true;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) {
        setDisplay(value);
        return;
      }

      let t0: number | null = null;
      const step = (ts: number) => {
        if (t0 === null) t0 = ts;
        const k = Math.min(1, (ts - t0) / DURATION);
        setDisplay(Math.round(value * easeOutCubic(k)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run();
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
