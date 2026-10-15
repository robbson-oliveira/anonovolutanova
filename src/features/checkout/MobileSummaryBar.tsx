"use client";

import { useEffect, useRef, useState } from "react";
import { IconBasket, IconChevronUp, IconClose, cn } from "@ds/index";
import { formatBRL } from "@/lib/format";

/**
 * Celular: barra fixa "Ver resumo do pedido · total" que abre o resumo por
 * baixo, como na referência. No desktop o resumo fica na coluna da direita.
 */
export function MobileSummaryBar({ total, children }: { total: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (ev: KeyboardEvent) => ev.key === "Escape" && setOpen(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 rounded-t-card bg-action px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-field font-medium text-on-action shadow-float"
      >
        <span className="flex items-center gap-2">
          <IconBasket className="text-lead" />
          Ver resumo do pedido
        </span>
        <span className="flex items-center gap-1.5 font-bold">
          {formatBRL(total)}
          <IconChevronUp />
        </span>
      </button>

      <div className={cn("fixed inset-0 z-50", open ? "" : "pointer-events-none")} aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-surface-inverse/50 transition-opacity [transition-duration:var(--duration-fast)]",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Resumo do pedido"
          className={cn(
            "absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-card bg-surface-plain shadow-float",
            "transition-[translate] [transition-duration:var(--duration-fast)]",
            open ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex justify-end px-4 pt-3">
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar resumo"
              className="grid size-10 cursor-pointer place-items-center text-xl text-text-strong"
            >
              <IconClose />
            </button>
          </div>
          <div className="overflow-y-auto px-5 pb-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
