/**
 * Contrato entre o checkout e cada plugin de pagamento do WooCommerce.
 *
 * O gateway ainda não foi escolhido (PLANO-MIGRACAO-NEXTJS.md, D3: Asaas ou
 * Mercado Pago). O checkout inteiro — contato, entrega, resumo, Pix na página
 * de obrigado — não depende dele. Só muda o que vai em `payment_data` no
 * `POST /wc/store/v1/checkout` e se há formulário de cartão. Cada gateway
 * implementa este contrato; quando D3 for decidido, o outro adaptador sai.
 */

export type CardInput = {
  holderName: string;
  number: string;
  /** "MM" */
  expMonth: string;
  /** "AAAA" */
  expYear: string;
  cvv: string;
  installments: number;
};

export type PaymentAdapter = {
  /** Ids de gateway do WooCommerce que este adaptador atende. */
  gatewayIds: readonly string[];
  /** O adaptador sabe montar o pagamento com cartão deste gateway? */
  supportsCard: boolean;
  /** `payment_data` para Pix (sem campos extras na maioria dos gateways). */
  pixPaymentData(): Array<{ key: string; value: string }>;
  /**
   * `payment_data` para cartão. Pode ser assíncrono: gateways que tokenizam no
   * navegador trocam o número do cartão por um token aqui.
   */
  cardPaymentData(card: CardInput): Promise<Array<{ key: string; value: string }>>;
  /**
   * `payment_data` de boleto e formas offline (depósito, cheque, na entrega),
   * que não pedem campos no checkout. Ausente = o adaptador não sabe montar
   * essas formas deste gateway, e o checkout não as oferece.
   */
  plainPaymentData?(): Array<{ key: string; value: string }>;
};
