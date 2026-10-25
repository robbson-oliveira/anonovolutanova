import { editionOfCartItem } from "@/lib/commerce/editions";

const PLANNER_NAME = "planner diario e semanal";

function plain(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

type CartNameItem = {
  variation: Array<{ attribute: string; value: string }>;
  name: string;
};

/**
 * Label drawn on a cart line. The store product keeps its full name;
 * only this display shortens "Planner Diário e Semanal" so the row
 * stays on one line.
 */
export function cartLineTitle(item: CartNameItem): string {
  const edition = editionOfCartItem(item);
  if (edition) return edition.label;
  if (plain(item.name).includes(PLANNER_NAME)) return "Planner";
  return item.name;
}
