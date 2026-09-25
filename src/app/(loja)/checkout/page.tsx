import type { Metadata } from "next";
import { CheckoutPage } from "@/features/checkout/CheckoutPage";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false, follow: false },
};

/**
 * Sem cabeçalho e rodapé do site: só o logo, o formulário e o resumo — menos
 * saídas no meio da compra, como no checkout de referência.
 */
export default function Checkout() {
  return (
    <div className="min-h-dvh bg-surface">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:py-10">
        <CheckoutPage />
      </div>
    </div>
  );
}
