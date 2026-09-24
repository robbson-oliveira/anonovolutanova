"use client";

import { useEffect, useRef } from "react";
import { Button, Heading, IconArrowRight, IconClose, Text, cn } from "@ds/index";
import { FREE_SHIPPING_MIN_QTY } from "@content/product";
import { fromMinor } from "@/lib/commerce/store-api";
import { formatBRL } from "@/lib/format";
import { CartItemRow } from "./CartItemRow";
import { CouponForm } from "./CouponForm";
import { useCart } from "./CartProvider";

/** Gaveta do carrinho, pela direita. Fecha com Esc, no fundo ou no X. */
export function CartDrawer() {
  const { cart, count, busy, error, drawerOpen, closeDrawer, setQuantity } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    closeRef.current?.focus();
    const onKey = (ev: KeyboardEvent) => ev.key === "Escape" && closeDrawer();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  const minor = cart?.totals.currency_minor_unit ?? 2;
  const subtotal = fromMinor(cart?.totals.total_items, minor);
  const discount = fromMinor(cart?.totals.total_discount, minor);
  const missing = Math.max(0, FREE_SHIPPING_MIN_QTY - count);

  return (
    <div
      className={cn("fixed inset-0 z-50", drawerOpen ? "" : "pointer-events-none")}
      aria-hidden={!drawerOpen}
    >
      <div
        onClick={closeDrawer}
        className={cn(
          "absolute inset-0 bg-surface-inverse/50 transition-opacity [transition-duration:var(--duration-fast)]",
          drawerOpen ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho"
        className={cn(
          "absolute top-0 right-0 flex h-full w-full max-w-[420px] flex-col bg-surface shadow-float",
          "transition-transform [transition-duration:var(--duration-fast)]",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <Heading as="h2" level="card">
            Seu carrinho
          </Heading>
          <button
            ref={closeRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Fechar carrinho"
            className="grid size-10 cursor-pointer place-items-center text-xl text-text-strong"
          >
            <IconClose />
          </button>
        </header>

        {count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <Text tone="muted">Seu carrinho está vazio.</Text>
            <Button href="/comprar" size="md" shape="block" onClick={closeDrawer}>
              Escolher minha agenda
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
              {cart!.items.map((item) => (
                <CartItemRow
                  key={item.key}
                  item={item}
                  busy={busy}
                  onQuantity={(q) => void setQuantity(item.key, q)}
                />
              ))}
            </ul>

            <footer className="flex flex-col gap-4 border-t border-border px-6 py-5">
              <Text as="p" size="xs" tone={missing ? "muted" : "accent"} className="font-semibold" aria-live="polite">
                {missing ? `Faltam ${missing} para o frete grátis` : "Frete grátis neste pedido"}
              </Text>
              <CouponForm />
              {error ? (
                <Text size="xs" tone="accent" role="alert">
                  {error}
                </Text>
              ) : null}
              <div className="flex flex-col gap-1">
                {discount > 0 ? (
                  <div className="flex justify-between text-sm text-text">
                    <span>Desconto</span>
                    <span>− {formatBRL(discount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-base font-bold text-text-strong">
                  <span>Subtotal</span>
                  <span>{formatBRL(subtotal - discount)}</span>
                </div>
                <Text size="xs" tone="muted">
                  O frete é calculado na próxima etapa.
                </Text>
              </div>
              <Button href="/checkout" size="lg" shape="block" aria-disabled={busy}>
                Finalizar compra
                <IconArrowRight />
              </Button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
