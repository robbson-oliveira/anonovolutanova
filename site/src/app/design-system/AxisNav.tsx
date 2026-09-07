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
          {axes.map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="text-xs text-text-muted transition-colors [transition-duration:var(--duration-fast)] hover:text-text-strong"
            >
              {a.title}
            </a>
          ))}
        </Container>
      </nav>
    </>
  );
}
