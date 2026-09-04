import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { REVEAL_READY_SCRIPT } from "@ds/index";
import { PRODUCT_NAME } from "@content/product";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${PRODUCT_NAME} — Viva o caminho de santidade no dia a dia`,
    template: `%s · ${PRODUCT_NAME}`,
  },
  description:
    "Agenda católica anual inspirada em São Josemaria Escrivá. Une organização " +
    "diária e vida espiritual: tema do mês, frase do dia e práticas de vida interior.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <head>
        {/* Habilita a pausa do reveal antes da primeira pintura. Se este script
            não rodar, as animações simplesmente tocam no load — nunca o
            contrário, que deixaria blocos invisíveis. */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_READY_SCRIPT }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
