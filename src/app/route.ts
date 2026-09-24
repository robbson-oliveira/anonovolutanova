import { readFile } from "fs/promises";
import path from "path";
import { CHECKOUT_URL, PRODUCT_NAME } from "@content/product";

// Serve o wireframe estático (Framer export) como a rota raiz "/".
// O arquivo original em public/wireframe/wireframe-v2.html NÃO é alterado:
// tudo o que muda entra só na resposta —
//   - caminhos dos assets (assets/...) absolutos em /wireframe/assets/,
//     sem <base> (ver RELATIVE_ASSET);
//   - título, descrição e Open Graph, que o export do Framer não traz;
//   - links do site antigo (WordPress) trocados pelas páginas deste site;
//   - os botões de compra levando a /comprar na mesma aba.
export const dynamic = "force-static";

const DESCRIPTION =
  "Agenda católica 2027 para organizar o cotidiano com fé e propósito.";

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

/* -----------------------------------------------------------------------------
   Links do site antigo. Aparecem tanto no HTML quanto nos dados do bundle do
   Framer (que re-renderiza os links na hidratação), então a troca é textual
   no documento inteiro.
   -------------------------------------------------------------------------- */
const OLD_SITE = "https://anonovolutanova.com.br";

const LINK_REWRITES: Array<[string, string]> = [
  // Compra: o botão da oferta mandava para o carrinho do WooCommerce (produto
  // 2026, id 19). Os redirects do next.config cobrem as mesmas URLs.
  [`${OLD_SITE}/shop/?add-to-cart=19`, CHECKOUT_URL],
  [`${OLD_SITE}/finalizacao-de-compra/?add-to-cart=19`, CHECKOUT_URL],
  [`${OLD_SITE}/contato/`, "/contato"],
  [`${OLD_SITE}/termos-e-condicoes/`, "/termos-e-condicoes"],
  [`${OLD_SITE}/politica-de-privacidade/`, "/politica-de-privacidade"],
  // Sem AffiliateWP nem conta de cliente: caem nos redirects para /contato.
  [`${OLD_SITE}/area-afiliado/programa-de-afiliados/`, "/area-afiliado/programa-de-afiliados"],
  [`${OLD_SITE}/affiliate-login/`, "/affiliate-login"],
  [`${OLD_SITE}/my-account/`, "/my-account"],
];

/**
 * O snapshot do wireframe traz um mapa (`data-offline-resolve`) que troca
 * URLs por cópias salvas em assets/*_file.html — inclusive as páginas do site
 * antigo, que abririam as versões congeladas do WordPress. Essas entradas
 * saem do mapa; as de imagens, fontes e scripts ficam.
 */
const OLD_PAGE_SNAPSHOTS = /"https:\/\/anonovolutanova\.com\.br\/[^"]*": "assets\/[^"]*_file\.html",? ?/g;

/**
 * Os botões de compra da seção de oferta são um componente de código do
 * Framer que abre uma aba nova com "Carregando…" e, 2s depois, a URL de
 * compra. Isso fazia sentido para o carrinho externo do WordPress; para uma
 * página deste site, a mesma aba é o comportamento certo.
 *
 * O clique é capturado na `window`, antes do React do Framer. Só entram
 * <button> com o rótulo de compra: os <a href="./#price"> com o mesmo texto
 * (topo e cabeçalho) continuam rolando até a oferta, como no design aprovado.
 */
const BUY_BUTTON_SCRIPT = `
(function () {
  var LABELS = ["Garantir minha Agenda 2027", "Comprar Agora", "Comprar"];
  window.addEventListener("click", function (ev) {
    var t = ev.target;
    var btn = t && t.closest ? t.closest("button") : null;
    if (!btn || btn.closest("a")) return;
    var label = (btn.textContent || "").replace(/\\s+/g, " ").trim();
    if (LABELS.indexOf(label) === -1) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    window.location.assign(${JSON.stringify(CHECKOUT_URL)});
  }, true);
})();
`;

/**
 * Os assets do snapshot são referenciados como relativos ("assets/x.png") e
 * vivem em /wireframe/assets/. Antes isso era resolvido com um
 * <base href="/wireframe/">, mas o <base> também desvia as âncoras: o
 * "./#price" dos botões do topo virava /wireframe/#price e tirava a pessoa da
 * home em vez de rolar até a oferta. Então os caminhos viram absolutos, e as
 * âncoras continuam resolvendo contra "/".
 *
 * Cobre atributos e url() ("assets/, 'assets/), listas de srcset
 * (", assets/") e as chaves do import map do snapshot ('assets/' + fn).
 * Não toca em ".../assets/" de URLs do Framer nem em "third-party-assets/".
 */
const RELATIVE_ASSET = /(["' ])assets\//g;

const HEAD_TAGS = [
  `<meta name="description" content="${escapeAttr(DESCRIPTION)}">`,
  `<meta property="og:title" content="${escapeAttr(PRODUCT_NAME)}">`,
  `<meta property="og:description" content="${escapeAttr(DESCRIPTION)}">`,
  '<meta property="og:type" content="website">',
  '<meta name="twitter:card" content="summary_large_image">',
  `<script>${BUY_BUTTON_SCRIPT}</script>`,
].join("");

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "wireframe",
    "wireframe-v2.html"
  );
  let html = await readFile(filePath, "utf8");

  html = html.replace(OLD_PAGE_SNAPSHOTS, "");
  html = html.replace(RELATIVE_ASSET, "$1/wireframe/assets/");
  for (const [from, to] of LINK_REWRITES) html = html.split(from).join(to);

  html = html
    .replace("<head>", `<head>${HEAD_TAGS}`)
    .replace(/<title>[^<]*<\/title>/, `<title>${PRODUCT_NAME}</title>`);

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
