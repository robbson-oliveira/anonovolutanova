"use client";

import { useEffect, useRef } from "react";
import { IconArrowLeft, IconCheck, Text } from "@ds/index";
import { OFFER } from "@content/offer";
import type { ProductOffer } from "@/lib/commerce/offer-types";
import { cartTrackItems } from "@/lib/tracking/cart-items";
import { item, trackAddToCart, trackViewCart, trackViewItem } from "@/lib/tracking/events";
import { PurchasePanel } from "@/features/purchase/PurchasePanel";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";
import { EditionLine } from "./EditionLine";
import { useCart } from "./CartProvider";

type CartPageProps = {
  offer: ProductOffer;
};

/**
 * The cart page (ANLN_PRECHECKOUT): the two editions on the left, each one
 * added and counted right there, and the order summary on the right, which
 * leads to the checkout.
 *
 * With the checkout off (or everything sold out) there is no cart to fill:
 * the page shows the landing page's purchase panel, which ends on WhatsApp.
 */
export function CartPage({ offer }: CartPageProps) {
  const cart = useCart();
  const editionIds = new Set(offer.editions.map((e) => e.productId));
  // Lines the editions do not cover (a cart from before the switch to simple
  // products, say) still show up, so they can be removed.
  const otherLines = cart.cart?.items.filter((i) => !editionIds.has(i.id)) ?? [];
  const selling = offer.checkoutEnabled && offer.editions.some((e) => e.inStock && e.productId);

  // view_item once per visit, view_cart once the cart has been read. The refs
  // keep Strict Mode (effects run twice in development) from sending twice.
  const viewed = useRef(false);
  useEffect(() => {
    if (viewed.current || !selling) return;
    viewed.current = true;
    trackViewItem(
      offer.editions.filter((e) => e.inStock).map((e) => item(e.productId ?? e.id, e.label, offer.price, 1)),
    );
  }, [offer, selling]);

  const viewedCart = useRef(false);
  useEffect(() => {
    if (viewedCart.current || !cart.ready || !cart.cart?.items.length) return;
    viewedCart.current = true;
    trackViewCart(cartTrackItems(cart.cart));
  }, [cart.ready, cart.cart]);

  if (!selling) {
    return (
      <div className="rounded-card border border-border bg-surface-plain p-5 shadow-subtle sm:p-8 lg:p-12">
        <PurchasePanel offer={offer} headingAs="h2" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-h4 text-text-strong">Escolha a sua edição</h2>
          <Text size="xs" tone="muted" className="leading-snug">
            Leve uma, ou uma de cada: as quantidades somam para o frete grátis.
          </Text>
        </div>

        <ul className="flex flex-col gap-4" aria-busy={!cart.ready}>
          {offer.editions.map((e) => {
            const line = cart.cart?.items.find((i) => i.id === e.productId) ?? null;
            return (
              <EditionLine
                key={e.id}
                edition={e}
                price={offer.price}
                line={line}
                busy={cart.busy || !cart.ready}
                onAdd={async () => {
                  if (!e.productId) return;
                  if (await cart.add(e.productId, 1)) trackAddToCart([item(e.productId, e.label, offer.price, 1)]);
                }}
                onQuantity={(quantity) => {
                  if (!line) return;
                  if (quantity > line.quantity && e.productId) {
                    trackAddToCart([item(e.productId, e.label, offer.price, quantity - line.quantity)]);
                  }
                  void cart.setQuantity(line.key, quantity);
                }}
              />
            );
          })}
        </ul>

        {otherLines.length ? (
          <ul className="flex flex-col gap-4 rounded-card border border-border bg-surface-plain p-4 sm:p-5">
            {otherLines.map((line) => (
              <CartItemRow key={line.key} item={line} busy={cart.busy} onQuantity={(q) => void cart.setQuantity(line.key, q)} />
            ))}
          </ul>
        ) : null}

        {/* <a>, not <Link>: the proxy decides what "/" serves. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="flex w-fit items-center gap-2 text-field text-text-muted hover:text-text-strong">
          <IconArrowLeft />
          Voltar ao site
        </a>

        <div className="flex flex-col gap-4 border-t border-border pt-6">
          <p className="text-field font-bold text-text-strong">{OFFER.listTitle}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {OFFER.list.map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span aria-hidden className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-pill bg-action text-on-action">
                  <IconCheck />
                </span>
                <span className="text-label leading-snug text-text">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <aside className="lg:sticky lg:top-8">
        <CartSummary offer={offer} />
      </aside>
    </div>
  );
}
