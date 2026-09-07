"use client";

import { useEffect, useRef, useState } from "react";
import { Container, cn } from "@ds/index";

type Axis = { id: string; title: string };

/**
 * Nav dos eixos. Não tem mais `top-9` fixo esperando a barra de frete — ela
 * rola com a página nesta rota (ver `TopBar sticky={false}` em page.tsx).
 * Isso libera o topo pra esta nav, e ela usa o espaço: ao grudar no topo
 * (via IntersectionObserver num sentinel logo acima), ganha altura — o gesto
 * de "entrar" no design system como se fosse outra página, não uma barra
 * secundária que só acompanha o scroll discretamente.
 */
export function AxisNav({ axes }: { axes: Axis[] }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = axes
      .map((a) => document.getElementById(a.id))
      .filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [axes]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px" />
      <nav className="sticky top-0 z-30 border-y border-border bg-surface/95 backdrop-blur">
        <Container
          className={cn(
            "flex flex-wrap items-center gap-x-6 gap-y-2 transition-[padding] [transition-duration:var(--duration-fast)]",
            stuck ? "py-5" : "py-3",
          )}
        >
          <span
            className={cn(
              "font-bold text-accent transition-[font-size] [transition-duration:var(--duration-fast)]",
              stuck ? "text-sm" : "text-xs",
            )}
          >
            Design System
          </span>
          {axes.map((a) => {
            const isActive = activeId === a.id;
            return (
              <a
                key={a.id}
                href={`#${a.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "group relative text-xs transition-colors [transition-duration:var(--duration-fast)]",
                  isActive
                    ? "font-bold text-text-strong"
                    : "text-text-muted hover:text-text-strong",
                )}
              >
                {a.title}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -right-2 top-1/2 h-[0.12em] w-[0.45em] -translate-y-1/2 rounded-sm bg-text-strong transition-opacity [transition-duration:var(--duration-fast)]",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60",
                  )}
                />
              </a>
            );
          })}
        </Container>
      </nav>
    </>
  );
}

