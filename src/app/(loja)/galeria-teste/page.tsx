import type { Metadata } from "next";
import { ProductGallery } from "@sections/ProductGallery";
import { StorefrontHome } from "../storefront-home";

export const metadata: Metadata = {
  title: "Fotos reais do produto",
  description:
    "Página de teste da galeria. Imagens ilustrativas; fotos reais em breve.",
  robots: { index: false, follow: false },
};

/**
 * Same storefront as `/`, with the photo gallery between the editions and
 * the planner. Public so a client can open the link. Not indexed.
 */
export default function GalleryTestPage() {
  return <StorefrontHome gallery={<ProductGallery />} structuredData={false} />;
}
