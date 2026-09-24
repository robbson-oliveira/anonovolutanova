import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Servidor autocontido para a imagem Docker; a Vercel ignora a opção.
  // O checkout vai precisar de servidor, então export estático não serve.
  output: "standalone",

  images: {
    // Capas e logo são PNG com canal alfa; formatos modernos preservam alfa.
    formats: ["image/avif", "image/webp"],
  },

  /*
   * O que este deploy publica é material de revisão: o design system e o
   * wireframe aprovado. O site comercial ainda não foi lançado, então a
   * raiz do deploy serve o wireframe aprovado (ver src/app/route.ts).
   */
  async redirects() {
    return [
      // Atalho: /wireframe abre a versão em revisão sem precisar do arquivo.
      {
        source: "/wireframe",
        destination: "/wireframe/wireframe-v2.html",
        permanent: false,
      },
    ];
  },

  async rewrites() {
    return [
      // O guia de estilo é um HTML estático; a URL curta continua valendo.
      { source: "/style-guide", destination: "/style-guide-agenda-2027.html" },
    ];
  },

  // O historico da prototipagem vive em old/ e nao entra no bundle.
  outputFileTracingExcludes: {
    "*": ["./old/**"],
  },
};

export default nextConfig;
