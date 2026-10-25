"use client";

import { IconBasket, cn } from "@ds/index";
import { useOptionalCart } from "./CartProvider";

type CartButtonProps = {
  className?: string;
};

const badgeClass =
  "absolute top-0.5 right-0.5 grid size-4 min-w-4 place-items-center rounded-pill bg-surface-inverse px-0.5 text-[10px] leading-none font-bold text-text-on-inverse";

/**
 * The drawn bag is the same size in the phone header and beside Comprar.
 * The count sits in a small dark circle at the bag's top-right. No badge
 * when the cart is empty.
 */
export function BasketMark({ count, light = false }: { count: number; light?: boolean }) {
  return (
    <>
      <IconBasket />
      {count > 0 ? (
        <span className={cn(badgeClass, light && "bg-surface text-text-strong")}>
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </>
  );
}

/**
 * Desktop basket, beside Comprar. Hidden without a cart provider.
 * The phone header uses the same mark inside its own button.
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
        "relative inline-flex size-11 shrink-0 cursor-pointer items-center justify-center text-[26px] text-text-strong",
        "transition-colors [transition-duration:var(--duration-fast)] hover:text-action",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action",
        className,
      )}
    >
      <BasketMark count={count} />
    </button>
  );
}
