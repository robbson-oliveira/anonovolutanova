/**
 * GA4 ecommerce events on `dataLayer`. The site only publishes events; GTM
 * tags decide where they go (GA4, Meta, Google Ads) and honor Consent Mode v2.
 *
 * Names and shape: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 *
 * The Meta base tag listens only for `anln_consent_granted`, so events that
 * fire before the banner click never reach the pixel. Until marketing consent
 * is stored, a copy of the Meta-relevant events sits in memory and
 * sessionStorage and is replayed as `meta_replay` (a name the GA4 triggers do
 * not match). After a grant, nothing is queued.
 */

import { PRODUCT_NAME } from "@content/product";
import { captureMetaIds } from "@/lib/attribution";
import { CONSENT_STORAGE_KEY } from "@/lib/tracking/gtm";

export type TrackItem = {
  /** Id da variação no WooCommerce (a edição). */
  item_id: string;
  item_name: string;
  item_variant: string;
  price: number;
  quantity: number;
};

type Ecommerce = {
  currency: "BRL";
  value: number;
  items: TrackItem[];
  coupon?: string;
  shipping_tier?: string;
  payment_type?: string;
  transaction_id?: string;
  shipping?: number;
};

type DataLayerWindow = Window & { dataLayer?: unknown[] };

type DataLayer = unknown[] & {
  push: (...args: unknown[]) => number;
};

/** Events the Meta pixel maps. `view_cart` stays GA4-only. */
const META_EVENTS = new Set([
  "view_item",
  "add_to_cart",
  "begin_checkout",
  "add_shipping_info",
  "add_payment_info",
  "purchase",
]);

const QUEUE_KEY = "anln_meta_queue";
const QUEUE_CAP = 30;
const QUEUE_TTL_MS = 30 * 60 * 1000;
const HOOK = Symbol.for("anln.metaQueueHook");

type QueuedMetaEvent = {
  event: string;
  event_id: string;
  ecommerce: Ecommerce;
  at: number;
};

let memoryQueue: QueuedMetaEvent[] | null = null;
let flushing = false;

