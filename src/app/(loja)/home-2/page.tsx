import type { Metadata } from "next";
import { BlackFridayTopBar } from "@/features/black-friday/BlackFridayTopBar";
import { ProductGallery } from "@sections/ProductGallery";
import { BlackFridayHero } from "@sections/BlackFridayHero";
import { BlackFridayPlannerSection } from "@sections/BlackFridayPlannerSection";
import { StorefrontHome } from "../storefront-home";

export const metadata: Metadata = {
  title: "Black Friday",
  robots: { index: false, follow: false },
};

/**
 * Campaign route, always `noindex`. `/` uses the same layout only while
 * `BLACK_FRIDAY_HOME_ACTIVE` is on, and that page stays indexable.
 * The cart still follows the Brasília window and `?preview_bf=1` on its own.
 */
export default function HomeBlackFridayPreview() {
  return (
    <StorefrontHome
      gallery={<ProductGallery />}
      structuredData={false}
      forceBlackFriday
      announcement={<BlackFridayTopBar />}
      hero={<BlackFridayHero />}
      planner={<BlackFridayPlannerSection />}
      plannerChoice
    />
  );
}
