import type { CheckoutConfig, CheckoutGateway, GatewayKind } from "@/lib/commerce/bridge-api";
import { asaasAdapter } from "./asaas";
import { mercadoPagoAdapter } from "./mercadopago";
import { offlineAdapter } from "./offline";
import type { CardInput, PaymentAdapter } from "./types";

export type { CardInput, PaymentAdapter } from "./types";

const ADAPTERS: PaymentAdapter[] = [asaasAdapter, mercadoPagoAdapter, offlineAdapter];

/**
 * O adaptador de um gateway: pelo id; e, para um gateway `offline` de id
 * desconhecido (outro plugin de depósito, por exemplo), o offline — formas
 * offline não pedem campos, por definição do WooCommerce.
 */
export function adapterFor(gateway: Pick<CheckoutGateway, "id" | "kind">): PaymentAdapter | null {
  const byId = ADAPTERS.find((a) => a.gatewayIds.includes(gateway.id));
  if (byId) return byId;
  return gateway.kind === "offline" ? offlineAdapter : null;
}

export type PaymentOption = {
  kind: GatewayKind;
  gateway: CheckoutGateway;
  adapter: PaymentAdapter;
};

/** O adaptador sabe montar o `payment_data` deste tipo de gateway? */
function canBuild(adapter: PaymentAdapter, kind: GatewayKind): boolean {
  switch (kind) {
    case "pix":
      return true;
    case "card":
      return adapter.supportsCard;
    case "boleto":
    case "offline":
      return typeof adapter.plainPaymentData === "function";
    default:
      // Carteiras (Google Pay, Apple Pay…) exigem SDK próprio: nenhum adaptador ainda.
      return false;
  }
}

/**
 * As formas de pagamento que o checkout oferece, na ordem do WooCommerce: os
 * gateways ativos (config do anln-storefront-bridge) que a Store API também
 * aceita para este carrinho (`payment_methods`) E que um adaptador daqui sabe
 * montar. O WooCommerce decide o que está ativo; o site só não mostra o que
 * ainda não sabe cobrar, nem o que o WooCommerce recusaria no pedido.
 *
 * `cartMethods` ausente (carrinho ainda sem a lista) não filtra nada.
 */
export function paymentOptions(
  config: CheckoutConfig | null,
  cartMethods?: readonly string[] | null,
): PaymentOption[] {
  if (!config) return [];
  const out: PaymentOption[] = [];
  for (const gateway of config.gateways) {
    if (cartMethods && !cartMethods.includes(gateway.id)) continue;
    const adapter = adapterFor(gateway);
    if (!adapter || !canBuild(adapter, gateway.kind)) continue;
    out.push({ kind: gateway.kind, gateway, adapter });
  }
  return out;
}

/** `payment_data` do `POST /checkout` para a forma escolhida. */
export async function paymentDataFor(
  option: PaymentOption,
  card: CardInput,
): Promise<Array<{ key: string; value: string }>> {
  if (option.kind === "card") return option.adapter.cardPaymentData(card);
  if (option.kind === "pix") return option.adapter.pixPaymentData();
  return option.adapter.plainPaymentData?.() ?? [];
}

/** Desconto do gateway sobre uma base, na mesma regra que o plugin aplica ao pedido. */
export function gatewayDiscount(gateway: CheckoutGateway, base: number): number {
  const rule = gateway.discount_rule;
  if (!rule || base <= 0) return 0;
  if (rule.type === "fixed") return Math.min(Math.round(rule.amount * 100) / 100, base);
  return Math.round(base * rule.percent) / 100;
}
