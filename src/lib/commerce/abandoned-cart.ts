/** Wait after the last edit before telling the store. */
export const ABANDONED_CART_DEBOUNCE_MS = 1500;
/** Give up if the store does not answer. Never waited on by checkout. */
const ABANDONED_CART_TIMEOUT_MS = 8000;
const MAX_ITEMS = 20;

export type AbandonedCartItem = { id: number; quantity: number };

/** Body of `POST /wp-json/anln/v1/carrinho`. `consent` is only ever true. */
export type AbandonedCartBody = {
  name: string;
  email: string;
  phone: string;
  consent: true;
  /** Honeypot. Always empty. */
  website: "";
  items: AbandonedCartItem[];
  total: number;
};

export type AbandonedCartInput = {
  consent: boolean;
  /** A placed order is not an abandoned cart. */
  paid: boolean;
  name: string;
  email: string;
  /** E.164 from the phone field. */
  phoneE164: string;
  phoneValid: boolean;
  items: Array<{ id: number; quantity: number }>;
  /** Store API minor units (`totals.total_price`). */
  totalMinor?: string | number;
  minorUnit?: number;
};

/**
 * National Brazilian phone (DDD + number), or null. The recovery endpoint
 * rejects anything else, and a foreign number must not be stored for WhatsApp.
 */
export function brazilianRecoveryPhone(e164: string, valid: boolean): string | null {
  if (!valid || !e164.startsWith("+55")) return null;
  // Same national form the checkout already sends to WooCommerce (DDD + number).
  const national = e164.replace(/\D/g, "").slice(2);
  if (national.length !== 10 && national.length !== 11) return null;
  return national;
}

/**
 * The body to send, or null when this cart must not be stored: no opt-in,
 * empty cart, paid order, phone that is not Brazilian, or more than 20 lines.
 */
export function buildAbandonedCartBody(input: AbandonedCartInput): AbandonedCartBody | null {
  if (!input.consent || input.paid) return null;
  const phone = brazilianRecoveryPhone(input.phoneE164, input.phoneValid);
  if (!phone) return null;
  const items = input.items.filter(
    (item) => Number.isInteger(item.id) && item.id > 0 && Number.isInteger(item.quantity) && item.quantity > 0,
  );
  if (items.length === 0 || items.length > MAX_ITEMS) return null;
  const minor = input.minorUnit ?? 2;
  const raw = Number(input.totalMinor ?? 0);
  if (!Number.isFinite(raw) || raw < 0) return null;
  return {
    name: input.name.trim(),
    email: input.email.trim(),
    phone,
    consent: true,
    website: "",
    items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
    total: raw / 10 ** minor,
  };
}

export function abandonedCartKey(body: AbandonedCartBody): string {
  return JSON.stringify(body);
}

export type AbandonedCartResult = "ok" | "failed" | "skipped";

/**
 * POST the cart. Network errors, HTTP errors and timeouts come back as
 * `"failed"` and never throw. The same body is not sent twice (`seen`).
 * A failure is forgotten so a later edit can try again.
 */
export async function postAbandonedCart(
  wpUrl: string,
  body: AbandonedCartBody,
  options: { fetch?: typeof fetch; seen?: Set<string>; timeoutMs?: number } = {},
): Promise<AbandonedCartResult> {
  const seen = options.seen;
  const key = abandonedCartKey(body);
  if (seen?.has(key)) return "skipped";
  seen?.add(key);
  const fetchImpl = options.fetch ?? fetch;
  const timeoutMs = options.timeoutMs ?? ABANDONED_CART_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(`${wpUrl.replace(/\/+$/, "")}/wp-json/anln/v1/carrinho`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: key,
      signal: controller.signal,
      keepalive: true,
    });
    if (!res.ok) {
      seen?.delete(key);
      return "failed";
    }
    return "ok";
  } catch {
    seen?.delete(key);
    return "failed";
  } finally {
    clearTimeout(timer);
  }
}
