import { EDITIONS, type EditionId } from "@content/product";

const normalize = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/**
 * Qual edição um valor de atributo do WooCommerce representa.
 * "Color", "edicao-color" → color; "Clássica", "classica" → classica.
 */
export function editionFromAttribute(value: string): EditionId | null {
  const v = normalize(value);
  if (v.includes("color")) return "color";
  if (v.includes("classic")) return "classica";
  return null;
}

/**
 * The edition of a cart or order item, for its label and fallback cover. Each
 * edition is a simple product, and the cart only carries its name ("… —
 * Edição Color"); attributes still count first, for orders placed while the
 * product was variable. Unrecognized, the item shows its own name.
 */
export function editionOfCartItem(item: {
  variation: Array<{ attribute: string; value: string }>;
  name: string;
}) {
  const id =
    item.variation.map((v) => editionFromAttribute(v.value)).find(Boolean) ??
    editionFromAttribute(item.name);
  return EDITIONS.find((e) => e.id === id) ?? null;
}
