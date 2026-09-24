import type { EditionId } from "@content/product";

/**
 * Formato da oferta que a página de compra consome. Separado de `offer.ts`
 * (que só roda no servidor) para os componentes do navegador importarem o tipo.
 */
export type EditionOffer = {
  id: EditionId;
  label: string;
  cover: string;
  /** Dimensões intrínsecas do arquivo, para o next/image reservar o espaço. */
  coverSize: { width: number; height: number };
  description: string;
  inStock: boolean;
  /** Id da variação no WooCommerce. Nulo sem o produto 2027 configurado. */
  variationId: number | null;
};

export type ProductOffer = {
  name: string;
  year: number;
  price: number;
  installments: { count: number; amount: number };
  freeShippingMinQty: number;
  editions: EditionOffer[];
  /** Carrinho e checkout headless no ar? */
  checkoutEnabled: boolean;
};
