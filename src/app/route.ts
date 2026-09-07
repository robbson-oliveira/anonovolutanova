import { readFile } from "fs/promises";
import path from "path";

// Serve o wireframe estático (Framer export) como a rota raiz "/".
// O arquivo original em public/wireframe/wireframe-v2.html NÃO é alterado:
// apenas injetamos <base href="/wireframe/"> na resposta para que os
// assets relativos (assets/...) resolvam corretamente a partir de "/".
export const dynamic = "force-static";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "wireframe",
    "wireframe-v2.html"
  );
  let html = await readFile(filePath, "utf8");

  html = html.replace("<head>", '<head><base href="/wireframe/">');

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
