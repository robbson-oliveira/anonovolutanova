import type { Metadata } from "next";
import { PRODUCT_NAME } from "@content/product";
import { getProductOffer } from "@/lib/commerce/offer";
import { publicEnv } from "@/lib/env";
import { About } from "@sections/About";
import { Closing } from "@sections/Closing";
import { DuckStrip } from "@sections/DuckStrip";
import { Explore } from "@sections/Explore";
import { Faq } from "@sections/Faq";
import { Hero } from "@sections/Hero";
import { Liturgical } from "@sections/Liturgical";
import { Planner } from "@sections/Planner";
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
      price: e.price.toFixed(2),
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
      {/* pt-9 only from lg: on the phone the shipping bar is in flow, inside
          the sticky group below. overflow-x-clip: the sideways entrance
          animations start 56px off and would widen the page without the clip. */}
      <div className="relative isolate overflow-x-clip bg-surface lg:pt-9">
        {/* One sticky layer for the shipping bar and the phone header. They
            used to be fixed and sticky separately, which jitters while
            Safari's toolbar changes the visual viewport. */}
        <div className="max-lg:sticky max-lg:top-0 max-lg:z-50 max-lg:bg-surface lg:contents">
          <TopBar />
          <SiteHeader smartMenu />
        </div>
        {/* Watercolor shared by the FAQ, the closing card and the footer (Figma
            "BG inferior", 949:15): 1920px wide, centered and cropped by the
            page on narrower screens, glued to the bottom, with a mask that keeps
            the top third clear. 2824px = the 2965px of the frame minus the 141px
            that hang below the footer. */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 aspect-[1920/2824] w-[max(100%,1100px)] -translate-x-1/2 bg-[url(/img/footer/bg-aquarela.webp)] bg-[length:100%_auto] bg-top bg-no-repeat [mask-image:var(--mask-lower-aquarela)] min-[1440px]:w-[max(100%,1920px)]"
        />
        <main>
          <Hero />
          <DuckStrip />
          <About />
          <Explore />
          <Planner />
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
