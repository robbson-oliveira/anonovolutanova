import type { Metadata } from "next";
import { BlackFridayTopBar } from "@/features/black-friday/BlackFridayTopBar";
import { ProductGallery } from "@sections/ProductGallery";
import { BlackFridayHero } from "@sections/BlackFridayHero";
import { StorefrontHome } from "../storefront-home";

export const metadata: Metadata = {
  title: "Black Friday",
  robots: { index: false, follow: false },
};

/**
 * Official Black Friday home. The top bar and the first fold are the
 * approved frame (Figma 2727:4964). `/` never renders them. Not indexed.
 * Turn the route off after the campaign. The cart still follows the
 * Brasília window and `?preview_bf=1` on its own.
 */
export default function HomeBlackFridayPreview() {
  return (
    <StorefrontHome
      gallery={<ProductGallery />}
      structuredData={false}
      forceBlackFriday
      announcement={<BlackFridayTopBar />}
      hero={<BlackFridayHero />}
    />
  );
}
