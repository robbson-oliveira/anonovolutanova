/**
 * Cliente da Store API do WooCommerce (`/wp-json/wc/store/v1`), chamado direto
 * do navegador para o WordPress (admin.anonovolutanova.com.br).
 *
 * Portado de `camila-maehler-storefront/src/lib/store-api.ts`, sem PayPal e
 * sem nonce de login (o checkout aqui é só de visitante).
 *
 * `Cart-Token`: JWT opaco que o WooCommerce usa para identificar o carrinho e
 * autorizar mudanças nele — com um Cart-Token válido a Store API dispensa o
 * nonce. Vem no cabeçalho da resposta, é guardado no localStorage e devolvido
 * em toda chamada. É isso que mantém o carrinho entre domínios sem depender de
 * cookie de terceiros (Safari/iOS). O plugin anln-storefront-bridge expõe esse
 * cabeçalho no CORS.
 *
 * Token vencido: se a pessoa fica parada no checkout, a próxima mudança volta
 * `woocommerce_rest_missing_nonce` ANTES de executar. `request()` pega um
 * token novo com um GET /cart (que não exige nonce) e repete a chamada uma vez
 * — seguro porque ela não chegou a rodar.
 */

import { publicEnv } from "@/lib/env";

const BASE = `${publicEnv.wpUrl}/wp-json/wc/store/v1`;
const CART_TOKEN_KEY = "anln_cart_token";

function readCartToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CART_TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeCartToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(CART_TOKEN_KEY, token);
    else window.localStorage.removeItem(CART_TOKEN_KEY);
  } catch {
    // Sem storage (aba anônima): o próximo pedido abre um carrinho novo.
  }
}

export type StoreApiError = {
  code: string;
  message: string;
  status: number;
  /** Carrinho atualizado que o WooCommerce manda junto de alguns erros. */
  cart?: StoreCart;
};

export function isStoreApiError(value: unknown): value is StoreApiError {
  return Boolean(value && typeof value === "object" && "code" in value && "message" in value);
}

/** Mensagem legível de qualquer erro (a Store API lança objetos, não Error). */
export function errorMessage(err: unknown, fallback: string): string {
  if (isStoreApiError(err) && err.message.trim()) return stripTags(err.message);
  // fetch() sem resposta (rede caiu, ou o servidor quebrou sem CORS): o
  // navegador só diz "Failed to fetch", em inglês e sem ajudar ninguém.
  if (err instanceof TypeError) return "Não conseguimos falar com a loja. Confira sua conexão e tente de novo.";
  if (err instanceof Error && err.message.trim()) return err.message;
  return fallback;
}

const stripTags = (s: string) => s.replace(/<[^>]+>/g, "").trim();

export type StoreAddress = {
  first_name?: string;
  last_name?: string;
  company?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  email?: string;
  phone?: string;
};

export type StoreCartItem = {
  key: string;
  id: number;
  quantity: number;
  name: string;
  images: Array<{ id: number; src: string; thumbnail: string; alt: string }>;
  variation: Array<{ attribute: string; value: string }>;
  quantity_limits?: { minimum: number; maximum: number; multiple_of: number; editable: boolean };
  prices: { price: string; currency_minor_unit: number };
  totals: { line_subtotal: string; line_total: string; currency_minor_unit?: number };
};

export type StoreShippingRate = {
  rate_id: string;
  name: string;
  description: string;
  delivery_time?: { value: string; unit: string };
  method_id: string;
  price: string;
  selected: boolean;
};

export type StoreCart = {
  items: StoreCartItem[];
  items_count: number;
  coupons: Array<{ code: string; totals: { total_discount: string; currency_minor_unit: number } }>;
  shipping_rates: Array<{ package_id: number; shipping_rates: StoreShippingRate[] }>;
  shipping_address: StoreAddress;
  billing_address: StoreAddress;
  needs_shipping: boolean;
  payment_methods: string[];
  errors: Array<{ code: string; message: string }>;
  totals: {
    total_items: string;
    total_shipping: string | null;
    total_discount: string;
    total_fees: string;
    total_price: string;
    currency_code: string;
    currency_minor_unit: number;
  };
};

