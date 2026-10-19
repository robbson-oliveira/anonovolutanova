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

/**
 * Appended to every WooCommerce image URL. The uploads are served with a
 * seven-day cache, and a file replaced in the media library keeps its URL, so
 * visitors (and the CDN) keep the old one. Bump it whenever product images are
 * replaced in place.
 */
const MEDIA_VERSION = "20261019";

const versioned = (url: string) => `${url}${url.includes("?") ? "&" : "?"}v=${MEDIA_VERSION}`;

/** `srcset` is "url 300w, url 600w": version each URL, keep the descriptors. */
const versionedSrcset = (srcset: string) =>
  srcset
    .split(",")
    .map((entry) => {
      const [url, ...descriptor] = entry.trim().split(/\s+/);
      return url ? [versioned(url), ...descriptor].join(" ") : "";
    })
    .filter(Boolean)
    .join(", ");

function toProductImage(image: StoreImage | undefined): ProductImage | null {
  if (!image?.src) return null;
  return {
    src: versioned(image.src),
    thumbnail: versioned(image.thumbnail || image.src),
    srcset: versionedSrcset(image.srcset ?? ""),
    sizes: image.sizes ?? "",
    alt: image.alt ?? "",
  };
}
