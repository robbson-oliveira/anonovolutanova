"use client";

import { IconBasket, cn } from "@ds/index";
import { useOptionalCart } from "./CartProvider";

type CartButtonProps = {
  className?: string;
};

/**
 * Desktop basket. The drawn glyph is nearly as tall as the Comprar button
 * (the viewBox padding is why the em is larger than the button), and the
 * real quantity sits in a small badge. An empty cart is the icon alone.
 * Hidden when there is no cart provider. The phone header uses HeaderCart.
 */
export function CartButton({ className }: CartButtonProps) {
  const cart = useOptionalCart();
  if (!cart) return null;

  const count = cart.count;
  const label = count > 0
    ? `Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}`
    : "Abrir carrinho";

  return (
    <button
      type="button"
      onClick={cart.openDrawer}
      aria-label={label}
      className={cn(
        // The 16px viewBox leaves padding around the glyph, so the em has
        // to overshoot the 44px Comprar button for the drawing itself to
        // approach that height. w-16 keeps the overflow inside the button.
        "relative inline-flex h-11 w-16 shrink-0 cursor-pointer items-center justify-center text-text-strong",
        "transition-colors [transition-duration:var(--duration-fast)] hover:text-action",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action",
        className,
      )}
    >
      <IconBasket className="text-[56px]" />
      {count > 0 ? (
        <span className="absolute top-0 right-1 grid h-4 min-w-4 place-items-center rounded-pill bg-action px-1 text-[10px] leading-none font-bold text-on-action">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
