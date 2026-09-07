import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import "../app/globals.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [
      // Fontes locais pré-carregadas: a página já pinta com a fonte final.
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/manrope-latin-400-normal.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/manrope-latin-500-normal.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/manrope-latin-600-normal.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/manrope-latin-700-normal.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/yellowtail-latin-400-normal.woff2",
        crossOrigin: "anonymous",
      },
    ],
  }),
  component: Outlet,
  shellComponent: RootDocument,
});

/* Crítico e inline: as declarações de fonte entram no HTML inicial,
   antes de qualquer folha de estilo, então o texto já pinta em Manrope. */
const criticalFontCss = `
@font-face{font-family:"Manrope";font-style:normal;font-weight:400;font-display:block;src:url("/fonts/manrope-latin-400-normal.woff2") format("woff2")}
@font-face{font-family:"Manrope";font-style:normal;font-weight:500;font-display:block;src:url("/fonts/manrope-latin-500-normal.woff2") format("woff2")}
@font-face{font-family:"Manrope";font-style:normal;font-weight:600;font-display:block;src:url("/fonts/manrope-latin-600-normal.woff2") format("woff2")}
@font-face{font-family:"Manrope";font-style:normal;font-weight:700;font-display:block;src:url("/fonts/manrope-latin-700-normal.woff2") format("woff2")}
@font-face{font-family:"Yellowtail";font-style:normal;font-weight:400;font-display:block;src:url("/fonts/yellowtail-latin-400-normal.woff2") format("woff2")}
:root{--font-manrope:"Manrope";--font-yellowtail:"Yellowtail";--font-sans:"Manrope",ui-sans-serif,system-ui,sans-serif;--font-script:"Yellowtail",ui-serif,cursive}
html,body{font-family:"Manrope",ui-sans-serif,system-ui,sans-serif}
html[data-ds-fonts-loading] body{visibility:hidden}
`;

/* Em uma abertura sem cache, o catálogo só fica visível quando as duas famílias
   locais estão prontas. Isso evita que qualquer fonte provisória seja pintada. */
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

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-reveal-ready="" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalFontCss }} />
        <script dangerouslySetInnerHTML={{ __html: fontReadinessScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