export type StoreCheckoutResponse = {
  order_id: number;
  status: string;
  order_key: string;
  payment_method: string;
  payment_result: {
    payment_status: "success" | "failure" | "pending" | "error";
    payment_details: Array<{ key: string; value: string }>;
    redirect_url: string;
  };
};

/** Valor da Store API (inteiro em centavos, como string) para reais. */
export function fromMinor(value: string | null | undefined, minorUnit = 2): number {
  return Number(value || "0") / 10 ** minorUnit;
}

const STALE_TOKEN_CODES = new Set([
  "woocommerce_rest_missing_nonce",
  "woocommerce_rest_invalid_nonce",
]);

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
  const method = options.method ?? "GET";

  // Primeira mudança sem token: o carrinho que ela criasse não seria achado
  // depois pelo Cart-Token devolvido (a sessão sem token não fica ligada a
  // ele — conferido no WooCommerce 11 do ambiente local). Um GET /cart antes
  // emite o token, e a mudança já vai com ele.
  if (method !== "GET" && !readCartToken()) {
    await request<StoreCart>("/cart");
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const cartToken = readCartToken();
  if (cartToken) headers["Cart-Token"] = cartToken;

  const response = await fetch(`${BASE}${path}`, {
    method,
    credentials: "include",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  // O WooCommerce renova o token a cada resposta, inclusive nas de erro.
  const refreshed = response.headers.get("Cart-Token");
  if (refreshed) writeCartToken(refreshed);

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const body = (data ?? {}) as { code?: unknown; message?: unknown; data?: { cart?: StoreCart } };
    const code = typeof body.code === "string" ? body.code : "store_api_error";

    if (!isRetry && method !== "GET" && STALE_TOKEN_CODES.has(code)) {
      await request<StoreCart>("/cart", {}, true).catch(() => undefined);
      return request<T>(path, options, true);
    }

    const err: StoreApiError = {
      code,
      message:
        typeof body.message === "string" ? body.message : `A loja não respondeu (${response.status}).`,
      status: response.status,
      cart: body.data?.cart,
    };
    throw err;
  }

  return data as T;
}

// ----- Carrinho -----

export const getCart = () => request<StoreCart>("/cart");

/** `id` é o da variação (edição): a Store API aceita a variação direto. */
export const addCartItem = (input: { id: number; quantity: number }) =>
  request<StoreCart>("/cart/add-item", { method: "POST", body: input });

export const updateCartItem = (input: { key: string; quantity: number }) =>
  request<StoreCart>("/cart/update-item", { method: "POST", body: input });

export const removeCartItem = (input: { key: string }) =>
  request<StoreCart>("/cart/remove-item", { method: "POST", body: input });

export const applyCoupon = (code: string) =>
  request<StoreCart>("/cart/apply-coupon", { method: "POST", body: { code } });

export const removeCoupon = (code: string) =>
  request<StoreCart>("/cart/remove-coupon", { method: "POST", body: { code } });

export const updateCustomer = (input: { billing_address?: StoreAddress; shipping_address?: StoreAddress }) =>
  request<StoreCart>("/cart/update-customer", { method: "POST", body: input });

export const selectShippingRate = (input: { package_id: number; rate_id: string }) =>
  request<StoreCart>("/cart/select-shipping-rate", { method: "POST", body: input });

// ----- Checkout -----

export const processCheckout = (input: {
  billing_address: StoreAddress;
  shipping_address: StoreAddress;
  payment_method: string;
  payment_data: Array<{ key: string; value: string }>;
  extensions?: Record<string, unknown>;
}) => request<StoreCheckoutResponse>("/checkout", { method: "POST", body: input });

/** Depois do pedido, o carrinho do WooCommerce já foi esvaziado: começa outro. */
export function forgetCartToken(): void {
  writeCartToken(null);
}
