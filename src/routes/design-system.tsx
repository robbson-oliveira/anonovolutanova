import { createFileRoute } from "@tanstack/react-router";
import DesignSystemPage from "../app/design-system/page";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "Design System | Ano Novo, Luta Nova" },
      { name: "description", content: "Catálogo visual do design system da Agenda Ano Novo, Luta Nova 2027." },
      { property: "og:title", content: "Design System | Ano Novo, Luta Nova" },
      { property: "og:description", content: "Catálogo visual do design system da Agenda Ano Novo, Luta Nova 2027." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DesignSystemPage,
});