/**
 * Estimativa de frete da página de produto, pela rota pública do plugin
 * anln-storefront-bridge: `POST /wp-json/anln-storefront/v1/shipping/estimate`.
 *
 * Chamada direto do navegador, como a Store API, mas SEM cookie nem Cart-Token:
 * a estimativa não toca o carrinho. O corpo vai como formulário
 * (URLSearchParams) e não como JSON para a chamada continuar sendo uma
 * "simple request" do CORS — sem o preflight OPTIONS antes de cada consulta.
 *
 * Aqui também moram as chaves do localStorage que o checkout lê para abrir no
 * CEP e na forma de entrega que a pessoa já escolheu na página de produto.
 */

import { publicEnv } from "@/lib/env";
import { formatBRL } from "@/lib/format";
import { onlyDigits } from "@/lib/commerce/br";

const ENDPOINT = `${publicEnv.wpUrl}/wp-json/anln-storefront/v1/shipping/estimate`;

// ----- Contrato da rota -----

export type ShippingRate = {
  /** Id da taxa no WooCommerce (ex.: `flat_rate:1`). É o `rate_id` do checkout. */
  id: string;
  method_id: string;
  /** Nome da forma de entrega (ex.: "PAC", "SEDEX"). */
  label: string;
  /** Em reais (24.9), não em centavos. */
  cost: number;
  is_free: boolean;
  delivery: {
    /** Prazo em dias, ou nulo sem previsão. */
    days: number | null;
    /** Data prevista em `Y-m-d`, ou "" sem previsão. */
    date: string;
  };
};

export type FreeShippingStatus = {
  /** Quantidade mínima para o frete grátis (regra por unidades, não por valor). */
  min_qty: number;
  quantity: number;
  remaining: number;
  qualifies: boolean;
};

export type ShippingEstimate = {
  /** CEP com 8 dígitos. */
  postcode: string;
  /** UF do CEP (ex.: "PR"). */
  state: string;
  /** Da mais barata para a mais cara. */
  rates: ShippingRate[];
  free_shipping: FreeShippingStatus;
};

export type ShippingEstimateInput = {
  /** The edition's simple product. */
  productId: number;
  quantity: number;
  /** Com ou sem máscara: só os dígitos seguem. */
  postcode: string;
};

export type ShippingErrorCode =
  | "anln_invalid_postcode"
  | "anln_invalid_product"
  | "rate_limited"
  | "network"
  | "unknown";

const MESSAGES: Record<ShippingErrorCode, string> = {
  anln_invalid_postcode: "CEP inválido. Confira o número e tente de novo.",
  anln_invalid_product: "Não conseguimos calcular o frete desta edição agora. Tente de novo em instantes.",
  rate_limited: "Foram muitas consultas seguidas. Aguarde um instante e tente de novo.",
  network: "Não conseguimos calcular o frete agora. Confira sua conexão e tente de novo.",
  unknown: "Não conseguimos calcular o frete agora. Tente de novo em instantes.",
};

/**
 * Erro da estimativa, já com a mensagem em português para a tela. A mensagem
 * do WordPress não é usada: pode vir no idioma do painel.
 */
export class ShippingEstimateError extends Error {
  readonly code: ShippingErrorCode;
  readonly status: number;

  constructor(code: ShippingErrorCode, status = 0) {
    super(MESSAGES[code]);
    this.name = "ShippingEstimateError";
    this.code = code;
    this.status = status;
  }
}

export const isInvalidPostcodeError = (err: unknown) =>
  err instanceof ShippingEstimateError && err.code === "anln_invalid_postcode";

/** Mensagem legível de qualquer falha da estimativa. */
export function shippingErrorMessage(err: unknown): string {
  return err instanceof ShippingEstimateError ? err.message : MESSAGES.unknown;
}

// ----- Chamada -----

/**
 * Cota o frete de uma linha (edição + quantidade) para um CEP. `signal` deixa
 * quem chama cancelar a consulta anterior quando a linha muda; o cancelamento
 * sai como o `AbortError` do próprio fetch, sem virar ShippingEstimateError.
 */
export async function estimateShipping(
  input: ShippingEstimateInput,
  signal?: AbortSignal,
): Promise<ShippingEstimate> {
  const postcode = onlyDigits(input.postcode);
  if (postcode.length !== 8) throw new ShippingEstimateError("anln_invalid_postcode", 400);

  const body = new URLSearchParams({
    // The bridge's field keeps its name from the variable-product days; it
    // takes a simple product id just the same.
    variation_id: String(input.productId),
    quantity: String(Math.max(1, Math.floor(input.quantity) || 1)),
    postcode,
    country: "BR",
  });

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      // Só cabeçalhos "simples": nada de Content-Type JSON nem Cart-Token.
      headers: { Accept: "application/json" },
      body,
      credentials: "omit",
      signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    // Rede caiu, ou o WordPress quebrou sem os cabeçalhos de CORS.
    throw new ShippingEstimateError("network");
  }

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const code = (data as { code?: unknown } | null)?.code;
    if (res.status === 429) throw new ShippingEstimateError("rate_limited", 429);
    if (code === "anln_invalid_postcode" || code === "anln_invalid_product") {
      throw new ShippingEstimateError(code, res.status);
    }
    throw new ShippingEstimateError("unknown", res.status);
  }

  if (!data || typeof data !== "object") throw new ShippingEstimateError("unknown", res.status);
  return normalizeEstimate(data as Partial<ShippingEstimate>, postcode, input.quantity);
}

