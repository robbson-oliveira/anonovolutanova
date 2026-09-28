import type { Metadata } from "next";
import { REVEAL_READY_SCRIPT } from "@ds/index";
import { PRODUCT_NAME } from "@content/product";
import { publicEnv } from "@/lib/env";
import { gtmHeadSnippet } from "@/lib/tracking/gtm";
import { ConsentBanner } from "@/features/shell/ConsentBanner";
import "./globals.css";

/*
 * Fontes locais (public/fonts), declaradas inline no HTML inicial em vez de
 * next/font: o nome da família fica literal ("Manrope", "Yellowtail"), que é
 * o que os tokens do DS usam, e o `font-display: block` garante que nenhuma
 * fonte provisória seja pintada — correção validada em 07/09.
 *
 * Manrope em todo o site. Yellowtail é a segunda família do design aprovado:
 * simula a letra de quem já preencheu a agenda, nos mockups de página interna.
 */
const FONT_FILES = [
  { family: "Manrope", weight: 400, file: "manrope-latin-400-normal.woff2" },
  { family: "Manrope", weight: 500, file: "manrope-latin-500-normal.woff2" },
  { family: "Manrope", weight: 600, file: "manrope-latin-600-normal.woff2" },
  { family: "Manrope", weight: 700, file: "manrope-latin-700-normal.woff2" },
  { family: "Yellowtail", weight: 400, file: "yellowtail-latin-400-normal.woff2" },
] as const;

const criticalFontCss =
  FONT_FILES.map(
    (f) =>
      `@font-face{font-family:"${f.family}";font-style:normal;font-weight:${f.weight};` +
      `font-display:block;src:url("/fonts/${f.file}") format("woff2")}`,
  ).join("") +
  `:root{--font-manrope:"Manrope";--font-yellowtail:"Yellowtail";` +
  `--font-sans:"Manrope",ui-sans-serif,system-ui,sans-serif;` +
  `--font-script:"Yellowtail",ui-serif,cursive}` +
  `html,body{font-family:"Manrope",ui-sans-serif,system-ui,sans-serif}` +
  `html[data-ds-fonts-loading] body{visibility:hidden}`;

/* Em uma abertura sem cache, o catálogo do design system só fica visível
   quando as duas famílias locais estão prontas (com teto de 3s). Isso evita
   que qualquer fonte provisória seja pintada nas páginas de revisão. */
const fontReadinessScript = `
(() => {
  if (!location.pathname.startsWith('/design-system') || !document.fonts) return;
  const root = document.documentElement;
  root.dataset.dsFontsLoading = '';
  const ready = Promise.all([
    document.fonts.load('400 1em Manrope'),
    document.fonts.load('500 1em Manrope'),
    document.fonts.load('600 1em Manrope'),
    document.fonts.load('700 1em Manrope'),
    document.fonts.load('400 1em Yellowtail'),
  ]);
  Promise.race([ready, new Promise(resolve => setTimeout(resolve, 3000))])
    .finally(() => delete root.dataset.dsFontsLoading);
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
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
    // suppressHydrationWarning: os scripts abaixo marcam o <html> ANTES da
    // hidratação (de propósito, para não haver um quadro de animação solta
    // nem de fonte provisória). Sem isso o React acusa divergência.
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalFontCss }} />
        {FONT_FILES.map((f) => (
          <link
            key={f.file}
            rel="preload"
            as="font"
            type="font/woff2"
            href={`/fonts/${f.file}`}
            crossOrigin="anonymous"
          />
        ))}
        {/* Habilita a pausa do reveal antes da primeira pintura. Se este script
            não rodar, as animações simplesmente tocam no load — nunca o
            contrário, que deixaria blocos invisíveis. */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_READY_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: fontReadinessScript }} />
        {/* GTM com Consent Mode v2 (tudo negado até o aceite). O aviso de
            cookies é o <ConsentBanner>, no corpo. */}
        <script dangerouslySetInnerHTML={{ __html: gtmHeadSnippet(publicEnv.gtmId) }} />
      </head>
      <body className="bg-surface-warm font-sans text-base leading-normal text-text antialiased">
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
