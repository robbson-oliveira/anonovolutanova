import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";

const PAGES = [
  { path: "/", priority: 1 },
  { path: "/contato", priority: 0.5 },
  { path: "/termos-e-condicoes", priority: 0.2 },
  { path: "/politica-de-privacidade", priority: 0.2 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: `${publicEnv.siteUrl}${p.path === "/" ? "" : p.path}`,
    priority: p.priority,
  }));
}
