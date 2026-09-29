import type { ProductImage } from "./offer-types";

/** An image as the Store API sends it, on products and on cart items. */
export type StoreImage = {
  src: string;
  thumbnail?: string;
  srcset?: string;
  sizes?: string;
  alt?: string;
};

/**
 * The main image of a product or cart item (the first one WooCommerce lists),
 * or null when it has none.
 */
export function mainImage(images: StoreImage[] | undefined): ProductImage | null {
  const image = images?.[0];
  if (!image?.src) return null;
  return {
    src: image.src,
    thumbnail: image.thumbnail || image.src,
    srcset: image.srcset ?? "",
    sizes: image.sizes ?? "",
    alt: image.alt ?? "",
  };
}
