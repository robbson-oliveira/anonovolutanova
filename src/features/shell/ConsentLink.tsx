"use client";

import { cn } from "@ds/index";

type ConsentWindow = Window & { anlnConsent?: { open: () => void } };

/**
 * Reabre o aviso de cookies (public/consent.js) para mudar a escolha.
 * O padrão é para o rodapé escuro; `className` substitui tamanho, peso e cor
 * (o `cn` só junta classes, não resolve conflito entre elas).
 */
export function ConsentLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => (window as ConsentWindow).anlnConsent?.open()}
      className={cn(
        "cursor-pointer underline-offset-4 hover:underline",
        className ?? "text-xs font-semibold text-text-on-inverse opacity-80",
      )}
    >
      Preferências de cookies
    </button>
  );
}
