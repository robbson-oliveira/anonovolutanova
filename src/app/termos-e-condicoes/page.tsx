import type { Metadata } from "next";
import { InstitutionalPage } from "@/features/shell/InstitutionalPage";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Termos e Condições",
  alternates: { canonical: "/termos-e-condicoes" },
};

export default function TermosPage() {
  return <InstitutionalPage slug="termos-e-condicoes" fallbackTitle="Termos e Condições" />;
}
