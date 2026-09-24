import { readFile } from "fs/promises";
import path from "path";
import { PRODUCT_NAME } from "@content/product";

// Serve o wireframe estático (Framer export) como a rota raiz "/".
// O arquivo original em public/wireframe/wireframe-v2.html NÃO é alterado:
// tudo o que muda entra só na resposta —
//   - <base href="/wireframe/"> para os assets relativos (assets/...)
//     resolverem a partir de "/";
//   - título, descrição e Open Graph, que o export do Framer não traz.
export const dynamic = "force-static";

const DESCRIPTION =
  "Agenda católica 2027 para organizar o cotidiano com fé e propósito.";

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

const HEAD_TAGS = [
  '<base href="/wireframe/">',
  `<meta name="description" content="${escapeAttr(DESCRIPTION)}">`,
  `<meta property="og:title" content="${escapeAttr(PRODUCT_NAME)}">`,
  `<meta property="og:description" content="${escapeAttr(DESCRIPTION)}">`,
  '<meta property="og:type" content="website">',
  '<meta name="twitter:card" content="summary_large_image">',
].join("");

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "wireframe",
    "wireframe-v2.html"
  );
  let html = await readFile(filePath, "utf8");

  html = html
    .replace("<head>", `<head>${HEAD_TAGS}`)
    .replace(/<title>[^<]*<\/title>/, `<title>${PRODUCT_NAME}</title>`);

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
