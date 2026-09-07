"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@ds/utils/cn";

type RevealProps = {
  as?: "div" | "section" | "li" | "article" | "span";
  variant?: "up" | "left" | "right" | "pop" | "forward";
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
/**
 * Quando um bloco tem várias camadas que precisam entrar JUNTAS (um card com
 * páginas sobrepostas, por exemplo), o gatilho é o grupo inteiro — e não cada
 * camada por si, o que fazia a entrada parecer travada e escalonada demais.
 */
const RevealGroupContext = createContext<boolean | null>(null);

export function RevealGroup({
  as: Tag = "div",
  className,
  children,
}: {
  as?: "div" | "section" | "li" | "article" | "span";
  className?: string;
  children: React.ReactNode;
}) {
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
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealed]);

  return (
    <RevealGroupContext.Provider value={revealed}>
      <Tag ref={ref as React.Ref<never>} className={cn(className)}>
        {children}
      </Tag>
    </RevealGroupContext.Provider>
  );
}

export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const group = useContext(RevealGroupContext);
  const [selfRevealed, setSelfRevealed] = useState(false);
  const revealed = group !== null ? group : selfRevealed;
  const setRevealed = setSelfRevealed;

  useEffect(() => {
    if (group !== null) return;
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
  }, [group, revealed]);

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
