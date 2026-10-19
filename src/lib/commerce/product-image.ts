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
  return toProductImage(images?.[0]);
}

/** The gallery of a product: every image after the main one. */
export function galleryImages(images: StoreImage[] | undefined): ProductImage[] {
  return (images ?? [])
    .slice(1)
    .map(toProductImage)
    .filter((image): image is ProductImage => image !== null);
}

function toProductImage(image: StoreImage | undefined): ProductImage | null {
  if (!image?.src) return null;
  return {
    src: image.src,
    thumbnail: image.thumbnail || image.src,
    srcset: image.srcset ?? "",
    sizes: image.sizes ?? "",
    alt: image.alt ?? "",
  };
}
