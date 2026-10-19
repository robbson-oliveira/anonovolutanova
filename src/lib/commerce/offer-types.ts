import type { EditionId } from "@content/product";

/**
 * Formato da oferta que a página de compra consome. Separado de `offer.ts`
 * (que só roda no servidor) para os componentes do navegador importarem o tipo.
 */

/**
 * Where the subject of a cutout image sits, as fractions of the whole file
 * (`aspect` is file width over height). The rest of the file is transparent
 * margin and shadow.
 */
export type ImageBounds = {
  aspect: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

/** A product image as the Store API publishes it (the product's main image). */
export type ProductImage = {
  src: string;
  /** WordPress thumbnail size: what a miniature needs. */
  thumbnail: string;
  srcset: string;
  sizes: string;
  alt: string;
  /** Measured on the server for gallery images; absent when it could not be. */
  bounds?: ImageBounds;
};

export type EditionOffer = {
  id: EditionId;
  label: string;
  cover: string;
  /** Dimensões intrínsecas do arquivo, para o next/image reservar o espaço. */
  coverSize: { width: number; height: number };
  /** Area of the file the book itself covers (the rest is shadow), in file pixels. */
  coverBox: { x: number; y: number; width: number; height: number };
  description: string;
  /** Whether this is an agenda edition (the notepad is not). */
  agenda: boolean;
  /** What one unit is called, as in "por agenda" / "por bloco". */
  unit: string;
  price: number;
  /** One installment of `price`. */
  installmentAmount: number;
  inStock: boolean;
  /** Id of the edition's simple product in WooCommerce. Null without the 2027 products configured. */
  productId: number | null;
  /** Main image of the product in WooCommerce; null without one (the local cover stands in). */
  image: ProductImage | null;
  /** Remaining images of the product gallery in WooCommerce (everything after the main one). */
  gallery: ProductImage[];
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
