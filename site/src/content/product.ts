/**
 * Dados do produto do ciclo corrente.
 *
 * Uma constante só para o preço: na fase de protótipo ele aparecia em três
 * lugares e precisou ser trocado à mão nos três.
 */

export const CYCLE_YEAR = 2027;

export const PRODUCT_NAME = `Agenda Ano Novo, Luta Nova ${CYCLE_YEAR}`;

export const PRICE = {
  amount: 109.9,
  installments: 3,
  /** Valor da parcela, como divulgado. Não derivado — é o número que vai no ar. */
  installmentAmount: 36.63,
} as const;

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const priceLabel = BRL.format(PRICE.amount);
export const installmentLabel = `Ou ${PRICE.installments}x de ${BRL.format(
  PRICE.installmentAmount,
)}`;

export const EDITIONS = [
  { id: "color", label: "Edição Color" },
  { id: "classica", label: "Edição Clássica" },
] as const;

export const SHIPPING_NOTICE = "Frete Grátis a partir de 4 unidades";

export const CHECKOUT_URL = "#comprar";
export const WHATSAPP_URL = "#whatsapp";
export const INSTAGRAM_URL = "https://www.instagram.com/anonovolutanova";
