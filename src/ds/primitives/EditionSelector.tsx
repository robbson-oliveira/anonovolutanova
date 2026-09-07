"use client";

import { useState } from "react";
import { cn } from "@ds/utils/cn";

export type EditionOption = {
  id: string;
  label: string;
};

type EditionSelectorProps = {
  options: readonly EditionOption[];
  value: string;
  onChange: (id: string) => void;
  /** Congela a barra sem perder o progresso (hover na capa ou no seletor). */
  paused?: boolean;
  className?: string;
};

/**
 * Seletor de edição com barra de progresso auto-alternante.
 *
 * O avanço automático é dirigido pelo `animationend` da própria barra, não por
 * um timer paralelo. Isso resolve de graça o requisito de "pausa e retoma de
 * onde parou": `animation-play-state: paused` congela a barra E o relógio.
 * Um setTimeout precisaria de aritmética de tempo restante para o mesmo efeito.
 *
 * A troca manual reinicia a barra porque a `key` muda e o elemento remonta.
 */
export function EditionSelector({
  options,
  value,
  onChange,
  paused = false,
  className,
}: EditionSelectorProps) {
  const [restartCount, setRestartCount] = useState(0);

  const advance = () => {
    const i = options.findIndex((o) => o.id === value);
    onChange(options[(i + 1) % options.length].id);
  };

  const select = (id: string) => {
    setRestartCount((n) => n + 1);
    onChange(id);
  };

  return (
    <div
      role="tablist"
      aria-label="Edição da agenda"
      className={cn("flex items-end justify-center gap-14", className)}
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => select(option.id)}
            className={cn(
              "relative cursor-pointer border-b-[3px] px-0.5 pb-2.5",
              "text-[22px] leading-tight tracking-[-0.02em] transition-colors",
              "[transition-duration:var(--duration-fast)]",
              active
                ? "border-accent-track font-bold text-accent"
                : "border-transparent font-medium text-text-muted hover:text-accent",
            )}
          >
            {option.label}

            {active && (
              <span
                key={`${value}-${restartCount}`}
                aria-hidden
                data-motion="edition-progress"
                onAnimationEnd={advance}
                style={{ animationPlayState: paused ? "paused" : "running" }}
                className={cn(
                  "absolute -bottom-[3px] left-0 h-[3px] w-full origin-left bg-accent",
                  "[animation:ds-progress-fill_var(--duration-edition)_linear_forwards]",
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
