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
  {
    id: "color",
    label: "Edição Color",
    cover: "/img/capa-color.png",
    coverSize: { width: 1036, height: 1519 },
    description: "Capa em aquarela, com os patos à água.",
  },
  {
    id: "classica",
    label: "Edição Clássica",
    cover: "/img/capa-classica.png",
    coverSize: { width: 1085, height: 1519 },
    description: "Capa azul-marinho com detalhes em dourado.",
  },
] as const;

export type EditionId = (typeof EDITIONS)[number]["id"];

/** Regra comercial: frete grátis a partir desta quantidade de agendas. */
export const FREE_SHIPPING_MIN_QTY = 4;
export const SHIPPING_NOTICE = `Frete Grátis a partir de ${FREE_SHIPPING_MIN_QTY} unidades`;

/** Página de compra. Todos os CTAs de compra do site levam para cá. */
export const CHECKOUT_URL = "/comprar";

export const CONTACT = {
  whatsappNumber: "5527992794290",
  whatsappLabel: "+55 27 99279-4290",
  email: "contato@anonovolutanova.com.br",
  hours: "Segunda a sexta-feira, das 9h às 18h.",
} as const;

export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsappNumber}`;
export const INSTAGRAM_URL = "https://www.instagram.com/anonovolutanova";

/** Link do WhatsApp com a mensagem já escrita. */
export const whatsappUrlWith = (message: string) =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
