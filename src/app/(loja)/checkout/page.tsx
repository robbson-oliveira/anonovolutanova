import type { Metadata } from "next";
import { CheckoutFooter } from "@/features/checkout/CheckoutFooter";
import { CheckoutPage } from "@/features/checkout/CheckoutPage";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false, follow: false },
};

/**
 * Sem cabeçalho e rodapé do site: só o logo, o formulário, o resumo e um
 * rodapé mínimo com os dados da empresa — menos saídas no meio da compra,
 * como no checkout de referência. Fundo branco, não o creme do site.
 * `pb-16` no celular: espaço da barra fixa do resumo (MobileSummaryBar).
 */
export default function Checkout() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-plain pb-16 lg:pb-0">
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 lg:py-10">
        <CheckoutPage />
      </main>
      <CheckoutFooter />
    </div>
  );
}
