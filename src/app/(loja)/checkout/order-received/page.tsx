import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { PRODUCT_NAME } from "@content/product";
import { CheckoutFooter } from "@/features/checkout/CheckoutFooter";
import { ThankYouPage } from "@/features/checkout/ThankYouPage";

export const metadata: Metadata = {
  title: "Pedido recebido",
  robots: { index: false, follow: false },
};

/**
 * Thank-you page (`?order_id=&token=&payment=`). Same chrome as the checkout,
 * as in the reference: only the centered logo, the content and the small
 * footer, on a white background.
 */
export default function OrderReceived() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-plain">
      <header className="flex justify-center py-6 sm:py-8">
        {/* <a>, not <Link>: same entry to the site as the checkout logo. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" aria-label="Voltar ao site">
          <Image src="/img/logo.png" alt={PRODUCT_NAME} width={1086} height={1448} sizes="42px" preload className="block h-14 w-auto" />
        </a>
      </header>
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-16 sm:px-6">
        {/* useSearchParams reads the order from the URL: browser only. */}
        <Suspense fallback={null}>
          <ThankYouPage />
        </Suspense>
      </main>
      <CheckoutFooter />
    </div>
  );
}
