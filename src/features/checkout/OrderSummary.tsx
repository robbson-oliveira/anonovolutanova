"use client";

import { Heading, Text } from "@ds/index";
import { CartItemRow } from "@/features/cart/CartItemRow";
import { CouponForm } from "@/features/cart/CouponForm";
import { fromMinor, type StoreCart } from "@/lib/commerce/store-api";
import { formatBRL } from "@/lib/format";

/**
 * Resumo do pedido, ao lado do formulário (embaixo, no celular). Os valores
 * vêm do carrinho do WooCommerce; o desconto do Pix é uma estimativa com a
 * mesma regra que o plugin aplica ao pedido.
 */
export function OrderSummary({
  cart,
  busy,
  pixDiscount,
  shippingKnown,
}: {
  cart: StoreCart;
  busy: boolean;
  /** Desconto do Pix, quando Pix está escolhido e o gateway tem desconto. */
  pixDiscount: number;
  /** Já há um frete escolhido? Antes disso o total não inclui entrega. */
  shippingKnown: boolean;
}) {
  const minor = cart.totals.currency_minor_unit;
  const items = fromMinor(cart.totals.total_items, minor);
  const discount = fromMinor(cart.totals.total_discount, minor);
  const shipping = fromMinor(cart.totals.total_shipping, minor);
  const total = fromMinor(cart.totals.total_price, minor) - pixDiscount;

  return (
    <section aria-label="Resumo do pedido" className="flex flex-col gap-5 rounded-card bg-surface-plain p-6 shadow-card">
      <Heading as="h2" level="card">
        Resumo do pedido
      </Heading>
      <ul className="flex flex-col gap-4">
        {cart.items.map((item) => (
          <CartItemRow key={item.key} item={item} busy={busy} compact />
        ))}
      </ul>

      <CouponForm />

      <dl className="flex flex-col gap-2 border-t border-border pt-4 text-sm text-text">
        <div className="flex justify-between">
          <dt>Produtos</dt>
          <dd>{formatBRL(items)}</dd>
        </div>
        {discount > 0 ? (
          <div className="flex justify-between">
            <dt>Cupom</dt>
            <dd>− {formatBRL(discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt>Entrega</dt>
          <dd>{shippingKnown ? (shipping > 0 ? formatBRL(shipping) : "Grátis") : "A calcular"}</dd>
        </div>
        {pixDiscount > 0 ? (
          <div className="flex justify-between">
            <dt>Desconto no Pix</dt>
            <dd>− {formatBRL(pixDiscount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-border pt-3 text-base font-bold text-text-strong">
          <dt>Total</dt>
          <dd>{formatBRL(total)}</dd>
        </div>
      </dl>
      {!shippingKnown ? (
        <Text size="xs" tone="muted">
          O frete entra no total depois do endereço.
        </Text>
      ) : null}
    </section>
  );
}