/** Defesa contra campos faltando: a rota está sendo construída em paralelo. */
function normalizeEstimate(
  data: Partial<ShippingEstimate>,
  postcode: string,
  quantity: number,
): ShippingEstimate {
  const rates = (Array.isArray(data.rates) ? data.rates : [])
    .filter((r): r is ShippingRate => Boolean(r && typeof r.id === "string"))
    .map((r) => {
      const cost = Number(r.cost) || 0;
      const days = Number(r.delivery?.days);
      return {
        id: r.id,
        method_id: typeof r.method_id === "string" ? r.method_id : "",
        label: typeof r.label === "string" && r.label.trim() ? r.label.trim() : "Entrega",
        cost,
        is_free: r.is_free === true || cost === 0,
        delivery: {
          days: Number.isFinite(days) && days > 0 ? days : null,
          date: typeof r.delivery?.date === "string" ? r.delivery.date : "",
        },
      };
    });

  const fs = data.free_shipping;
  const minQty = Number(fs?.min_qty) || 0;
  return {
    postcode: onlyDigits(data.postcode ?? "") || postcode,
    state: typeof data.state === "string" ? data.state : "",
    rates,
    free_shipping: {
      min_qty: minQty,
      quantity: Number(fs?.quantity) || quantity,
      remaining: Math.max(0, Number(fs?.remaining) || 0),
      qualifies: fs?.qualifies === true,
    },
  };
}

// ----- Apresentação -----

/**
 * `Y-m-d` como data LOCAL. `new Date("2026-10-05")` lê meia-noite UTC, que no
 * Brasil vira o dia 4.
 */
export function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

const DAY_MONTH = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long" });

/** "dia 5 de outubro", ou nulo quando a forma de entrega não tem previsão. */
export function deliveryDateLabel(rate: ShippingRate): string | null {
  const date = parseIsoDate(rate.delivery.date);
  return date ? `dia ${DAY_MONTH.format(date)}` : null;
}

/** "Grátis" ou "R$ 24,90". */
export const ratePriceLabel = (rate: ShippingRate) => (rate.is_free ? "Grátis" : formatBRL(rate.cost));

// ----- Preferências guardadas (lidas também pelo checkout) -----

/** CEP da última cotação que deu certo, só os 8 dígitos. */
export const CEP_STORAGE_KEY = "anln_cep";
/** Forma de entrega escolhida no modal: JSON `{ rateId, methodId }`. */
export const SHIPPING_RATE_STORAGE_KEY = "anln_shipping_rate";

export type ShippingRateChoice = { rateId: string; methodId: string };

const listeners = new Set<() => void>();

function readKey(key: string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function writeKey(key: string, value: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    // Sem storage (aba anônima, bloqueio do navegador): vale só nesta visita.
  }
  listeners.forEach((notify) => notify());
}

/**
 * Assinatura para `useSyncExternalStore`: avisa quando esta aba grava as
 * chaves e quando outra aba grava (evento `storage`).
 */
export function subscribeShippingStorage(notify: () => void): () => void {
  listeners.add(notify);
  const onStorage = (ev: StorageEvent) => {
    if (ev.key === null || ev.key === CEP_STORAGE_KEY || ev.key === SHIPPING_RATE_STORAGE_KEY) notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}

/** CEP guardado (8 dígitos) ou "". */
export function readStoredCep(): string {
  const digits = onlyDigits(readKey(CEP_STORAGE_KEY));
  return digits.length === 8 ? digits : "";
}

export function writeStoredCep(digits: string | null): void {
  const d = onlyDigits(digits ?? "");
  writeKey(CEP_STORAGE_KEY, d.length === 8 ? d : null);
}

/** Texto cru da escolha guardada — estável entre leituras, bom de snapshot. */
export const readStoredRateChoiceRaw = () => readKey(SHIPPING_RATE_STORAGE_KEY);

export function parseRateChoice(raw: string): ShippingRateChoice | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ShippingRateChoice> | null;
    if (parsed && typeof parsed.rateId === "string" && parsed.rateId) {
      return { rateId: parsed.rateId, methodId: typeof parsed.methodId === "string" ? parsed.methodId : "" };
    }
  } catch {
    // Valor corrompido: como se não houvesse escolha.
  }
  return null;
}

export function writeStoredRateChoice(choice: ShippingRateChoice): void {
  writeKey(SHIPPING_RATE_STORAGE_KEY, JSON.stringify(choice));
}

/**
 * Qual taxa representa a escolha da pessoa entre as oferecidas:
 *   1. o mesmo id, quando ele está na lista;
 *   2. a mais barata do mesmo método — quem escolheu SEDEX para um CEP quer
 *      SEDEX em outra região, onde a instância (e o id) muda;
 *   3. sem escolha que case: a mais barata (a rota já manda nessa ordem).
 */
export function resolveChosenRate(rates: ShippingRate[], choice: ShippingRateChoice | null): ShippingRate | null {
  if (!rates.length) return null;
  if (choice) {
    const exact = rates.find((r) => r.id === choice.rateId);
    if (exact) return exact;
    if (choice.methodId) {
      const sameMethod = rates
        .filter((r) => r.method_id === choice.methodId)
        .sort((a, b) => a.cost - b.cost)[0];
      if (sameMethod) return sameMethod;
    }
  }
  return rates[0];
}
