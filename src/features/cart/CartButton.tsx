"use client";

import { IconBasket, cn } from "@ds/index";
import { useOptionalCart } from "./CartProvider";

type CartButtonProps = {
  className?: string;
};

/**
 * Desktop basket. Icon on the header surface, with the real quantity as
 * plain text beside it. No tile, no circle, no badge. An empty cart is the
 * icon alone. Hidden when there is no cart provider (institutional pages).
 * The phone header uses its own control and does not render this one.
 */
export function CartButton({ className }: CartButtonProps) {
  const cart = useOptionalCart();
  if (!cart) return null;

  const count = cart.count;
  const label = count > 0
    ? `Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}`
    : "Abrir carrinho";
  const classes = cn(
    "inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 rounded-card px-2 text-xl text-text-strong",
    "transition-colors [transition-duration:var(--duration-fast)] hover:text-action",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action",
    className,
  );
  const body = (
    <>
      <IconBasket />
      {count > 0 ? (
        <span className="text-sm font-bold tabular-nums leading-none">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </>
  );

  return (
    <button type="button" onClick={cart.openDrawer} aria-label={label} className={classes}>
      {body}
    </button>
  );
}
