"use client";

import { Button, IconArrowRight, IconLock, IconTruck, Text } from "@ds/index";
import { SHIPPING_NOTICE } from "@content/product";
import type { ProductOffer } from "@/lib/commerce/offer-types";
import { fromMinor } from "@/lib/commerce/store-api";
import { formatBRL } from "@/lib/format";
import { ShippingEstimate } from "@/features/purchase/ShippingEstimate";
import { CouponForm } from "./CouponForm";
import { useCart } from "./CartProvider";

type CartSummaryProps = {
  offer: ProductOffer;
};

/**
 * Order summary of the cart page, as in the reference: subtotal, shipping,
 * coupon, total and the button to the checkout, with the reassurance lines
 * under it. Shipping is only quoted here (the checkout picks it with the
 * address); free shipping counts units, so the bar shows how many are
 * missing.
 */
export function CartSummary({ offer }: CartSummaryProps) {
  const { cart, count, busy, error } = useCart();

  const minor = cart?.totals.currency_minor_unit ?? 2;
  const subtotal = fromMinor(cart?.totals.total_items, minor);
  const discount = fromMinor(cart?.totals.total_discount, minor);
  const total = subtotal - discount;
  const minQty = offer.freeShippingMinQty;
  const missing = Math.max(0, minQty - count);
  const empty = count === 0;
  // The shipping quote is for one line: the cart's first product, with every
  // unit in the cart (the bridge prices the package by quantity).
  const quoteProduct = cart?.items[0]?.id ?? null;

  return (
    <section aria-labelledby="cart-summary-title" className="flex flex-col gap-5 rounded-card border border-border bg-surface-plain p-5 shadow-subtle sm:p-6">
      <h2 id="cart-summary-title" className="text-h4 text-text-strong">
        Resumo do pedido
      </h2>

      <dl className="flex flex-col gap-3 border-t border-border pt-5 text-field text-text-muted">
        <div className="flex justify-between gap-4">
          <dt>
            Subtotal ({count} {count === 1 ? "agenda" : "agendas"})
          </dt>
          <dd className="text-text-strong">{formatBRL(subtotal)}</dd>
        </div>
        {discount > 0 ? (
          <div className="flex justify-between gap-4">
            <dt>Cupom</dt>
            <dd className="text-action">−{formatBRL(discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt>Frete</dt>
          <dd className="text-right text-text-strong">{!empty && missing === 0 ? "Grátis" : "Calculado no checkout"}</dd>
        </div>
      </dl>

      {!empty ? (
        <div className="flex flex-col gap-2" aria-live="polite">
          <Text as="p" size="xs" tone={missing ? "muted" : "accent"} className="font-semibold">
            {missing
              ? `Faltam ${missing} ${missing === 1 ? "agenda" : "agendas"} para o frete grátis`
              : "Frete grátis neste pedido"}
          </Text>
          <div aria-hidden className="h-1.5 overflow-hidden rounded-pill bg-surface-muted">
            <div
              className="h-full rounded-pill bg-action transition-[width] [transition-duration:var(--duration-fast)]"
              style={{ width: `${Math.min(100, (count / minQty) * 100)}%` }}
            />
          </div>
        </div>
      ) : null}

      {!empty && quoteProduct ? <ShippingEstimate productId={quoteProduct} quantity={count} /> : null}

      {!empty ? <CouponForm /> : null}

      <div className="flex items-baseline justify-between gap-4 border-t border-border pt-5">
        <span className="text-h4 text-text-strong">Total</span>
        <span className="flex flex-col items-end gap-1">
          <span className="text-stat text-text-strong">{formatBRL(total)}</span>
          {!empty ? (
            <span className="text-fine text-text-muted">
              ou até {offer.installments.count}x de {formatBRL(total / offer.installments.count)}
            </span>
          ) : null}
        </span>
      </div>

      {error ? (
        <Text size="xs" tone="accent" role="alert">
          {error}
        </Text>
      ) : null}

      {empty ? (
        <Text size="xs" tone="muted" className="text-center leading-snug">
          Seu carrinho está vazio. Adicione uma edição para continuar.
        </Text>
      ) : (
        <Button href="/checkout" size="lg" shape="block" aria-disabled={busy} className="w-full">
          Finalizar compra
          <IconArrowRight />
        </Button>
      )}

      <ul className="flex flex-col gap-2 text-label text-text-muted">
        <li className="flex items-center gap-2">
          <IconLock className="shrink-0 text-accent" />
          Compra segura, com pagamento criptografado
        </li>
        <li className="flex items-center gap-2">
          <IconTruck className="shrink-0 text-accent" />
          {SHIPPING_NOTICE}
        </li>
      </ul>
    </section>
  );
}
