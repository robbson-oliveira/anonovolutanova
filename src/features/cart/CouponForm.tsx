"use client";

import { useState } from "react";
import { IconClose } from "@ds/index";
import { useCart } from "./CartProvider";

/**
 * Cupom. É o canal das afiliadas (cada uma tem o seu), então fica sempre
 * visível, não escondido atrás de um "tem cupom?".
 */
export function CouponForm() {
  const { cart, busy, applyCoupon, removeCoupon, couponNotice } = useCart();
  const [code, setCode] = useState("");
  const applied = cart?.coupons ?? [];

  return (
    <div className="flex flex-col gap-2">
      {applied.map((c) => (
        <div
          key={c.code}
          className="flex items-center justify-between rounded-card bg-surface-warm px-3 py-2 text-xs font-bold text-text-strong"
        >
          <span>Cupom {c.code.toUpperCase()} aplicado</span>
          <button
            type="button"
            disabled={busy}
            onClick={() => void removeCoupon(c.code)}
            aria-label={`Remover o cupom ${c.code.toUpperCase()}`}
            className="grid size-6 cursor-pointer place-items-center text-text-muted hover:text-text-strong"
          >
            <IconClose />
          </button>
        </div>
      ))}

      {couponNotice && applied.length === 0 ? (
        <p className="text-xs leading-snug text-text-muted" role="status">
          {couponNotice}
        </p>
      ) : null}

      {applied.length === 0 ? (
        <form
          className="flex gap-2"
          onSubmit={async (ev) => {
            ev.preventDefault();
            if (code.trim() && (await applyCoupon(code))) setCode("");
          }}
        >
          <label className="sr-only" htmlFor="coupon-code">
            Cupom de desconto
          </label>
          <input
            id="coupon-code"
            value={code}
            onChange={(ev) => setCode(ev.target.value)}
            placeholder="Cupom de desconto"
            autoComplete="off"
            autoCapitalize="characters"
            className="h-11 min-w-0 flex-1 rounded-card border border-border bg-surface-plain px-3 text-sm text-text-strong uppercase placeholder:normal-case placeholder:text-text-muted focus:border-action focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !code.trim()}
            className="h-11 cursor-pointer rounded-card border border-action px-4 text-sm font-semibold text-action transition-colors [transition-duration:var(--duration-fast)] hover:bg-action hover:text-on-action disabled:cursor-not-allowed disabled:opacity-50"
          >
            Aplicar
          </button>
        </form>
      ) : null}
    </div>
  );
}
