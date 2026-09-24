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

/** A edição de um item do carrinho, pelos atributos da variação. */
export function editionOfCartItem(item: {
  variation: Array<{ attribute: string; value: string }>;
  name: string;
}) {
  const id =
    item.variation.map((v) => editionFromAttribute(v.value)).find(Boolean) ??
    editionFromAttribute(item.name);
  return EDITIONS.find((e) => e.id === id) ?? null;
}
