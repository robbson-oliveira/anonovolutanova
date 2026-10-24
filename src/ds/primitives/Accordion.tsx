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
        cards ? "space-y-[17px]" : "divide-y divide-border",
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
            className={cn(cards && "rounded-[5.19px] bg-surface-plain shadow-faq-card")}
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
                  cards ? "min-h-[82px] px-5 py-4" : "py-6",
                )}
              >
                <span
                  className={cn(
                    "text-text-card",
                    cards ? "text-base font-medium tracking-[-0.03em] md:text-xl" : "text-lead font-bold",
                  )}
                >
                  {numbered ? `${i + 1}. ` : null}
                  {item.question}
                </span>
                <IconPlus
                  className={cn(
                    "shrink-0 text-base transition-transform",
                    cards ? "text-text-card" : "text-lg text-text-muted",
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
              className={cn(
                cards
                  ? "mt-4 border-t-[0.8px] border-dashed border-text-card/40 px-5 py-5"
                  : "pb-7",
              )}
            >
              <div
                className={cn(
                  "text-text",
                  cards
                    ? "text-[15px] leading-[1.45] tracking-[-0.01em] opacity-70 md:text-[18px] md:leading-[1.4] [&_p]:text-balance"
                    : "max-w-prose text-base",
                )}
              >
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
