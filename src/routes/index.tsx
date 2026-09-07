import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agenda Ano Novo, Luta Nova 2027" },
      { name: "description", content: "Agenda católica 2027 para organizar o cotidiano com fé e propósito." },
      { property: "og:title", content: "Agenda Ano Novo, Luta Nova 2027" },
      { property: "og:description", content: "Agenda católica 2027 para organizar o cotidiano com fé e propósito." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WireframePage,
});

function WireframePage() {
  return (
    <iframe
      src="/wireframe/wireframe-v2.html"
      title="Agenda Ano Novo, Luta Nova 2027"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}