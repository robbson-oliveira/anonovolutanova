/**
 * Origem da visita (UTMs, referência) e cupom de afiliada vindos pela URL.
 *
 * Capturados no `proxy.ts` — que roda antes de qualquer rota, inclusive a home
 * (o wireframe, HTML puro, sem React) — e guardados em cookies de 30 dias. O
 * checkout lê os cookies e manda a origem no pedido (`extensions.anln_checkout
 * .attribution`), onde o anln-storefront-bridge grava os
 * `_wc_order_attribution_*` que a coluna "Origem" do WooCommerce usa.
 *
 * Regra de atribuição: último clique não direto. Uma visita digitada ou por
 * favorito não apaga a campanha que trouxe a pessoa antes.
 */

export const ATTRIBUTION_COOKIE = "anln_origem";
export const COUPON_COOKIE = "anln_cupom";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export type SourceType = "typein" | "organic" | "referral" | "utm";

export type Attribution = {
  source_type: SourceType;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  utm_id: string;
  session_entry: string;
  session_start_time: string;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id"] as const;

/** Identificadores de clique pago: marcam campanha mesmo sem UTM. */
const CLICK_IDS = ["gclid", "wbraid", "gbraid", "fbclid", "msclkid", "ttclid"];

const SEARCH_ENGINES = ["google.", "bing.", "yahoo.", "duckduckgo.", "ecosia.", "yandex.", "baidu."];

const clip = (s: string, max = 200) => s.slice(0, max);

/**
 * A origem desta requisição, ou `null` quando ela é direta (sem UTM, sem
 * clique pago, sem referência externa) e não deve sobrescrever nada.
 */
export function attributionFromRequest(url: URL, referrer: string | null, now = new Date()): Attribution | null {
  const params = url.searchParams;
  const utm = Object.fromEntries(UTM_KEYS.map((k) => [k, clip(params.get(k)?.trim() ?? "")])) as Record<
    (typeof UTM_KEYS)[number],
    string
  >;
  const clickId = CLICK_IDS.find((k) => params.get(k));

  let refHost = "";
  try {
    refHost = referrer ? new URL(referrer).hostname : "";
  } catch {
    refHost = "";
  }
  const external = refHost !== "" && !isOwnHost(refHost, url.hostname);

  let source_type: SourceType;
  if (utm.utm_source || clickId) source_type = "utm";
  else if (external && SEARCH_ENGINES.some((s) => refHost.includes(s))) source_type = "organic";
  else if (external) source_type = "referral";
  else return null;

  // Clique pago sem UTM: registra de onde veio para não virar "desconhecido".
  if (!utm.utm_source && clickId) {
    utm.utm_source = clickId === "fbclid" ? "facebook" : clickId === "ttclid" ? "tiktok" : clickId === "msclkid" ? "bing" : "google";
    utm.utm_medium = utm.utm_medium || "cpc";
  }

  return {
    source_type,
    referrer: external && referrer ? clip(referrer, 400) : "",
    ...utm,
    session_entry: clip(`${url.origin}${url.pathname}`, 400),
    session_start_time: now.toISOString().replace("T", " ").slice(0, 19),
  };
}

/** Mesmo site: o domínio da loja e o do WordPress (admin.). */
function isOwnHost(refHost: string, siteHost: string): boolean {
  const bare = (h: string) => h.replace(/^(www|admin)\./, "");
  return bare(refHost) === bare(siteHost);
}

/** Cupom vindo em `?cupom=`: só letras, números, hífen e sublinhado. */
export function couponFromUrl(url: URL): string | null {
  const raw = url.searchParams.get("cupom") ?? url.searchParams.get("coupon");
  if (!raw) return null;
  const code = raw.trim().toUpperCase();
  return /^[A-Z0-9_-]{2,40}$/.test(code) ? code : null;
}

// ----- Leitura no navegador -----

export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  if (!match) return null;
  try {
    return decodeURIComponent(match.slice(name.length + 1));
  } catch {
    return null;
  }
}

export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function deviceType(ua: string): "Mobile" | "Tablet" | "Desktop" {
  if (/iPad|Tablet|Nexus 7|Nexus 10|SM-T/i.test(ua)) return "Tablet";
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return "Mobile";
  return "Desktop";
}

/**
 * Atribuição para o pedido: a do cookie, ou "typein" quando a pessoa nunca
 * chegou por campanha ou link — mais o aparelho, lido na hora do checkout.
 */
export function orderAttribution(): Record<string, string> {
  let stored: Partial<Attribution> = {};
  try {
    stored = JSON.parse(readCookie(ATTRIBUTION_COOKIE) ?? "{}") as Partial<Attribution>;
  } catch {
    stored = {};
  }
  const ua = typeof navigator === "undefined" ? "" : navigator.userAgent;
  const base = stored.source_type ? stored : { source_type: "typein" as const };
  return Object.fromEntries(
    Object.entries({ ...base, device_type: deviceType(ua), user_agent: clip(ua, 400) }).filter(
      ([, v]) => typeof v === "string" && v !== "",
    ),
  ) as Record<string, string>;
}

// ----- Meta click ids -----
// The bridge schema does not accept fbp/fbc/fbclid yet. The Store API rejects
// unknown extension fields, so the checkout payload stays unchanged until
// this flag is turned on after the bridge update.

/** When false, fbp/fbc/fbclid are captured but never sent on checkout. */
export const ANLN_SEND_META_IDS = false;

const FBCLID_KEY = "anln_fbclid";
const FBC_KEY = "anln_fbc";

function readSession(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Private mode: the id is still returned for this call.
  }
}

export type MetaIds = { fbp?: string; fbc?: string; fbclid?: string };

/**
 * Reads `_fbp` and `_fbc`, and keeps `fbclid` from the landing URL for the
 * rest of the tab. Without an `_fbc` cookie, `fbc` is `fb.1.<ts>.<fbclid>`.
 */
export function captureMetaIds(): MetaIds {
  if (typeof window === "undefined") return {};
  const fbp = readCookie("_fbp") ?? undefined;
  const fbcCookie = readCookie("_fbc") ?? undefined;

  let fbclid = "";
  try {
    fbclid = new URL(window.location.href).searchParams.get("fbclid")?.trim() ?? "";
  } catch {
    fbclid = "";
  }
  if (fbclid) writeSession(FBCLID_KEY, fbclid);
  else fbclid = readSession(FBCLID_KEY) ?? "";

  let fbc = fbcCookie ?? "";
  if (!fbc && fbclid) {
    fbc = readSession(FBC_KEY) ?? "";
    if (!fbc || !fbc.endsWith(`.${fbclid}`)) {
      fbc = `fb.1.${Date.now()}.${fbclid}`;
      writeSession(FBC_KEY, fbc);
    }
  }

  return {
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
    ...(fbclid ? { fbclid } : {}),
  };
}

/** Checkout extension fields. Empty while `ANLN_SEND_META_IDS` is off. */
export function metaCheckoutFields(): Record<string, string> {
  const ids = captureMetaIds();
  if (!ANLN_SEND_META_IDS) return {};
  return Object.fromEntries(Object.entries(ids).filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1] !== ""));
}
