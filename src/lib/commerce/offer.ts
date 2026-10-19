import "server-only";

import {
  AGENDA_EDITIONS,
  CYCLE_YEAR,
  EDITIONS,
  FREE_SHIPPING_MIN_QTY,
  PRICE,
  PRODUCT_NAME,
  type EditionId,
} from "@content/product";
import { publicEnv } from "@/lib/env";
import { serverEnv } from "@/lib/env.server";
import type { ProductOffer } from "./offer-types";
import { galleryImages, mainImage, type StoreImage } from "./product-image";

export type { EditionOffer, ProductImage, ProductOffer } from "./offer-types";

/**
 * A oferta da página de compra: preço, parcelas e, por edição, estoque, o id
 * do produto no WooCommerce e a imagem principal dele.
 *
 * Each edition is its own simple product, mapped by id (ANLN_PRODUCT_COLOR,
 * ANLN_PRODUCT_CLASSIC) and read from the Store API with a one-minute
 * revalidation: stock is genuinely limited. Without both ids, or if WordPress
 * does not answer, the offer comes from `src/content/product.ts` — and then
 * nothing can be sold on the site, so `checkoutEnabled` stays false and the
 * page falls back to ordering on WhatsApp.
 */
export async function getProductOffer(): Promise<ProductOffer> {
  const fallback = staticOffer();
  const ids = serverEnv.products;
  if (AGENDA_EDITIONS.some((e) => !ids[e.id])) return fallback;

  try {
    const fromStore = await storeOffer(ids);
    return fromStore ?? fallback;
  } catch {
    return fallback;
  }
}

function staticOffer(): ProductOffer {
  return {
    name: PRODUCT_NAME,
    year: CYCLE_YEAR,
    price: PRICE.amount,
    installments: { count: PRICE.installments, amount: PRICE.installmentAmount },
    freeShippingMinQty: FREE_SHIPPING_MIN_QTY,
    // The notepad has no static price: it only exists with its WooCommerce product.
    editions: AGENDA_EDITIONS.map((e) => ({
      id: e.id,
      label: e.label,
      cover: e.cover,
      coverSize: e.coverSize,
      coverBox: e.coverBox,
      description: e.description,
      agenda: e.agenda,
      unit: e.unit,
      price: PRICE.amount,
      installmentAmount: PRICE.installmentAmount,
      inStock: true,
      productId: null,
      image: null,
      gallery: [],
    })),
    checkoutEnabled: false,
  };
}

type StoreProduct = {
  id: number;
  name: string;
  type: string;
  is_in_stock: boolean;
  is_purchasable: boolean;
  prices: { price: string; currency_minor_unit: number };
  images?: StoreImage[];
};

async function storeOffer(ids: Record<EditionId, number | null>): Promise<ProductOffer | null> {
  const base = `${publicEnv.wpUrl}/wp-json/wc/store/v1/products`;
  const init = { next: { revalidate: 60 }, signal: AbortSignal.timeout(10_000) } as const;

  const entries = await Promise.all(
    EDITIONS.filter((e) => ids[e.id]).map(async (e) => {
      const res = await fetch(`${base}/${ids[e.id]}`, init);
      return [e.id, res.ok ? ((await res.json()) as StoreProduct) : null] as const;
    }),
  );

  const byEdition = new Map<EditionId, { product: StoreProduct; price: number }>();
  for (const [edition, product] of entries) {
    // A variable product here would add its parent to the cart, which the
    // Store API refuses: only simple products are sold.
    if (!product || product.type !== "simple") continue;
    byEdition.set(edition, {
      product,
      price: Number(product.prices.price) / 10 ** product.prices.currency_minor_unit,
    });
  }

  // Sem as duas edições mapeadas, o WooCommerce não está como o site espera:
  // melhor não vender do que vender a edição errada.
  if (AGENDA_EDITIONS.some((e) => !byEdition.has(e.id))) return null;

  const fallback = staticOffer();
  const installmentCount = fallback.installments.count;
  const installmentOf = (value: number) => Math.round((value / installmentCount) * 100) / 100;
  // `price` stays the agenda's (the cheapest edition): it feeds the structured data and the cart total.
  const price = Math.min(...AGENDA_EDITIONS.map((e) => byEdition.get(e.id)!.price));

  return {
    ...fallback,
    price,
    installments: {
      count: installmentCount,
      amount: installmentOf(price),
    },
    editions: EDITIONS.filter((e) => byEdition.has(e.id)).map((e) => {
      const { product, price: editionPrice } = byEdition.get(e.id)!;
      return {
        id: e.id,
        label: e.label,
        cover: e.cover,
        coverSize: e.coverSize,
      coverBox: e.coverBox,
        description: e.description,
        agenda: e.agenda,
        unit: e.unit,
        price: editionPrice,
        installmentAmount: installmentOf(editionPrice),
        inStock: product.is_in_stock && product.is_purchasable,
        productId: product.id,
        image: mainImage(product.images),
        gallery: galleryImages(product.images),
      };
    }),
    checkoutEnabled: publicEnv.checkoutEnabled,
  };
}
