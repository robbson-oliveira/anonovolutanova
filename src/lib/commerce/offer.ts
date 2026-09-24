import {
  CYCLE_YEAR,
  EDITIONS,
  FREE_SHIPPING_MIN_QTY,
  PRICE,
  PRODUCT_NAME,
  type EditionId,
} from "@content/product";

/**
 * O que a página de compra precisa saber sobre a oferta.
 *
 * Hoje sai de `src/content/product.ts`. Na Fase 4 (ver
 * PLANO-MIGRACAO-NEXTJS.md) passa a sair do produto variável 2027 no
 * WooCommerce — preço, estoque e o id de cada variação —, e só esta função
 * muda: a página e o painel de compra já consomem este formato.
 */
export type EditionOffer = {
  id: EditionId;
  label: string;
  cover: string;
  /** Dimensões intrínsecas do arquivo, para o next/image reservar o espaço. */
  coverSize: { width: number; height: number };
  description: string;
  inStock: boolean;
  /** Id da variação no WooCommerce. Nulo até o produto 2027 existir. */
  variationId: number | null;
};

export type ProductOffer = {
  name: string;
  year: number;
  price: number;
  installments: { count: number; amount: number };
  freeShippingMinQty: number;
  editions: EditionOffer[];
  /** Carrinho e checkout headless no ar? Até a Fase 4, não. */
  checkoutEnabled: boolean;
};

export async function getProductOffer(): Promise<ProductOffer> {
  return {
    name: PRODUCT_NAME,
    year: CYCLE_YEAR,
    price: PRICE.amount,
    installments: { count: PRICE.installments, amount: PRICE.installmentAmount },
    freeShippingMinQty: FREE_SHIPPING_MIN_QTY,
    editions: EDITIONS.map((e) => ({
      id: e.id,
      label: e.label,
      cover: e.cover,
      coverSize: e.coverSize,
      description: e.description,
      inStock: true,
      variationId: null,
    })),
    checkoutEnabled: false,
  };
}

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const formatBRL = (value: number) => BRL.format(value);
