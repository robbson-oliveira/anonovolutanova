/**
 * Restores a cart opened on another device.
 *
 * The WhatsApp button lands on `/carrinho?rc=<token>`. The proxy removes `rc`
 * before any HTML is sent, so the token never sits in the address bar, the
 * referrer, or a GA4/pixel page view. While restore is enabled it keeps the
 * token in a short httpOnly cookie (path `/carrinho` only) and this module
 * exchanges it, on the server, for product ids and quantities. The browser
 * then merges those lines through the Store API, which is what prices them.
 */

export const RECOVERY_COOKIE = "anln_rc";
/** Survives the redirect and one read. Not a saved cart. */
export const RECOVERY_COOKIE_MAX_AGE = 120;

const TOKEN = /^[A-Za-z0-9]{32}$/;
const TOKEN_IN_PATH = /\/r\/[A-Za-z0-9]{32}(?=\/|$)/;

export type RecoveryItem = { id: number; quantity: number };

export type RecoveryOp =
  | { type: "add"; id: number; quantity: number }
  | { type: "update"; key: string; id: number; quantity: number };

type CartLine = { id: number; key: string; quantity: number };

export function isRecoveryToken(value: string): boolean {
  return TOKEN.test(value);
}

/**
 * Same address without `rc`. Null when the request had no such parameter,
 * including an empty one: any value in that parameter is a token and has to
 * leave the URL before the page is rendered.
 */
export function urlWithoutRecoveryToken(url: URL): URL | null {
  if (!url.searchParams.has("rc")) return null;
  const next = new URL(url.href);
  next.searchParams.delete("rc");
  return next;
}

/**
 * Drops a recovery token from a Referer. An unparseable value is discarded:
 * storing it could keep the token in the attribution cookie.
 */
export function scrubRecoveryReferrer(referrer: string | null): string | null {
  if (!referrer) return referrer;
  try {
    const url = new URL(referrer);
    url.searchParams.delete("rc");
    url.pathname = url.pathname.replace(TOKEN_IN_PATH, "/r/redacted");
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Ids and quantities only. Extra fields (a name, an email, a total) are
 * dropped, even if a response sends them.
 */
export function parseRecoveryItems(data: unknown): RecoveryItem[] | null {
  if (!data || typeof data !== "object") return null;
  const record = data as { ok?: unknown; items?: unknown };
  if (record.ok !== true || !Array.isArray(record.items)) return null;
  const items: RecoveryItem[] = [];
  for (const raw of record.items) {
    if (!raw || typeof raw !== "object") continue;
    const id = (raw as { id?: unknown }).id;
    const quantity = (raw as { quantity?: unknown }).quantity;
    if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) continue;
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity <= 0) continue;
    items.push({ id, quantity: Math.min(99, quantity) });
  }
  return items.length > 0 ? items : null;
}

/**
 * How to fold recovered lines into the cart the visitor already has.
 * Same product: keep the higher quantity. Anything else stays. Nothing is
 * removed, and a coupon is never part of the plan.
 */
export function planRecoveryMerge(current: CartLine[], recovered: RecoveryItem[]): RecoveryOp[] {
  const incoming = new Map<number, number>();
  for (const item of recovered) {
    if (!Number.isInteger(item.id) || item.id <= 0) continue;
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) continue;
    const quantity = Math.min(99, item.quantity);
    incoming.set(item.id, Math.max(incoming.get(item.id) ?? 0, quantity));
  }

  const ops: RecoveryOp[] = [];
  for (const [id, quantity] of incoming) {
    const lines = current.filter((line) => line.id === id);
    if (lines.length === 0) {
      ops.push({ type: "add", id, quantity });
      continue;
    }
    const highest = lines.reduce((best, line) => (line.quantity > best.quantity ? line : best));
    if (quantity > highest.quantity) ops.push({ type: "update", key: highest.key, id, quantity });
  }
  return ops;
}

/**
 * Server-side exchange. Network errors, 404 and 429 come back as null and
 * never throw. The token is not included in the failure.
 */
export async function fetchRecoveryItems(
  wpUrl: string,
  token: string,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 8000,
): Promise<RecoveryItem[] | null> {
  if (!isRecoveryToken(token)) return null;
  const endpoint = new URL(`${wpUrl.replace(/\/+$/, "")}/wp-json/anln/v1/carrinho/recuperar`);
  endpoint.searchParams.set("rc", token);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(endpoint, {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return parseRecoveryItems(await response.json().catch(() => null));
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
