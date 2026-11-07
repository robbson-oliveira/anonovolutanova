import type { Metadata } from "next";
import { PRODUCT_NAME } from "@content/product";
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

/** Public home. The gallery preview lives at `/galeria-teste`. */
export default function Home() {
  return <StorefrontHome />;
}
