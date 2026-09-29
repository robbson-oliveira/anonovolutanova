import type { PaymentAdapter } from "./types";

/**
 * Asaas (plugin woo-asaas). O cartão não é tokenizado no navegador: o plugin
 * recebe os campos no checkout e cobra pela API do Asaas. Os nomes são os do
 * formulário clássico do plugin; o anln-storefront-bridge os entrega ao
 * gateway (AsaasStoreApiCompat), porque a Store API manda JSON e o plugin lê
 * formulário.
 *
 * O número vai do navegador direto para o WordPress por HTTPS — o mesmo
 * caminho do checkout clássico. Nunca passa pelo servidor do Next.
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
