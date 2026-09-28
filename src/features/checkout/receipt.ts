/**
 * Order receipt: what the thank-you page shows about a finished order
 * (contact, delivery, items and totals). The Store API forgets the cart once
 * the order is placed and the bridge only answers the payment status, so the
 * checkout keeps this copy when it places the order.
 *
 * Kept in sessionStorage, like the checkout form: it has personal data, so it
 * goes away with the tab. It survives a 3DS redirect in the same tab. Without
 * it (another tab or device), the thank-you page falls back to the payment
 * status alone.
 */

import type { EditionId } from "@content/product";
import type { GatewayKind } from "@/lib/commerce/bridge-api";

export type OrderReceipt = {
  orderId: number;
  /** Checked against the URL token, so a stale receipt never shows on another order. */
  orderKey: string;
  /** ISO time the order was placed: start of the Pix countdown ring. */
  placedAt: string;
  contact: { firstName: string; name: string; company: string; phone: string; email: string };
  /** Who receives the agenda, when it is not the buyer (a gift). */
  recipient: string;
  address: string;
  shipping: { label: string; price: number } | null;
  payment: { kind: GatewayKind; label: string };
  items: Array<{ key: string; edition: EditionId | null; name: string; quantity: number; total: number }>;
  subtotal: number;
  coupon: number;
  paymentDiscount: number;
  total: number;
};

const key = (orderId: number) => `anln_order_${orderId}`;

export function saveReceipt(receipt: OrderReceipt): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key(receipt.orderId), JSON.stringify(receipt));
  } catch {
    // No storage: the thank-you page shows the payment status only.
  }
}

export function loadReceipt(orderId: number, orderKey: string): OrderReceipt | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key(orderId));
    if (!raw) return null;
    const receipt = JSON.parse(raw) as OrderReceipt;
    return receipt.orderKey === orderKey ? receipt : null;
  } catch {
    return null;
  }
}
