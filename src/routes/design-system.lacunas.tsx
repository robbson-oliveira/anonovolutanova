import { createFileRoute } from "@tanstack/react-router";
import DesignSystemLacunasPage from "../app/design-system/lacunas/page";

export const Route = createFileRoute("/design-system/lacunas")({
  head: () => ({
    meta: [
      { title: "Lacunas do Design System | Ano Novo, Luta Nova" },
      {
        name: "description",
        content:
          "Levantamento das peças da home que ainda não estão documentadas no design system da Agenda Ano Novo, Luta Nova.",
      },
      { property: "og:title", content: "Lacunas do Design System | Ano Novo, Luta Nova" },
      {
        property: "og:description",
        content:
          "Levantamento das peças da home que ainda não estão documentadas no design system.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DesignSystemLacunasPage,
});
