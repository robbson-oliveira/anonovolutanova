import type { Metadata } from "next";
import { MaintenancePage } from "@/features/coming-soon/MaintenancePage";

export const metadata: Metadata = {
  title: { absolute: "Estamos temporariamente em manutenção" },
  description: "Voltamos em alguns minutos.",
  robots: { index: false, follow: false },
};

/** Shown for every public page while `MAINTENANCE_MODE` is on. */
export default function Manutencao() {
  return <MaintenancePage />;
}
