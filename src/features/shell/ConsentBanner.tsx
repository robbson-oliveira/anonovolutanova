"use client";

import { useEffect, useState } from "react";
import { CONSENT_STORAGE_KEY } from "@/lib/tracking/gtm";

/** Evento que reabre o aviso (link "Preferências de cookies" do rodapé). */
export const CONSENT_OPEN_EVENT = "anln:consent-open";

type Choice = "granted" | "denied";

type GtagWindow = Window & { dataLayer?: unknown[] };

function readChoice(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * O gtag empilha o objeto `arguments`, não um array: o GTM só reconhece o
 * comando de consentimento nesse formato.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- lidos via `arguments`
function gtag(..._args: unknown[]): void {
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments);
}

/** Grava a escolha e avisa o GTM (Consent Mode v2). */
function decide(choice: Choice) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Sem storage (aba anônima): vale para esta visita.
  }
  gtag("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
  (window as GtagWindow).dataLayer!.push({ event: `anln_consent_${choice}` });
}

const buttonClass =
  "cursor-pointer rounded-[10px] border px-4 py-2.5 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight";

/**
 * Aviso de cookies (LGPD) + Consent Mode v2. O consentimento começa negado no
 * snippet do GTM (src/lib/tracking/gtm.ts, que também restaura uma escolha já
 * feita antes de o GTM carregar); aqui a pessoa escolhe.
 *
 * Aparece sozinho enquanto não há escolha gravada e reabre pelo evento
 * CONSENT_OPEN_EVENT (ver ConsentLink).
 */
export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Só no navegador: a escolha vive no localStorage, que o servidor não vê.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!readChoice()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (choice: Choice) => {
    decide(choice);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-4 bottom-4 z-[2147483000] mx-auto flex max-w-[560px] flex-wrap items-center gap-x-5 gap-y-3 rounded-card bg-surface-consent px-5 py-4 font-sans text-label leading-snug font-normal text-text-on-inverse shadow-float"
    >
      <p className="m-0 flex-[1_1_260px]">
        Usamos cookies para entender como o site é usado e melhorar a sua experiência. Você escolhe.{" "}
        <a href="/politica-de-privacidade" className="font-bold text-inherit underline underline-offset-[3px]">
          Política de Privacidade
        </a>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => choose("denied")}
          className={`${buttonClass} border-border-inverse bg-transparent text-inherit`}
        >
          Recusar
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className={`${buttonClass} border-highlight bg-highlight text-text-strong`}
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
