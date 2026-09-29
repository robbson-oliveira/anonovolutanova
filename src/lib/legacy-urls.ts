/**
 * URLs do WordPress antigo que não têm equivalente e devem sair do Google.
 *
 * Tiradas do sitemap público de anonovolutanova.com.br em 24/09/2026: posts e
 * categorias de demonstração do tema (plantas), o arquivo do autor, blocos
 * estáticos do tema e páginas avulsas. Respondem 410 (removido de vez), que
 * tira a página do índice mais rápido que um 404 — e não redirecionam para a
 * home, o que o Google trataria como "soft 404".
 *
 * As URLs que têm equivalente (loja, produto, contato, afiliadas…) são
 * redirecionadas em next.config.ts.
 */

const GONE_PREFIXES = ["/category/", "/author/", "/staticblocks/", "/blog/"];

const GONE_PATHS = new Set([
  "/blog",
  "/hello-world",
  "/em-construcao",
  "/relatorio-ads-001",
  "/plant-parenthood-a-beginners-guide-to-caring-for-indoor-plants",
  "/plant-parenthood-a-beginners-guide-tocaring-for-indoor-plants",
  "/the-ultimate-guide-to-indoor-plant-caremost-exaggeration-tips",
  "/reviving-wilting-wonders-a-guides-toplants-rehabilitations",
  "/exploring-the-world-of-succulent-plantswhich-make-environment",
  "/top-9-trending-plants-for-modern-homecreating-oxygen-air-purify",
  "/the-zen-zone-creating-a-relaxingambiance-with-indoor-plants",
  "/the-ultimate-guide-to-choosing-plantsenvironments-more-cleaner",
  "/transforming-small-spaces-with-biggreenery-best-plants-for-apartments",
  "/uncovering-the-secret-of-purifying-plantbeehives-shelves-more-useful",
]);

export function isGone(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return GONE_PATHS.has(path) || GONE_PREFIXES.some((p) => `${path}/`.startsWith(p));
}

export const GONE_HTML = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Página removida · Agenda Ano Novo, Luta Nova</title></head>
<body style="font-family:system-ui,sans-serif;max-width:560px;margin:80px auto;padding:0 16px;line-height:1.5">
<h1>Esta página não existe mais</h1>
<p>Conheça a <a href="/">Agenda Ano Novo, Luta Nova 2027</a>.</p></body></html>`;
