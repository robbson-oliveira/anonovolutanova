import { editionOfCartItem } from "@/lib/commerce/editions";
import { fromMinor, type StoreCart } from "@/lib/commerce/store-api";
import { item, type TrackItem } from "./events";

/** Itens do carrinho no formato GA4. */
export function cartTrackItems(cart: StoreCart | null): TrackItem[] {
  if (!cart) return [];
  return cart.items.map((i) =>
    item(
      i.id,
      editionOfCartItem(i)?.label ?? i.name,
      fromMinor(i.prices.price, i.prices.currency_minor_unit),
      i.quantity,
    ),
  );
}

/** Códigos de cupom do carrinho, para o parâmetro `coupon` do GA4. */
export const cartCoupon = (cart: StoreCart | null) =>
  cart?.coupons.map((c) => c.code.toUpperCase()).join(",") || undefined;
