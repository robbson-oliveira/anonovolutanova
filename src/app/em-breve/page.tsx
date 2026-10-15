import type { Metadata } from "next";
import { COMING_SOON } from "@content/coming-soon";
import { ComingSoonPage } from "@/features/coming-soon/ComingSoonPage";

const TITLE = "Agenda Ano Novo, Luta Nova";

export const metadata: Metadata = {
  // The home's own title, without the " · Agenda…" template suffix.
  title: { absolute: TITLE },
  description: COMING_SOON.description,
  // Served at "/" by the proxy while ANLN_HOME_COMMING_SOON is on: the
  // address that counts is the home's.
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: COMING_SOON.description,
    type: "website",
    images: ["/img/em-breve/compartilhar.png"],
  },
  twitter: { card: "summary_large_image" },
};

/**
 * "Em breve" page. Nobody links here: with ANLN_HOME_COMMING_SOON=true the
 * proxy rewrites `/` to it (and redirects `/em-breve` back to `/` when off).
 */
export default function EmBreve() {
  return <ComingSoonPage />;
}
