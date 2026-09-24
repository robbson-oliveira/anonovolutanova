import type { Metadata } from "next";
import { Container } from "@ds/index";
import { CheckoutPage } from "@/features/checkout/CheckoutPage";
import { PageShell } from "@/features/shell/PageShell";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false, follow: false },
};

export default function Checkout() {
  return (
    <PageShell hideBuyButton>
      <Container className="py-section-sm">
        <CheckoutPage />
      </Container>
    </PageShell>
  );
}
