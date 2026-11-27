import type { Metadata } from "next";
import { ProductGallery } from "@sections/ProductGallery";
import { StorefrontHome } from "../storefront-home";

export const metadata: Metadata = {
  title: "Black Friday",
  robots: { index: false, follow: false },
};

/**
 * The public home with the Black Friday notices forced on, so they can be
 * reviewed on a preview deploy before 27/11 08:00 BRT. Not indexed. The
 * public home and the cart keep the real window and `?preview_bf=1`.
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
