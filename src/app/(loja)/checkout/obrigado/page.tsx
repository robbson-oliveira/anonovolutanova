import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@ds/index";
import { ThankYouPage } from "@/features/checkout/ThankYouPage";
import { PageShell } from "@/features/shell/PageShell";

export const metadata: Metadata = {
  title: "Pedido recebido",
  robots: { index: false, follow: false },
};

export default function Obrigado() {
  return (
    <PageShell hideBuyButton>
      <Container>
        {/* useSearchParams lê o pedido da URL: só existe no navegador. */}
        <Suspense fallback={null}>
          <ThankYouPage />
        </Suspense>
      </Container>
    </PageShell>
  );
}
