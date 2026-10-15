"use client";

import { useEffect, useState } from "react";
import { IconPix } from "@ds/index";

const SIZE = 140;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type PixCountdownProps = {
  /** When the Pix code expires, in epoch ms. */
  deadline: number;
  /** The code's whole validity window in ms: what the full ring stands for. */
  totalMs: number;
};

/**
 * Time left to pay the Pix, as in the reference: a ring that empties
 * clockwise from the top, with the remaining MM:SS (H:MM:SS past an hour) in
 * the middle. Both reach
 * zero when the code expires.
 */
export function PixCountdown({ deadline, totalMs }: PixCountdownProps) {
  // Only rendered in the browser (after the order is read), so starting from
  // the clock does not mismatch a server render.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, deadline - now);
  const expired = remaining === 0;
  const seconds = Math.floor(remaining / 1000);
  // Past an hour the minutes alone outgrow the ring, so the hours lead.
  const hours = Math.floor(seconds / 3600);
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const clock = hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
  const fraction = totalMs > 0 ? Math.min(1, remaining / totalMs) : 0;

  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-border bg-surface-plain p-6">
      <p className="flex items-center gap-2 text-label text-text-strong">
        <IconPix className="text-action" />
        Tempo para pagar o Pix
      </p>

      <div role="timer" aria-label={expired ? "O código Pix expirou" : `O Pix expira em ${clock}`} className="relative size-[140px]">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden className="-rotate-90">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" strokeWidth={STROKE} className="stroke-border" />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
            className="stroke-action transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="text-caption text-text-muted">{expired ? "Expirado" : "Expira em"}</span>
          <span className="text-stat tabular-nums text-action">{clock}</span>
        </div>
      </div>

      {expired ? (
        <p className="max-w-[360px] text-center text-fine text-text-muted">
          O código Pix expirou. Fale com a gente pelo WhatsApp para gerar um novo pagamento.
        </p>
      ) : null}
    </div>
  );
}

/** Placeholder while the order's Pix data is on its way. */
export function PixCountdownSkeleton() {
  return (
    <div aria-hidden className="flex flex-col items-center gap-4 rounded-card border border-border bg-surface-plain p-6">
      <span className="h-4 w-48 animate-pulse rounded-sm bg-surface-muted" />
      <span className="size-[140px] animate-pulse rounded-pill bg-surface-muted" />
    </div>
  );
}
