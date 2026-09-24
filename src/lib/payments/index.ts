import type { CheckoutConfig, CheckoutGateway } from "@/lib/commerce/bridge-api";
import { asaasAdapter } from "./asaas";
import { mercadoPagoAdapter } from "./mercadopago";
import type { PaymentAdapter } from "./types";

export type { CardInput, PaymentAdapter } from "./types";

const ADAPTERS: PaymentAdapter[] = [asaasAdapter, mercadoPagoAdapter];

export function adapterFor(gatewayId: string): PaymentAdapter | null {
  return ADAPTERS.find((a) => a.gatewayIds.includes(gatewayId)) ?? null;
}

export type PaymentOption = {
  kind: "pix" | "card";
  gateway: CheckoutGateway;
  adapter: PaymentAdapter;
};

/**
 * As formas de pagamento que o checkout oferece: Pix e cartão, cada uma só se
 * houver um gateway ativo daquele tipo no WooCommerce E um adaptador que saiba
 * montá-la. O WooCommerce decide o que está ativo; o site só não mostra o que
 * ainda não sabe cobrar.
 */
export function paymentOptions(config: CheckoutConfig | null): PaymentOption[] {
  if (!config) return [];
  const out: PaymentOption[] = [];
  for (const kind of ["pix", "card"] as const) {
    for (const gateway of config.gateways.filter((g) => g.kind === kind)) {
      const adapter = adapterFor(gateway.id);
      if (!adapter || (kind === "card" && !adapter.supportsCard)) continue;
      out.push({ kind, gateway, adapter });
      break;
    }
  }
  return out;
}

/** Desconto do gateway sobre uma base, na mesma regra que o plugin aplica ao pedido. */
export function gatewayDiscount(gateway: CheckoutGateway, base: number): number {
  const rule = gateway.discount_rule;
  if (!rule || base <= 0) return 0;
  if (rule.type === "fixed") return Math.min(Math.round(rule.amount * 100) / 100, base);
  return Math.round(base * rule.percent) / 100;
}
