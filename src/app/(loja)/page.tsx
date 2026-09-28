import type { Metadata } from "next";
import { PRODUCT_NAME } from "@content/product";
import { getProductOffer } from "@/lib/commerce/offer";
import { publicEnv } from "@/lib/env";
import { About } from "@sections/About";
import { Closing } from "@sections/Closing";
import { Explore } from "@sections/Explore";
import { Faq } from "@sections/Faq";
import { Hero } from "@sections/Hero";
import { Liturgical } from "@sections/Liturgical";
import { Persona } from "@sections/Persona";
import { Product } from "@sections/Product";
import { SiteFooter } from "@sections/SiteFooter";
import { SiteHeader } from "@sections/SiteHeader";
import { Testimonials } from "@sections/Testimonials";
import { TopBar } from "@sections/TopBar";

const DESCRIPTION =
  "Agenda católica 2027 inspirada em São Josemaria Escrivá: tema do mês, frase " +
  "do dia e práticas de vida interior. Edição Color e Edição Clássica.";

export const metadata: Metadata = {
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: PRODUCT_NAME,
    description: DESCRIPTION,
    type: "website",
    images: ["/img/capa-dupla.png"],
  },
  twitter: { card: "summary_large_image" },
};

/**
 * Home em React, no lugar do wireframe do Framer que era servido como HTML.
 * A compra acontece aqui mesmo, na seção #oferta: escolhe a edição e segue
 * direto para o checkout. A antiga /comprar redireciona para cá.
 *
 * O preço e o estoque vêm do WooCommerce (getProductOffer revalida a cada
 * minuto), então a página é regenerada sozinha quando o estoque muda.
 */
export default async function Home() {
  const offer = await getProductOffer();

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
      availability: e.inStock ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      url: `${publicEnv.siteUrl}/?edicao=${e.id}#oferta`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify não escapa "<"; sem isto um "</script>" no conteúdo fecharia a tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <TopBar />
      {/* pt-9: a barra de frete é fixa e tem 36px. overflow-x-clip: as
          animações de entrada laterais (Reveal left/right) partem 56px fora
          do lugar e, sem o corte, alargariam a página no celular. */}
      <div className="overflow-x-clip bg-surface pt-9">
        <SiteHeader />
        <main>
          <Hero />
          <About />
          <Explore />
          <Liturgical />
          <Persona />
          <Testimonials />
          <Product offer={offer} />
          <Faq />
          <Closing />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
