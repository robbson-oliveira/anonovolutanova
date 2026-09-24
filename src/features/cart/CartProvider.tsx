"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as storeApi from "@/lib/commerce/store-api";
import { errorMessage, type StoreCart } from "@/lib/commerce/store-api";

type CartContextValue = {
  cart: StoreCart | null;
  /** O carrinho já foi lido (ou não há carrinho para ler)? Antes disso, vazio não quer dizer vazio. */
  ready: boolean;
  /** Soma das quantidades (as duas edições contam). */
  count: number;
  /** Alguma chamada ao carrinho em andamento. */
  busy: boolean;
  error: string | null;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  refresh: () => Promise<StoreCart | null>;
  add: (variationId: number, quantity: number) => Promise<boolean>;
  setQuantity: (key: string, quantity: number) => Promise<void>;
  remove: (key: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: (code: string) => Promise<void>;
  /** Troca o carrinho pelo que uma chamada do checkout devolveu. */
  replace: (cart: StoreCart) => void;
  /** Depois do pedido: o WooCommerce já esvaziou o carrinho, começa outro. */
  reset: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const hasStoredToken = () => {
  try {
    return Boolean(window.localStorage.getItem("anln_cart_token"));
  } catch {
    return false;
  }
};

/**
 * Estado do carrinho, espelhando o do WooCommerce (a fonte da verdade é
 * sempre a Store API: cada ação devolve o carrinho inteiro e ele substitui o
 * local). Portado de `contexts/cart-context.tsx` do storefront, sem a
 * personalização de produto e sem tracking (Fase 5).
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<StoreCart | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const pending = useRef(0);

  // Toda ação passa por aqui: marca ocupado, troca o carrinho pela resposta e
  // guarda a mensagem de erro (o WooCommerce manda o carrinho atual junto de
  // erros de estoque, então ele é aplicado mesmo na falha).
  const run = useCallback(async (action: () => Promise<StoreCart>, fallback: string) => {
    pending.current += 1;
    setBusy(true);
    setError(null);
    try {
      const next = await action();
      setCart(next);
      return next;
    } catch (err) {
      if (storeApi.isStoreApiError(err) && err.cart) setCart(err.cart);
      setError(errorMessage(err, fallback));
      return null;
    } finally {
      pending.current -= 1;
      if (pending.current === 0) setBusy(false);
    }
  }, []);

  const refresh = useCallback(
    () => run(storeApi.getCart, "Não foi possível carregar o carrinho."),
    [run],
  );

  // Só busca o carrinho de quem já tem um: sem token, cada visita criaria uma
  // sessão vazia no WooCommerce.
  useEffect(() => {
    // Busca inicial: o `refresh` liga o "ocupado" antes da requisição, e é
    // isso que o React Compiler aponta aqui. É o comportamento desejado.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const load = hasStoredToken() ? refresh() : Promise.resolve(null);
    void load.finally(() => setReady(true));
  }, [refresh]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      ready,
      count: cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
      busy,
      error,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      refresh,
      add: async (variationId, quantity) =>
        Boolean(
          await run(
            () => storeApi.addCartItem({ id: variationId, quantity }),
            "Não foi possível adicionar ao carrinho.",
          ),
        ),
      setQuantity: async (key, quantity) => {
        await run(
          () =>
            quantity > 0
              ? storeApi.updateCartItem({ key, quantity })
              : storeApi.removeCartItem({ key }),
          "Não foi possível atualizar a quantidade.",
        );
      },
      remove: async (key) => {
        await run(() => storeApi.removeCartItem({ key }), "Não foi possível remover o item.");
      },
      applyCoupon: async (code) =>
        Boolean(await run(() => storeApi.applyCoupon(code.trim()), "Não foi possível aplicar o cupom.")),
      removeCoupon: async (code) => {
        await run(() => storeApi.removeCoupon(code), "Não foi possível remover o cupom.");
      },
      replace: setCart,
      reset: () => {
        storeApi.forgetCartToken();
        setCart(null);
        setError(null);
      },
    }),
    [cart, ready, busy, error, drawerOpen, refresh, run],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa de <CartProvider>.");
  return ctx;
}

/** Para peças que aparecem dentro e fora da loja (cabeçalho). */
export function useOptionalCart(): CartContextValue | null {
  return useContext(CartContext);
}
