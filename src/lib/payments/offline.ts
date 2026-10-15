import type { PaymentAdapter } from "./types";

/**
 * Formas offline do próprio WooCommerce: transferência (bacs), cheque e
 * pagamento na entrega (cod). Não pedem campos no checkout — o pedido fica
 * aguardando e as instruções vêm na descrição do gateway e no e-mail. O
 * checkout também usa este adaptador para qualquer gateway que o
 * anln-storefront-bridge classifique como `offline` (ver `adapterFor`).
 */
export const offlineAdapter: PaymentAdapter = {
  gatewayIds: ["bacs", "cheque", "cod"],
  supportsCard: false,
  pixPaymentData: () => [],
  plainPaymentData: () => [],
  cardPaymentData: async () => {
    throw new Error("Esta forma de pagamento não aceita cartão.");
  },
};