function eventId(event: string, ecommerce: Ecommerce): string {
  if (event === "purchase" && ecommerce.transaction_id) return String(ecommerce.transaction_id);
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // Older webviews: fall through to the timestamp id.
  }
  return `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Marketing consent, matching the head snippet: the banner stores `"granted"`,
 * and a JSON payload counts only when `categories.marketing` is granted.
 */
function marketingGranted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw === "granted") return true;
    if (!raw || raw.charAt(0) !== "{") return false;
    const cats = (JSON.parse(raw) as { categories?: { marketing?: unknown } }).categories;
    const mark = cats?.marketing;
    return mark === true || mark === "granted";
  } catch {
    return false;
  }
}

function fresh(items: QueuedMetaEvent[], now = Date.now()): QueuedMetaEvent[] {
  return items.filter((item) => Number.isFinite(item.at) && now - item.at < QUEUE_TTL_MS).slice(-QUEUE_CAP);
}

function readQueue(): QueuedMetaEvent[] {
  if (memoryQueue) return fresh(memoryQueue);
  try {
    const raw = window.sessionStorage.getItem(QUEUE_KEY);
    const parsed = raw ? (JSON.parse(raw) as QueuedMetaEvent[]) : [];
    memoryQueue = fresh(Array.isArray(parsed) ? parsed : []);
  } catch {
    memoryQueue = [];
  }
  return memoryQueue;
}

function writeQueue(items: QueuedMetaEvent[]): void {
  memoryQueue = fresh(items);
  try {
    if (memoryQueue.length === 0) window.sessionStorage.removeItem(QUEUE_KEY);
    else window.sessionStorage.setItem(QUEUE_KEY, JSON.stringify(memoryQueue));
  } catch {
    // Private mode: the in-memory copy still replays on this page.
  }
}

function enqueue(event: string, event_id: string, ecommerce: Ecommerce): void {
  const items = readQueue();
  items.push({
    event,
    event_id,
    ecommerce: { ...ecommerce, items: ecommerce.items.map((item) => ({ ...item })) },
    at: Date.now(),
  });
  writeQueue(items);
}

function clearQueue(): void {
  memoryQueue = [];
  try {
    window.sessionStorage.removeItem(QUEUE_KEY);
  } catch {
    // The memory copy is already empty.
  }
}

function dataLayer(): DataLayer {
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  return w.dataLayer as DataLayer;
}

function flushQueue(): void {
  if (flushing) return;
  const items = readQueue();
  if (items.length === 0) return;
  flushing = true;
  // Clear before pushing so a re-entrant consent event cannot replay twice.
  clearQueue();
  const dl = dataLayer();
  for (const item of items) {
    dl.push({
      event: "meta_replay",
      original_event: item.event,
      event_id: item.event_id,
      ecommerce: item.ecommerce,
    });
  }
  flushing = false;
}

function observeConsent(args: unknown[]): void {
  if (flushing) return;
  for (const arg of args) {
    if (!arg || typeof arg !== "object") continue;
    const event = (arg as { event?: unknown }).event;
    if (event === "anln_consent_granted") flushQueue();
    else if (event === "anln_consent_denied") clearQueue();
  }
}

/**
 * GTM replaces `dataLayer.push` when it boots and does not keep a foreign
 * wrapper. Re-attach before the banner click (`pointerdown` fires first) and
 * whenever this module pushes, so the consent event is still visible.
 */
function ensureConsentHook(): void {
  if (typeof window === "undefined") return;
  const dl = dataLayer();
  const current = dl.push;
  if ((current as { [HOOK]?: boolean })[HOOK]) return;
  const wrapped = function (this: unknown, ...args: unknown[]) {
    const result = current.apply(dl, args);
    observeConsent(args);
    return result;
  };
  (wrapped as { [HOOK]?: boolean })[HOOK] = true;
  dl.push = wrapped;
}

function installTracking(): void {
  if (typeof window === "undefined") return;
  ensureConsentHook();
  // The head snippet pushes `anln_consent_granted` before this bundle loads.
  if (marketingGranted()) flushQueue();
  window.addEventListener("pointerdown", ensureConsentHook, true);
  window.addEventListener("keydown", ensureConsentHook, true);
  captureMetaIds();
}

installTracking();

function push(event: string, ecommerce: Ecommerce): void {
  if (typeof window === "undefined") return;
  ensureConsentHook();
  const event_id = eventId(event, ecommerce);
  const dl = dataLayer();
  // Clear the previous object: without this, GTM mixes items across events.
  dl.push({ ecommerce: null });
  dl.push({ event, ecommerce, event_id });
  if (META_EVENTS.has(event) && !marketingGranted()) enqueue(event, event_id, ecommerce);
}

const round = (n: number) => Math.round(n * 100) / 100;

export function item(productId: number | string, editionLabel: string, price: number, quantity: number): TrackItem {
  return {
    item_id: String(productId),
    item_name: PRODUCT_NAME,
    item_variant: editionLabel,
    price: round(price),
    quantity,
  };
}

const valueOf = (items: TrackItem[]) => round(items.reduce((s, i) => s + i.price * i.quantity, 0));

export const trackViewItem = (items: TrackItem[]) =>
  push("view_item", { currency: "BRL", value: valueOf(items), items });

export const trackViewCart = (items: TrackItem[]) =>
  push("view_cart", { currency: "BRL", value: valueOf(items), items });

export const trackAddToCart = (items: TrackItem[]) =>
  push("add_to_cart", { currency: "BRL", value: valueOf(items), items });

export const trackBeginCheckout = (items: TrackItem[], coupon?: string) =>
  push("begin_checkout", { currency: "BRL", value: valueOf(items), items, coupon });

export const trackAddShippingInfo = (items: TrackItem[], shippingTier: string, coupon?: string) =>
  push("add_shipping_info", { currency: "BRL", value: valueOf(items), items, shipping_tier: shippingTier, coupon });

export const trackAddPaymentInfo = (items: TrackItem[], paymentType: string, coupon?: string) =>
  push("add_payment_info", { currency: "BRL", value: valueOf(items), items, payment_type: paymentType, coupon });

// ----- Compra -----
// O `purchase` só sai quando o pagamento é confirmado (um Pix gerado e não
// pago não é venda), na página de obrigado. O carrinho já foi esvaziado
// então: o pedido é guardado no envio e lido lá.

export type PurchaseSnapshot = {
  transaction_id: string;
  value: number;
  shipping: number;
  coupon?: string;
  payment_type: string;
  items: TrackItem[];
};

const SNAPSHOT_KEY = (orderId: string | number) => `anln_pedido_${orderId}`;
const SENT_KEY = (orderId: string | number) => `anln_purchase_enviado_${orderId}`;

export function savePurchaseSnapshot(snapshot: PurchaseSnapshot): void {
  try {
    window.localStorage.setItem(SNAPSHOT_KEY(snapshot.transaction_id), JSON.stringify(snapshot));
  } catch {
    // Sem storage: a compra não vai para o dataLayer, o pedido segue normal.
  }
}

/** Envia o `purchase` uma vez por pedido (recarregar a página não duplica). */
export function trackPurchaseOnce(orderId: string | number): void {
  try {
    if (window.localStorage.getItem(SENT_KEY(orderId))) return;
    const raw = window.localStorage.getItem(SNAPSHOT_KEY(orderId));
    if (!raw) return;
    const s = JSON.parse(raw) as PurchaseSnapshot;
    push("purchase", {
      currency: "BRL",
      transaction_id: s.transaction_id,
      value: s.value,
      shipping: s.shipping,
      coupon: s.coupon,
      payment_type: s.payment_type,
      items: s.items,
    });
    window.localStorage.setItem(SENT_KEY(orderId), "1");
    window.localStorage.removeItem(SNAPSHOT_KEY(orderId));
  } catch {
    // idem
  }
}
