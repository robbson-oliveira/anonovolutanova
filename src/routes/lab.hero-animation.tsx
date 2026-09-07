import { createFileRoute } from "@tanstack/react-router";
import HeroAnimationLab from "../app/lab/hero-animation/page";

export const Route = createFileRoute("/lab/hero-animation")({
  head: () => ({
    meta: [
      { title: "Laboratório de Animação | Agenda 2027" },
      { name: "description", content: "Ferramenta interna para ajustar a animação das agendas no topo da página." },
      { property: "og:title", content: "Laboratório de Animação | Agenda 2027" },
      { property: "og:description", content: "Ferramenta interna para ajustar a animação das agendas no topo da página." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HeroAnimationLab,
});