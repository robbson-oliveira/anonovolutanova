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
html,body{font-family:"Manrope",system-ui,sans-serif}
`;

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-reveal-ready="">
      <head>
        <HeadContent />
        <style dangerouslySetInnerHTML={{ __html: criticalFontCss }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
