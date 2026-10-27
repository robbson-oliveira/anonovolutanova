import { editionOfCartItem } from "@/lib/commerce/editions";

/**
 * Gift wrap is drawn in the cart drawer. It does not change the line price.
 * When `GIFT_WRAP_AFFECTS_ORDER` is on, the checked lines are stored and
 * sent as the WooCommerce order customer note at checkout.
 *
 * The "Finalizar compra" control is a full page load, so the choice cannot
 * live only in component state: it is kept in localStorage until the order
 * is placed.
 */
export const SHOW_GIFT_WRAP = true;
export const GIFT_WRAP_AFFECTS_ORDER = true;

const STORAGE_KEY = "anln_gift_wrap";

const PLANNER_SINGULAR = "Planner Diário";
const PLANNER_PLURAL = "Planners Diários";

type GiftWrapCartItem = {
  id: number;
  quantity: number;
  name: string;
  variation: Array<{ attribute: string; value: string }>;
};

function plain(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function isPlanner(name: string) {
  return plain(name).includes("planner");
}

/** First word only, so the rest of the name stays as written. */
function pluralizeLeading(name: string) {
  const [first, ...rest] = name.split(" ");
  if (!first || /s$/i.test(first)) return name;
  return [`${first}s`, ...rest].join(" ");
}

/**
 * How one gift-wrapped line is spoken. Agendas use the edition label
 * ("1 agenda Edição Color"). The planner keeps the product name, pluralized.
 * Anything else uses its own name, with the first word in the plural.
 */
function giftWrapPhrase(item: GiftWrapCartItem): string | null {
  if (!Number.isFinite(item.quantity) || item.quantity < 1) return null;
  const quantity = Math.trunc(item.quantity);
  const edition = editionOfCartItem(item);

  if (edition?.unit === "agenda") {
    const noun = quantity === 1 ? "agenda" : "agendas";
    return `${quantity} ${noun} ${edition.label}`;
  }

  if (isPlanner(item.name) || (edition ? isPlanner(edition.label) : false)) {
    return `${quantity} ${quantity === 1 ? PLANNER_SINGULAR : PLANNER_PLURAL}`;
  }

  const label = (edition?.label || item.name).trim();
  if (!label) return null;
  const name = quantity === 1 ? label : pluralizeLeading(label);
  return `${quantity} ${name}`;
}

function giftWrapLine(item: GiftWrapCartItem): string | null {
  const phrase = giftWrapPhrase(item);
  return phrase ? `Embalar para presente: ${phrase}` : null;
}

/**
 * Product ids the customer marked for gift wrap. Empty when storage is
 * unavailable (server render, private mode).
 */
export function readGiftWrapIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is number => typeof id === "number" && Number.isInteger(id) && id > 0);
  } catch {
    return [];
  }
}

/** Persists the selection. An empty list removes the key. */
export function writeGiftWrapIds(ids: readonly number[]): void {
  if (typeof window === "undefined") return;
  try {
    if (ids.length === 0) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage blocked: the choice lasts only until this page unloads.
  }
}

/**
 * `customer_note` for Store API checkout. Gift-wrap lines go after whatever
 * the customer typed, one line per item, in cart order. Empty when there is
 * nothing to send.
 *
 * `selectedProductIds` defaults to what is stored. Pass it explicitly to
 * build the note from a known set (the checkout reads storage at submit,
 * which is already written by the time the customer leaves the cart).
 */
export function orderCustomerNote(
  items: readonly GiftWrapCartItem[],
  typedNote = "",
  selectedProductIds: readonly number[] = readGiftWrapIds(),
): string {
  const own = typedNote.trim();
  if (!GIFT_WRAP_AFFECTS_ORDER) return own;

  const selected = new Set(selectedProductIds);
  const lines = items.flatMap((item) => {
    if (!selected.has(item.id)) return [];
    const line = giftWrapLine(item);
    return line ? [line] : [];
  });
  const gift = lines.join("\n");
  if (!own) return gift;
  if (!gift) return own;
  return `${own}\n${gift}`;
}
