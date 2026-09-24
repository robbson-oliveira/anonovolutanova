import type { Metadata } from "next";

// A página do laboratório é client component; os metadados ficam aqui.
export const metadata: Metadata = {
  title: { absolute: "Laboratório de Animação | Agenda 2027" },
  description: "Ferramenta interna para ajustar a animação das agendas no topo da página.",
  openGraph: {
    title: "Laboratório de Animação | Agenda 2027",
    description: "Ferramenta interna para ajustar a animação das agendas no topo da página.",
    type: "website",
  },
  twitter: { card: "summary" },
  robots: { index: false, follow: false },
};

export default function HeroAnimationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
