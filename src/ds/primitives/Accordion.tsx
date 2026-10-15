"use client";

import { useId, useState } from "react";
import { IconPlus } from "@ds/icons";
import { cn } from "@ds/utils/cn";

export type AccordionItem = {
  question: string;
  /** Aceita rich text para os itens de FAQ que têm link. */
  answer: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  /**
   * `cards` = cada pergunta é um cartão branco separado (é o FAQ do design
   * aprovado). `divided` = lista contínua com divisores.
   */
  variant?: "divided" | "cards";
  /** Numera as perguntas ("1. …"), como no design aprovado. */
  numbered?: boolean;
  /** Índice aberto no primeiro render. `null` abre nenhum. */
  defaultOpen?: number | null;
  className?: string;
};

export function Accordion({
  items,
  variant = "divided",
  numbered = false,
  defaultOpen = null,
  className,
}: AccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();
  const cards = variant === "cards";

  return (
    <div
      className={cn(
        cards ? "space-y-3" : "divide-y divide-border",
        className,
      )}
    >
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;

        return (
          <div
            key={item.question}
            className={cn(cards && "rounded-card bg-surface-plain shadow-card")}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-6 text-left",
                  cards ? "px-5 py-6 md:px-7" : "py-6",
                )}
              >
                <span
                  className={cn(
                    "font-bold text-text-card",
                    cards ? "text-base" : "text-lead",
                  )}
                >
                  {numbered ? `${i + 1}. ` : null}
                  {item.question}
                </span>
                <IconPlus
                  className={cn(
                    "text-lg text-text-muted transition-transform",
                    "[transition-duration:var(--duration-fast)]",
                    isOpen && "rotate-45",
                  )}
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={cn(cards ? "px-5 pb-7 md:px-7" : "pb-7")}
            >
              {cards && <div className="mb-5 border-t border-dashed border-border" />}
              <div className="max-w-prose text-base text-text">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
