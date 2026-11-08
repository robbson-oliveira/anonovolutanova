import type { Metadata } from "next";
import { PRODUCT_NAME } from "@content/product";
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

/** Public home. The photo gallery sits between the editions and the planner. */
export default function Home() {
  return <StorefrontHome gallery={<ProductGallery />} />;
}
