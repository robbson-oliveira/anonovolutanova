import type { PaymentAdapter } from "./types";

/**
 * Mercado Pago (plugin oficial woocommerce-mercadopago).
 *
 * Pix não pede campos: o plugin gera o QR, e o anln-storefront-bridge o lê
 * para a página de obrigado. O cartão exige tokenizar no navegador com o SDK
 * MercadoPago.js (a chave pública vem em `checkout/config`) e mandar o token
 * nos campos que o checkout de blocos do plugin espera. Isso só vale a pena
 * escrever se o Mercado Pago for o escolhido em D3 — por isso `supportsCard`
 * é falso e o checkout não oferece cartão com este gateway por enquanto. O
 * storefront da Camila tem um ponto de partida em `lib/payments/tokenize-card.ts`.
 *
 * O boleto (woo-mercado-pago-ticket) pede a escolha do emissor e o documento
 * em campos próprios; sem `plainPaymentData`, o checkout não o oferece.
 */
export const mercadoPagoAdapter: PaymentAdapter = {
  gatewayIds: ["woo-mercado-pago-pix", "woo-mercado-pago-custom", "woo-mercado-pago-ticket"],
  supportsCard: false,
  pixPaymentData: () => [],
  cardPaymentData: async () => {
    throw new Error("Pagamento com cartão pelo Mercado Pago ainda não está disponível.");
  },
};
