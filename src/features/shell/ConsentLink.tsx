"use client";

type ConsentWindow = Window & { anlnConsent?: { open: () => void } };

/** Reabre o aviso de cookies (public/consent.js) para mudar a escolha. */
export function ConsentLink() {
  return (
    <button
      type="button"
      onClick={() => (window as ConsentWindow).anlnConsent?.open()}
      className="cursor-pointer text-xs font-semibold text-text-on-inverse underline-offset-4 opacity-80 hover:underline"
    >
      Preferências de cookies
    </button>
  );
}
