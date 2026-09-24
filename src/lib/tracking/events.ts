/**
 * Eventos de e-commerce do GA4 no `dataLayer`. O site só publica eventos: quem
 * decide para onde vão (GA4, Meta, Google Ads) são as tags do GTM, que também
 * respeitam o consentimento (Consent Mode v2, negado até a pessoa aceitar).
 *
 * Nomes e formato: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

import { PRODUCT_NAME } from "@content/product";

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

function push(event: string, ecommerce: Ecommerce): void {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  // Limpa o objeto anterior: sem isso o GTM mistura itens de eventos seguidos.
  w.dataLayer.push({ ecommerce: null });
  w.dataLayer.push({ event, ecommerce });
}

const round = (n: number) => Math.round(n * 100) / 100;

export function item(variationId: number | string, editionLabel: string, price: number, quantity: number): TrackItem {
  return {
    item_id: String(variationId),
    item_name: PRODUCT_NAME,
    item_variant: editionLabel,
    price: round(price),
    quantity,
  };
}

const valueOf = (items: TrackItem[]) => round(items.reduce((s, i) => s + i.price * i.quantity, 0));

export const trackViewItem = (items: TrackItem[]) =>
  push("view_item", { currency: "BRL", value: valueOf(items), items });

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
