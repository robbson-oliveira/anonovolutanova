/**
 * Cliente do plugin anln-storefront-bridge (`/wp-json/anln-storefront/v1`).
 * Chamado do navegador, como a Store API.
 */

import { publicEnv } from "@/lib/env";

const BASE = `${publicEnv.wpUrl}/wp-json/anln-storefront/v1`;

export type GatewayKind = "pix" | "card" | "boleto" | "wallet" | "offline";

export type CheckoutGateway = {
  id: string;
  kind: GatewayKind;
  title: string;
  description: string;
  /** Imagem do gateway no WooCommerce (`$gateway->icon`). Vazia em alguns plugins (woo-asaas). */
  icon_url?: string | null;
  supports_tokenization: boolean;
  publishable_key: string;
  installments: { max: number; interest_free_up_to: number; monthly_rate_percent: number } | null;
  discount_rule: { type: "percent"; percent: number } | { type: "fixed"; amount: number } | null;
};

export type CheckoutConfig = {
  gateways: CheckoutGateway[];
  cpf_required: boolean;
  birthdate_required: boolean;
  free_shipping_min_qty: number;
  currency: string;
};

/**
 * What WooCommerce's order-received page lists about the order (bridge 0.5.0+).
 * The Store API empties the cart once the order exists, so this is where the
 * thank-you page reads contact, delivery, items and totals from.
 */
export type OrderSummary = {
  number: string;
  /** ISO 8601 with the store's offset. */
  created_at: string;
  customer: { first_name: string; last_name: string; company: string; email: string; phone: string };
  shipping_address: {
    first_name: string;
    last_name: string;
    address_1: string;
    number: string;
    neighborhood: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
  };
  /** Null when nothing ships. */
  shipping: { method: string; total: number } | null;
  payment_method: { id: string; title: string };
  items: Array<{
    id: number;
    product_id: number;
    variation_id: number;
    name: string;
    quantity: number;
    /** Line value before coupons. */
    subtotal: number;
    total: number;
    /** Variation attributes, e.g. { name: "Edição", value: "Color" }. */
    attributes: Array<{ name: string; value: string }>;
    /** URL of the product's main image; "" without one (older bridges omit it). */
    image?: string;
  }>;
  /** Order fees; the payment-method discount is a negative one. */
  fees: Array<{ name: string; total: number }>;
  totals: { subtotal: number; discount: number; shipping: number; total: number; currency: string };
};

export type PaymentInstructions = {
  order_id: number;
  status: string;
  payment_status: "paid" | "failed" | "pending";
  paid: boolean;
  total: number;
  instructions:
    | {
        type: "pix";
        gateway_id: string;
        gateway_title: string;
        pix: { qr_code_base64: string; qr_code: string; expires_at: string };
      }
    | { type: "boleto"; gateway_id: string; gateway_title: string; boleto: { url: string } }
    | null;
  /** Missing on bridges older than 0.5.0. */
  order?: OrderSummary;
};

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: "application/json" } });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (data as { message?: string } | null)?.message;
    throw { code: "bridge_error", status: res.status, message: message || `A loja não respondeu (${res.status}).` };
  }
  return data as T;
}

export const getCheckoutConfig = () => get<CheckoutConfig>("/checkout/config");

export const getPaymentInstructions = (orderId: number, orderKey: string) =>
  get<PaymentInstructions>(
    `/checkout/payment-instructions?order_id=${encodeURIComponent(orderId)}&order_key=${encodeURIComponent(orderKey)}`,
  );
