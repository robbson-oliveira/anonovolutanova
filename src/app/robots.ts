import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Páginas internas de revisão, não conteúdo do site.
      disallow: ["/design-system", "/home-dev", "/lab/", "/style-guide", "/wireframe"],
    },
    sitemap: `${publicEnv.siteUrl}/sitemap.xml`,
  };
}
