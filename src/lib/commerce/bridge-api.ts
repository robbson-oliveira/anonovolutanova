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
