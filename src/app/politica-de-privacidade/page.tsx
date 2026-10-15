import type { Metadata } from "next";
import { InstitutionalPage } from "@/features/shell/InstitutionalPage";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Política de Privacidade",
  alternates: { canonical: "/politica-de-privacidade" },
};

export default function PrivacidadePage() {
  return (
    <InstitutionalPage slug="politica-de-privacidade" fallbackTitle="Política de Privacidade" />
  );
}
