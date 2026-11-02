"use client";

import { CouponForm } from "@/features/cart/CouponForm";
import { useCart } from "@/features/cart/CartProvider";
import { fromMinor } from "@/lib/commerce/store-api";
import { formatBRL } from "@/lib/format";

/**
 * Phones hide the sticky summary on the payment step so it does not cover
 * the pay button. This block sits above that button and keeps the applied
 * coupon, its discount and the total on screen. At `lg` and up the sidebar
 * summary stays the only one, so this root is `lg:hidden`.
 */
export function PaymentMobileSummary({ pixDiscount }: { pixDiscount: number }) {
  const { cart } = useCart();
  if (!cart) return null;

  const minor = cart.totals.currency_minor_unit;
  const coupon = fromMinor(cart.totals.total_discount, minor);
  // Same payable the "Pagar" button uses: cart total (coupon and shipping
  // already applied) minus the Pix discount, once that method is chosen.
  const total = fromMinor(cart.totals.total_price, minor) - pixDiscount;

  return (
    <section aria-label="Resumo do pedido" className="flex flex-col gap-4 rounded-card border border-border bg-surface-plain p-4 lg:hidden">
      <CouponForm />
      <dl className="flex flex-col gap-3 text-field text-text-muted">
        {coupon > 0 ? (
          <div className="flex justify-between gap-4">
            <dt>Cupom</dt>
            <dd className="text-action">−{formatBRL(coupon)}</dd>
          </div>
        ) : null}
        {pixDiscount > 0 ? (
          <div className="flex justify-between gap-4">
            <dt>Desconto por forma de pagamento</dt>
            <dd className="text-action">−{formatBRL(pixDiscount)}</dd>
          </div>
        ) : null}
        <div className="flex items-baseline justify-between gap-4 border-t border-border pt-3">
          <dt className="font-semibold text-text-strong">Total</dt>
          <dd className="text-h4 text-text-strong">{formatBRL(total)}</dd>
        </div>
      </dl>
    </section>
  );
}
