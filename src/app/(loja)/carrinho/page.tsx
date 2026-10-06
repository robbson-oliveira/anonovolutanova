import type { Metadata } from "next";
import { getProductOffer } from "@/lib/commerce/offer";
import { CartPage } from "@/features/cart/CartPage";
import { PrecheckoutHeader } from "@/features/cart/PrecheckoutHeader";
import { CheckoutFooter } from "@/features/checkout/CheckoutFooter";

export const metadata: Metadata = {
  title: "Carrinho",
  robots: { index: false, follow: false },
};

/**
 * Cart page, before the checkout (ANLN_PRECHECKOUT; the proxy redirects
 * `/carrinho` to the landing offer while it is off). Simple header with the
 * landing page's offer block, the edition choice and the cart, and the
 * checkout's small footer: few ways out in the middle of a purchase.
 *
 * The action color (buttons, progress bar, checks) is swapped to petrol blue
 * here only, by overriding the semantic token on the wrapper.
 *
 * Price and stock come from WooCommerce (getProductOffer revalidates every
 * minute), as on the landing page.
 */
export default async function Carrinho() {
  const offer = await getProductOffer();

  return (
    <div className="flex min-h-dvh flex-col bg-surface-plain [--color-action-hover:var(--brand-petrol-700)] [--color-action:var(--brand-petrol-900)]">
      <PrecheckoutHeader />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 lg:py-12">
        <CartPage offer={offer} />
      </main>
      <CheckoutFooter />
    </div>
  );
}
