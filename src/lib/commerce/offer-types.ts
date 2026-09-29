import type { EditionId } from "@content/product";

/**
 * Formato da oferta que a página de compra consome. Separado de `offer.ts`
 * (que só roda no servidor) para os componentes do navegador importarem o tipo.
 */

/** A product image as the Store API publishes it (the product's main image). */
export type ProductImage = {
  src: string;
  /** WordPress thumbnail size: what a miniature needs. */
  thumbnail: string;
  srcset: string;
  sizes: string;
  alt: string;
};

export type EditionOffer = {
  id: EditionId;
  label: string;
  cover: string;
  /** Dimensões intrínsecas do arquivo, para o next/image reservar o espaço. */
  coverSize: { width: number; height: number };
  description: string;
  inStock: boolean;
  /** Id of the edition's simple product in WooCommerce. Null without the 2027 products configured. */
  productId: number | null;
  /** Main image of the product in WooCommerce; null without one (the local cover stands in). */
  image: ProductImage | null;
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
