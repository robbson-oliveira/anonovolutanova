import type { Metadata } from "next";
import { Container } from "@ds/index";
import { EDITIONS, type EditionId } from "@content/product";
import { PageShell } from "@/features/shell/PageShell";
import { PurchasePanel } from "@/features/purchase/PurchasePanel";
import { getProductOffer } from "@/lib/commerce/offer";
import { publicEnv } from "@/lib/env";

const DESCRIPTION =
  "Agenda católica 2027 inspirada em São Josemaria Escrivá: tema do mês, frase " +
  "do dia e práticas de vida interior. Edição Color e Edição Clássica.";

export const metadata: Metadata = {
  title: "Comprar",
  description: DESCRIPTION,
  alternates: { canonical: "/comprar" },
  openGraph: {
    title: "Comprar a Agenda Ano Novo, Luta Nova 2027",
    description: DESCRIPTION,
    type: "website",
    images: ["/img/capa-dupla.png"],
  },
};

type PageProps = {
  searchParams: Promise<{ edicao?: string | string[] }>;
};

export default async function ComprarPage({ searchParams }: PageProps) {
  const [offer, params] = await Promise.all([getProductOffer(), searchParams]);
  const requested = Array.isArray(params.edicao) ? params.edicao[0] : params.edicao;
  const initialEdition = EDITIONS.find((e) => e.id === requested)?.id as EditionId | undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: offer.name,
    description: DESCRIPTION,
    brand: { "@type": "Brand", name: "Ano Novo, Luta Nova" },
    image: offer.editions.map((e) => `${publicEnv.siteUrl}${e.cover}`),
    offers: offer.editions.map((e) => ({
      "@type": "Offer",
      name: e.label,
      price: offer.price.toFixed(2),
      priceCurrency: "BRL",
      availability: e.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
      url: `${publicEnv.siteUrl}/comprar?edicao=${e.id}`,
    })),
  };

  return (
    <PageShell hideBuyButton>
      <script
        type="application/ld+json"
        // JSON.stringify não escapa "<"; sem isto um "</script>" no conteúdo fecharia a tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Container className="py-section-sm">
        <PurchasePanel offer={offer} initialEdition={initialEdition} />
      </Container>
    </PageShell>
  );
}
