import { publicEnv } from "@/lib/env";

/**
 * Páginas institucionais (termos, privacidade) continuam sendo editadas no
 * WordPress. O Next lê pela REST (`wp/v2/pages`) e guarda por uma hora; se o
 * WordPress não responder, a página mostra um aviso com os contatos em vez de
 * quebrar, e a próxima revalidação tenta de novo.
 */

export type WpPage = {
  title: string;
  html: string;
  modified: string;
};

const REVALIDATE_SECONDS = 60 * 60;

export async function getWpPage(slug: string): Promise<WpPage | null> {
  const url =
    `${publicEnv.wpUrl}/wp-json/wp/v2/pages` +
    `?slug=${encodeURIComponent(slug)}&_fields=title,content,modified`;

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;

    const pages = (await res.json()) as Array<{
      title: { rendered: string };
      content: { rendered: string };
      modified: string;
    }>;
    const page = pages[0];
    if (!page) return null;

    return {
      title: decodeEntities(page.title.rendered),
      html: sanitizeWpHtml(page.content.rendered),
      modified: page.modified,
    };
  } catch {
    return null;
  }
}

/* -----------------------------------------------------------------------------
   O conteúdo vem do Elementor: parágrafos e títulos embrulhados em várias
   camadas de <div> com classes e estilos próprios. Aqui fica só a estrutura
   do texto, que o DS estiliza. O conteúdo é da própria marca (editado no
   wp-admin), mas mesmo assim nada executável ou com atributo passa.
   -------------------------------------------------------------------------- */

const ALLOWED_TAGS = new Set([
  "h2", "h3", "h4", "p", "ul", "ol", "li", "strong", "b", "em", "i", "a", "br",
]);

function sanitizeWpHtml(html: string): string {
  return (
    html
      // Blocos que não são texto somem inteiros, com o conteúdo.
      .replace(/<(script|style|noscript|iframe|svg|form)\b[\s\S]*?<\/\1>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      // Link sem destino seguro (o Elementor gera <a> sem href) vira só texto.
      .replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (whole, attrs: string, inner: string) =>
        safeHref(attrs) ? whole : inner,
      )
      // Títulos do Elementor chegam como h1..h6; o h1 da página é nosso.
      .replace(/<(\/?)h1\b/gi, "<$1h2")
      .replace(/<(\/?)h[56]\b/gi, "<$1h4")
      .replace(/<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi, (tag, name: string, attrs: string) => {
        const lower = name.toLowerCase();
        if (!ALLOWED_TAGS.has(lower)) return "";
        if (tag.startsWith("</")) return `</${lower}>`;
        if (lower === "a") {
          const href = safeHref(attrs);
          return href ? `<a href="${href.replace(/"/g, "&quot;")}">` : "";
        }
        return `<${lower}>`;
      })
      // Parágrafos vazios que o Elementor usa como espaçador.
      .replace(/<p>(\s|&nbsp;)*<\/p>/gi, "")
      .replace(/\n{2,}/g, "\n")
      .trim()
  );
}

/** O href do atributo, se for de um esquema seguro; senão, null. */
function safeHref(attrs: string): string | null {
  const href = /href\s*=\s*["']([^"']*)["']/i.exec(attrs)?.[1]?.trim();
  if (!href) return null;
  return /^(https?:|mailto:|tel:|\/|#.)/i.test(href) ? href : null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}
