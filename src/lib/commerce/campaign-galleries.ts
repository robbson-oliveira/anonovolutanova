import "server-only";

import { EDITIONS, type EditionId } from "@content/product";
import { publicEnv } from "@/lib/env";
import { productInStock } from "./availability";
import { withBounds } from "./image-bounds";
import type { EditionOffer, ProductImage, ProductOffer } from "./offer-types";
import { galleryImages, mainImage, type StoreImage } from "./product-image";

/**
 * The public store host answers 403 to the catalog. The photos on `/` are
 * published on the admin host. `/home-2` reads them from there only when the
 * offer arrived without a gallery (preview without product ids). When the
 * offer already has the WooCommerce gallery, it is left as `/` built it.
 */
const ADMIN_CATALOG =
  "https://admin.anonovolutanova.com.br/wp-json/wc/store/v1/products?per_page=20";

type StoreProduct = {
  id: number;
  name: string;
  type: string;
  is_in_stock: boolean;
  is_purchasable: boolean;
  prices: { price: string; currency_minor_unit: number };
  images?: StoreImage[];
};

const fold = (value: string) => value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

function editionOf(name: string): EditionId | null {
  const label = fold(name);
  if (label.includes("planner")) return "bloco";
  if (label.includes("classic")) return "classica";
  if (label.includes("color")) return "color";
  return null;
}

async function loadCatalog(): Promise<StoreProduct[] | null> {
  const urls = [`${publicEnv.wpUrl}/wp-json/wc/store/v1/products?per_page=20`, ADMIN_CATALOG];
  const seen = new Set<string>();
  for (const url of urls) {
    if (seen.has(url)) continue;
    seen.add(url);
    try {
      const res = await fetch(url, { next: { revalidate: 60 }, signal: AbortSignal.timeout(8_000) });
      if (!res.ok) continue;
      const data = (await res.json()) as StoreProduct[];
      if (Array.isArray(data) && data.some((product) => product.type === "simple" && product.images?.length)) {
        return data;
      }
    } catch {
      continue;
    }
  }
  return null;
}

async function galleryOf(product: StoreProduct): Promise<ProductImage[]> {
  return Promise.all(galleryImages(product.images).map(withBounds));
}

/**
 * Fills the offer galleries for `/home-2` when the static fallback has none,
 * so the strip under the cover shows the same photos as the public home.
 * Does not turn checkout on and does not change an offer that already has them.
 */
export async function withHome2Galleries(offer: ProductOffer): Promise<ProductOffer> {
  const color = offer.editions.find((edition) => edition.id === "color");
  if (color && color.gallery.length > 0) return offer;

  const products = await loadCatalog();
  if (!products) return offer;

  const byEdition = new Map<EditionId, StoreProduct>();
  for (const product of products) {
    if (product.type !== "simple") continue;
    const id = editionOf(product.name);
    if (id) byEdition.set(id, product);
  }

  const editions = await Promise.all(
    offer.editions.map(async (edition) => {
      const product = byEdition.get(edition.id);
      if (!product || edition.gallery.length > 0) return edition;
      return { ...edition, gallery: await galleryOf(product) };
    }),
  );

  if (!editions.some((edition) => edition.id === "bloco")) {
    const product = byEdition.get("bloco");
    const base = EDITIONS.find((edition) => edition.id === "bloco");
    if (product && base) editions.push(await blocoEdition(offer, product, base));
  }

  return { ...offer, editions };
}

async function blocoEdition(
  offer: ProductOffer,
  product: StoreProduct,
  base: (typeof EDITIONS)[number],
): Promise<EditionOffer> {
  const price = Number(product.prices.price) / 10 ** product.prices.currency_minor_unit;
  const image = mainImage(product.images);
  return {
    id: "bloco",
    label: base.label,
    cover: base.cover,
    coverSize: base.coverSize,
    coverBox: base.coverBox,
    description: base.description,
    agenda: false,
    unit: base.unit,
    price,
    installmentAmount: Math.round((price / offer.installments.count) * 100) / 100,
    inStock: productInStock(product),
    productId: product.id,
    image: image ? await withBounds(image) : null,
    gallery: await galleryOf(product),
  };
}
