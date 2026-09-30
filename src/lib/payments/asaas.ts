import type { PaymentAdapter } from "./types";

/**
 * Asaas (plugin wc-asaas-store-api, which replaced woo-asaas with the same
 * gateway ids and field names). The card is not tokenized in the browser: the
 * plugin takes the fields in the Store API checkout and charges through the
 * Asaas API. With the old woo-asaas, the anln-storefront-bridge hands them to
 * the gateway instead (AsaasStoreApiCompat).
 *
 * The CPF/CNPJ goes in `extensions.anln_checkout`, not in the plugin's
 * `asaas/document` field, which the bridge turns off.
 *
 * The card number goes from the browser straight to WordPress over HTTPS,
 * the same path as the classic checkout. It never reaches the Next server.
 */
export const asaasAdapter: PaymentAdapter = {
  gatewayIds: ["asaas-pix", "asaas-credit-card", "asaas-ticket"],
  supportsCard: true,
  pixPaymentData: () => [],
  // Boleto (asaas-ticket): o plugin gera o boleto com o CPF/CNPJ da cobrança,
  // sem campos no checkout.
  plainPaymentData: () => [],
  cardPaymentData: async (card) => [
    { key: "asaas_cc_name", value: card.holderName.trim() },
    { key: "asaas_cc_number", value: card.number.replace(/\D/g, "") },
    { key: "asaas_cc_expiration_month", value: card.expMonth.padStart(2, "0") },
    { key: "asaas_cc_expiration_year", value: card.expYear },
    { key: "asaas_cc_security_code", value: card.cvv.replace(/\D/g, "") },
    { key: "asaas_cc_installments", value: String(card.installments) },
  ],
};
