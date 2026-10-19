import "server-only";

import sharp from "sharp";
import type { ImageBounds, ProductImage } from "./offer-types";

/** Pixels at least this opaque count as the subject; the fainter ones are its shadow. */
const SUBJECT_ALPHA = 200;

const cache = new Map<string, Promise<ImageBounds | null>>();

/**
 * Where the subject sits inside a cutout image, so a miniature can be sized by
 * the subject instead of by a canvas whose transparent margins differ from file
 * to file. Measured on the smallest size WordPress generated and kept for the
 * life of the server instance. Null when the image cannot be read.
 */
export function measureBounds(url: string): Promise<ImageBounds | null> {
  let measured = cache.get(url);
  if (!measured) {
    measured = measure(url).then((bounds) => {
      if (!bounds) cache.delete(url);
      return bounds;
    });
    cache.set(url, measured);
  }
  return measured;
}

/** The image with its `bounds` filled in when they can be measured. */
export async function withBounds(image: ProductImage): Promise<ProductImage> {
  const bounds = await measureBounds(smallestUrl(image));
  return bounds ? { ...image, bounds } : image;
}

/** The smallest entry of a `srcset` that is still at least 200px wide, else the image itself. */
function smallestUrl(image: ProductImage) {
  const candidates = image.srcset
    .split(",")
    .map((entry) => entry.trim().split(/\s+/))
    .map(([url, descriptor]) => ({ url, width: parseInt(descriptor ?? "", 10) }))
    .filter((c) => c.url && c.width >= 200)
    .sort((a, b) => a.width - b.width);
  return candidates[0]?.url ?? image.src;
}

async function measure(url: string): Promise<ImageBounds | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 86_400 }, signal: AbortSignal.timeout(8_000) });
    if (!res.ok) return null;

    const { data, info } = await sharp(Buffer.from(await res.arrayBuffer()))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { width, height } = info;

    let left = width;
    let top = height;
    let right = -1;
    let bottom = -1;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[(y * width + x) * 4 + 3] < SUBJECT_ALPHA) continue;
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
    if (right < 0) return null;

    return {
      aspect: width / height,
      x: left / width,
      y: top / height,
      width: (right - left + 1) / width,
      height: (bottom - top + 1) / height,
    };
  } catch {
    return null;
  }
}
