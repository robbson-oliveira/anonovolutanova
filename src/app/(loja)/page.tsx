import type { Metadata } from "next";
import { PRODUCT_NAME } from "@content/product";
import { BlackFridayTopBar } from "@/features/black-friday/BlackFridayTopBar";
import { BLACK_FRIDAY_HOME_ACTIVE } from "@/lib/black-friday";
import { BlackFridayHero } from "@sections/BlackFridayHero";
import { BlackFridayPlannerSection } from "@sections/BlackFridayPlannerSection";
import { ProductGallery } from "@sections/ProductGallery";
import { HOME_DESCRIPTION, StorefrontHome } from "./storefront-home";

export const metadata: Metadata = {
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: PRODUCT_NAME,
    description: HOME_DESCRIPTION,
    type: "website",
    images: ["/img/capa-dupla.png"],
  },
  twitter: { card: "summary_large_image" },
};

/**
 * Public home. Indexable either way: `noindex` stays on `/home-2` only.
 * `BLACK_FRIDAY_HOME_ACTIVE` swaps the approved campaign layout in. The
 * original sections stay in the tree and come back when the flag is false.
 * Header anchors stay on this page (`#sobre`, `#oferta`), not on `/home-2`.
 */
export default function Home() {
  if (!BLACK_FRIDAY_HOME_ACTIVE) {
    return <StorefrontHome gallery={<ProductGallery />} />;
  }

  return (
    <StorefrontHome
      gallery={<ProductGallery />}
      forceBlackFriday
      announcement={<BlackFridayTopBar />}
      hero={<BlackFridayHero />}
      planner={<BlackFridayPlannerSection />}
      plannerChoice
    />
  );
}
