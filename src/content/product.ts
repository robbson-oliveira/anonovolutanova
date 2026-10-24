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
    coverSize: { width: 514, height: 634 },
    /** Where the book itself sits in the file; the rest is drop shadow. */
    coverBox: { x: 9, y: 11, width: 358, height: 463 },
    // The last two words stay with "patos" so "à água." cannot sit alone
    // on the edition card. The chunk is short enough to fit the card.
    description: "Capa em aquarela, com os patos\u00A0à\u00A0água.",
    agenda: true,
    unit: "agenda",
  },
  {
    id: "classica",
    label: "Edição Clássica",
    cover: "/img/capa-classica.webp",
    coverSize: { width: 472, height: 600 },
    coverBox: { x: 21, y: 16, width: 344, height: 464 },
    description: "Capa azul-marinho com detalhes em\u00A0dourado.",
    agenda: true,
    unit: "agenda",
  },
  {
    id: "bloco",
    label: "Bloco de Notas Color",
    cover: "/img/bloco-notas-color.webp",
    coverSize: { width: 1036, height: 764 },
    coverBox: { x: 79, y: 111, width: 718, height: 454 },
    description: "20 Unidades",
    agenda: false,
    unit: "bloco",
  },
] as const;

/** The two agenda editions: what the cover explorer and the free-shipping count refer to. */
export const AGENDA_EDITIONS = EDITIONS.filter((e) => e.agenda);

export type EditionId = (typeof EDITIONS)[number]["id"];

/** Regra comercial: frete grátis a partir desta quantidade de agendas. */
export const FREE_SHIPPING_MIN_QTY = 4;
export const SHIPPING_NOTICE = `Frete Grátis a partir de ${FREE_SHIPPING_MIN_QTY} unidades`;

/**
 * Seção de produto da home. Todos os CTAs de compra do site levam para cá: na
 * home só rolam até ela; nas outras páginas voltam para a home já nela.
 */
export const BUY_URL = "/#oferta";

/**
 * Mesmo destino, só o hash: nas seções da home o link rola na própria página.
 * Com "/#oferta" o navegador recarrega quando a home está em outro endereço
 * (ex.: /home-dev), vai ao topo e só depois desce.
 */
export const OFFER_ANCHOR = "#oferta";

/**
 * Where the store flow sends someone back to choose an edition (empty cart,
 * "voltar" in the checkout). With ANLN_PRECHECKOUT it is the cart page;
 * without it the proxy redirects this address to BUY_URL, so the links can
 * point here either way.
 */
export const CART_URL = "/carrinho";

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
