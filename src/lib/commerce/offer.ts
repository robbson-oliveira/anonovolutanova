import "server-only";

import {
  CYCLE_YEAR,
  EDITIONS,
  FREE_SHIPPING_MIN_QTY,
  PRICE,
  PRODUCT_NAME,
  type EditionId,
} from "@content/product";
import { publicEnv } from "@/lib/env";
import { serverEnv } from "@/lib/env.server";
import { editionFromAttribute } from "./editions";
import type { ProductOffer } from "./offer-types";

export type { EditionOffer, ProductOffer } from "./offer-types";

/**
 * A oferta da página de compra: preço, parcelas e, por edição, estoque e o id
 * da variação no WooCommerce.
 *
 * Com `ANLN_PRODUCT_ID` definido, lê o produto variável 2027 pela Store API
 * (revalida a cada minuto: o estoque é limitado de verdade). Sem ele, ou se o
 * WordPress não responder, usa `src/content/product.ts` — e aí não há como
 * vender pelo site, então `checkoutEnabled` fica falso e a página cai no
 * pedido pelo WhatsApp.
 */
export async function getProductOffer(): Promise<ProductOffer> {
  const fallback = staticOffer();
  const productId = serverEnv.productId;
  if (!productId) return fallback;

  try {
    const fromStore = await storeOffer(productId);
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

type StoreProduct = {
  id: number;
  name: string;
  is_in_stock: boolean;
  prices: { price: string; currency_minor_unit: number };
  variations?: Array<{ id: number; attributes: Array<{ name: string; value: string }> }>;
};

async function storeOffer(productId: number): Promise<ProductOffer | null> {
  const base = `${publicEnv.wpUrl}/wp-json/wc/store/v1/products`;
  const init = { next: { revalidate: 60 }, signal: AbortSignal.timeout(10_000) } as const;

  const parentRes = await fetch(`${base}/${productId}`, init);
  if (!parentRes.ok) return null;
  const parent = (await parentRes.json()) as StoreProduct;

  const variationIds = (parent.variations ?? []).map((v) => v.id);
  if (!variationIds.length) return null;

  // Estoque e preço de cada variação (a resposta do pai não traz por variação).
  const variations = await Promise.all(
    variationIds.map(async (id) => {
      const res = await fetch(`${base}/${id}`, init);
      return res.ok ? ((await res.json()) as StoreProduct) : null;
    }),
  );

  const byEdition = new Map<EditionId, { variationId: number; inStock: boolean; price: number }>();
  for (const v of parent.variations ?? []) {
    const edition = v.attributes.map((a) => editionFromAttribute(a.value)).find(Boolean) ?? null;
    const detail = variations.find((d) => d?.id === v.id);
    if (!edition || !detail) continue;
    byEdition.set(edition, {
      variationId: v.id,
      inStock: detail.is_in_stock,
      price: Number(detail.prices.price) / 10 ** detail.prices.currency_minor_unit,
    });
  }

  // Sem as duas edições mapeadas, o produto no WooCommerce não está como o
  // site espera: melhor não vender do que vender a edição errada.
  if (EDITIONS.some((e) => !byEdition.has(e.id))) return null;

  const fallback = staticOffer();
  const price = Math.min(...[...byEdition.values()].map((e) => e.price));
  const installmentCount = fallback.installments.count;

  return {
    ...fallback,
    price,
    installments: {
      count: installmentCount,
      amount: Math.round((price / installmentCount) * 100) / 100,
    },
    editions: fallback.editions.map((e) => {
      const live = byEdition.get(e.id)!;
      return { ...e, inStock: live.inStock, variationId: live.variationId };
    }),
    checkoutEnabled: publicEnv.checkoutEnabled,
  };
}

