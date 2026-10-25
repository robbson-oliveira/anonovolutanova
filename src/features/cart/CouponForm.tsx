"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { IconClose } from "@ds/index";
import { useCart } from "./CartProvider";

/**
 * Coupon field for the drawer, the cart summary and the checkout. One
 * component, so the three stay in lockstep.
 *
 * The handler must not be async. React 19 treats a promise returned from
 * `onSubmit` as a form action and resets the form when it settles. The
 * controlled value stayed in state, the DOM went blank, and the next
 * keystrokes appended to the old code (`TESTE123` + `TESTE123`).
 */
export function CouponForm() {
  const { cart, busy, applyCoupon, removeCoupon, couponNotice, couponError } = useCart();
  const [code, setCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const pending = useRef(false);
  const id = useId();
  const applied = cart?.coupons ?? [];

  // The drawer is `transform`ed. After the busy re-render, mobile browsers
  // can leave the DOM value out of sync with what is painted. Writing the
  // state back keeps the field showing exactly what was typed.
  useEffect(() => {
    const el = inputRef.current;
    if (el && el.value !== code) el.value = code;
  }, [code, busy, couponError]);

  const commit = (value: string) => {
    setCode(value);
    if (inputRef.current && inputRef.current.value !== value) inputRef.current.value = value;
  };

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (pending.current) return;
    const typed = inputRef.current?.value ?? code;
    const snapshot = typed.trim();
    if (!snapshot) return;
    pending.current = true;
    void applyCoupon(snapshot).then((ok) => {
      pending.current = false;
      if (ok) {
        commit("");
        return;
      }
      const current = inputRef.current?.value ?? "";
      // Reset or a browser rewrite cleared the field, or appended the
      // same code a second time. Put back the value this attempt sent.
      if (current.trim() === "" || current === typed + typed || current === snapshot + snapshot) {
        commit(typed);
      }
    });
  };

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
        <form className="flex flex-col gap-2" onSubmit={onSubmit}>
          <div className="flex gap-2">
            <label className="sr-only" htmlFor={id}>
              Cupom de desconto
            </label>
            <input
              ref={inputRef}
              id={id}
              name="coupon"
              value={code}
              onChange={(ev) => {
                const next = ev.target.value;
                // One input event that repeats the whole value is a browser
                // rewrite (autocapitalize inside the transformed drawer),
                // not the shopper typing the code twice.
                if (code && next === code + code && (ev.nativeEvent as InputEvent).inputType !== "insertFromPaste") {
                  ev.target.value = code;
                  return;
                }
                setCode(next);
              }}
              placeholder="Cupom de desconto"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="h-11 min-w-0 flex-1 rounded-card border border-border bg-surface-plain px-3 text-sm text-text-strong placeholder:text-text-muted focus:border-action focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !code.trim()}
              className="h-11 cursor-pointer rounded-card border border-action px-4 text-sm font-semibold text-action transition-colors [transition-duration:var(--duration-fast)] hover:bg-action hover:text-on-action disabled:cursor-not-allowed disabled:opacity-50"
            >
              Aplicar
            </button>
          </div>
        </form>
      ) : null}

      {couponError ? (
        <p className="text-xs leading-snug text-accent" role="alert">
          {couponError}
        </p>
      ) : null}
    </div>
  );
}
