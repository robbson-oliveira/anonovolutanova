/**
 * WooCommerce id of the classic agenda (SKU ANLN-2027-CLAS). The catalog
 * stays in WooCommerce; this only recognizes a line already in the cart.
 */
export const CLASSIC_PRODUCT_ID = 6419;

const fold = (value: string) => value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export type StockFlags = {
  /** Store API. False for the classic product while it is out of stock. */
  is_in_stock?: boolean;
  /**
   * Still true for an out-of-stock simple product. Not enough, on its own,
   * to offer the edition.
   */
  is_purchasable?: boolean;
};

/**
 * Whether a Store API product can be added. `is_purchasable` stays true
 * when stock status is `outofstock` and backorders are off (classic 6419).
 */
export function productInStock(product: StockFlags | null | undefined): boolean {
  return product?.is_in_stock === true;
}

type CartIdentity = {
  id: number;
  name: string;
  variation?: Array<{ attribute: string; value: string }>;
};

/** A cart line for the classic edition, by id or by the name WooCommerce sends. */
export function isClassicCartItem(item: CartIdentity): boolean {
  if (item.id === CLASSIC_PRODUCT_ID) return true;
  const label = [item.name, ...(item.variation ?? []).map((entry) => entry.value)].join(" ");
  // "color" does not contain "classic", so the Color edition is left alone.
  return fold(label).includes("classic");
}

export const CLASSIC_CART_NOTICE =
  "A Edição Clássica está esgotada. Remova essa edição do carrinho para continuar. A Edição Color continua disponível.";

export function cartBlockedByClassic(items: CartIdentity[] | null | undefined): boolean {
  return (items ?? []).some(isClassicCartItem);
}
