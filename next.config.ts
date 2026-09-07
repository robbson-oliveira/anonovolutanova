import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(process.env.NEXT_EXPORT ? { output: "export" as const, distDir: "dist", images: { unoptimized: true } } : {}),
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

  // O historico da prototipagem vive em old/ e nao entra no bundle.
  outputFileTracingExcludes: {
    "*": ["./old/**"],
  },
};

export default nextConfig;
