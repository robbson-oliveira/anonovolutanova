import "server-only";

/**
 * Variáveis só do servidor. Nunca chegam ao navegador.
 */
export const serverEnv = {
  /**
   * Id do produto variável "Agenda Ano Novo, Luta Nova 2027" no WooCommerce.
   * Sem ele, a página de compra usa o conteúdo estático e não vende pelo site.
   */
  productId: Number(process.env.ANLN_PRODUCT_ID) || null,
} as const;
