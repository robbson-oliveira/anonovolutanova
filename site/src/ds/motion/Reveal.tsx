"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@ds/utils/cn";

type RevealProps = {
  as?: "div" | "section" | "li" | "article" | "span";
  variant?: "up" | "left" | "right" | "pop";
  /** Atraso em ms. Usado para escalonar pares (esquerda/direita). */
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * Entrada ao entrar na tela.
 *
 * A direção da falha é deliberada, e vem de um problema real do protótipo:
 * a animação já nasce aplicada no CSS, e o JS apenas a PAUSA (via o atributo
 * `data-reveal-ready` no <html>). Se o JS não rodar, tudo anima no load —
 * nada fica preso invisível. O contrário (JS que precisa rodar para revelar)
 * deixa a página em branco quando falha.
 */
export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;

    if (!("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -5% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [revealed]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal={variant}
      data-revealed={revealed ? "" : undefined}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}

/**
 * Marca o documento como "o JS de reveal está vivo", o que habilita a pausa.
 * Roda inline no <head>, antes da primeira pintura — se fosse um efeito de
 * React, os blocos acima da dobra já teriam começado a animar.
 */
export const REVEAL_READY_SCRIPT =
  'document.documentElement.setAttribute("data-reveal-ready","")';
