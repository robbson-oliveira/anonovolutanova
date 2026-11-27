import type { Metadata } from "next";
import { ProductGallery } from "@sections/ProductGallery";
import { StorefrontHome } from "../storefront-home";

export const metadata: Metadata = {
  title: "Black Friday",
  robots: { index: false, follow: false },
};

/**
 * Official Black Friday home. The notices are always on here; `/` never
 * shows them. Not indexed. Turn the route off after the campaign. The cart
 * still follows the Brasília window and `?preview_bf=1` on its own.
 */
export default function HomeBlackFridayPreview() {
  return (
    <StorefrontHome
      gallery={<ProductGallery />}
      structuredData={false}
      forceBlackFriday
    />
  );
}
