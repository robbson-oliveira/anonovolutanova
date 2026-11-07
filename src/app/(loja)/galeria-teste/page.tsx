import type { Metadata } from "next";
import { ProductGallery } from "@sections/ProductGallery";
import { StorefrontHome } from "../storefront-home";

export const metadata: Metadata = {
  title: "Fotos reais do produto",
  description:
    "Veja de perto a capa, as páginas e os detalhes da agenda. Página de teste.",
  robots: { index: false, follow: false },
};

/**
 * Same storefront as `/`, with the photo gallery between the editions and
 * the planner. Public so a client can open the link. Not indexed.
 */
export default function GalleryTestPage() {
  return <StorefrontHome gallery={<ProductGallery />} structuredData={false} />;
}
