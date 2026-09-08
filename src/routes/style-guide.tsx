import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/style-guide")({
  head: () => ({
    meta: [
      { title: "Guia de Estilo | Agenda Ano Novo, Luta Nova 2027" },
      {
        name: "description",
        content:
          "Guia de estilo visual da Agenda Ano Novo, Luta Nova 2027: cores, tipografia e elementos gráficos.",
      },
      { property: "og:title", content: "Guia de Estilo | Agenda Ano Novo, Luta Nova 2027" },
      {
        property: "og:description",
        content:
          "Guia de estilo visual da Agenda Ano Novo, Luta Nova 2027: cores, tipografia e elementos gráficos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StyleGuidePage,
});

function StyleGuidePage() {
  return (
    <iframe
      src="/style-guide-agenda-2027.html"
      title="Guia de Estilo Agenda 2027"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}
