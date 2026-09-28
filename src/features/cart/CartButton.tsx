"use client";

import { IconBasket } from "@ds/index";
import { useOptionalCart } from "./CartProvider";

/**
 * Botão do carrinho no cabeçalho. Só aparece dentro da loja (com
 * CartProvider) e com algo no carrinho: fora disso não há o que mostrar.
 * No celular fica só o ícone com a contagem, para caber ao lado do "Comprar".
 */
export function CartButton() {
  const cart = useOptionalCart();
  if (!cart || cart.count === 0) return null;

  return (
    <button
      type="button"
      onClick={cart.openDrawer}
      aria-label={`Abrir carrinho, ${cart.count} ${cart.count === 1 ? "item" : "itens"}`}
      className="relative inline-flex h-11 cursor-pointer items-center gap-2 rounded-card border border-border bg-surface-plain px-3 text-sm font-semibold text-text-strong transition-colors [transition-duration:var(--duration-fast)] hover:border-action sm:px-4"
    >
      <IconBasket className="text-lg sm:hidden" />
      <span className="max-sm:hidden">Carrinho</span>
      <span className="grid min-w-6 place-items-center rounded-pill bg-action px-1.5 text-xs font-bold text-on-action">
        {cart.count}
      </span>
    </button>
  );
}
