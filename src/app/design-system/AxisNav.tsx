"use client";

import { useEffect, useState } from "react";
import { Container, cn } from "@ds/index";

type Axis = { id: string; title: string };

/**
 * Nav dos eixos, sempre no tamanho grande — sem efeito de crescer/encolher
 * ao grudar no topo. Só marca o eixo ativo via IntersectionObserver.
 */
export function AxisNav({ axes }: { axes: Axis[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

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
    <nav className="sticky top-0 z-30 border-y border-border bg-surface/95 backdrop-blur">
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-2 py-5">
        <span className="text-sm font-bold text-accent">Design System</span>
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
                  "absolute -bottom-1.5 left-1/2 h-[0.14em] w-[0.65em] -translate-x-1/2 rounded-sm bg-text-strong transition-opacity [transition-duration:var(--duration-fast)]",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60",
                )}
              />
            </a>
          );
        })}
      </Container>
    </nav>
  );
}
