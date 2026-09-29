/**
 * Variáveis públicas, lidas num lugar só (como no storefront da Camila).
 *
 * `NEXT_PUBLIC_*` é embutida no bundle em tempo de build. Numa imagem Docker,
 * cada uma precisa virar `ARG` no Dockerfile, senão chega vazia.
 */

const trimSlash = (url: string) => url.replace(/\/+$/, "");

export const publicEnv = {
  /**
   * WordPress/WooCommerce. Hoje é o domínio principal; na virada passa a ser
   * https://admin.anonovolutanova.com.br (ver PLANO-MIGRACAO-NEXTJS.md, D2).
   */
  wpUrl: trimSlash(
    process.env.NEXT_PUBLIC_WP_URL || "https://anonovolutanova.com.br",
  ),
  /** URL canônica deste site (sitemap, Open Graph, JSON-LD). */
  siteUrl: trimSlash(
    process.env.NEXT_PUBLIC_SITE_URL || "https://anonovolutanova.com.br",
  ),
  /**
   * Liga o carrinho e o checkout headless. Fica desligado até a virada
   * (Fase 7): antes disso a compra termina no pedido pelo WhatsApp mesmo com o
   * produto configurado. Só vale com ANLN_PRODUCT_COLOR e
   * ANLN_PRODUCT_CLASSIC definidos no servidor.
   */
  checkoutEnabled: process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true",
  /** Container do Google Tag Manager (GTM-XXXX). Vazio: sem GTM, só dataLayer. */
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
  /**
   * Phone the chat widget of the "Em breve" page sends messages to, with
   * country and area code (only its digits count).
   */
  whatsappChatNumber: (process.env.NEXT_PUBLIC_WHATSAPP_CHAT_NUMBER || "5527992794290").replace(/\D/g, ""),
} as const;
