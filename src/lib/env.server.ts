import "server-only";

import type { EditionId } from "@content/product";

/** A WooCommerce id as a positive integer, or null when unset or invalid. */
const productId = (raw: string | undefined) => {
  const id = Number(raw?.trim());
  return Number.isInteger(id) && id > 0 ? id : null;
};

/**
 * Variáveis só do servidor. Nunca chegam ao navegador.
 */
export const serverEnv = {
  /**
   * Id of each edition's simple product in WooCommerce (ANLN_PRODUCT_COLOR,
   * ANLN_PRODUCT_CLASSIC). Without both the offer uses the static content and
   * the site does not sell.
   */
  products: {
    color: productId(process.env.ANLN_PRODUCT_COLOR),
    classica: productId(process.env.ANLN_PRODUCT_CLASSIC),
  } satisfies Record<EditionId, number | null>,
  /**
   * Serves the "Em breve" page at `/` instead of the landing page. Read by the
   * proxy on each request, so flipping it needs a restart, not a rebuild.
   */
  homeComingSoon: process.env.ANLN_HOME_COMMING_SOON === "true",
  /**
   * Opens `/carrinho`: the edition choice and the cart on their own page,
   * before the checkout. Off, `/carrinho` redirects to the landing offer.
   */
  precheckout: process.env.ANLN_PRECHECKOUT === "true",
} as const;
