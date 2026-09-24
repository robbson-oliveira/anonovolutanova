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

      /* URLs do site antigo (WordPress/Elementor/WooCommerce) que o wireframe,
         o Google e os links antigos ainda apontam. A loja agora é /comprar. */
      ...["/shop", "/loja", "/carrinho", "/cart", "/finalizacao-de-compra", "/finalizar-compra", "/checkout-2"].map(
        (source) => ({ source, destination: "/comprar", permanent: true }),
      ),
      { source: "/produto/:slug*", destination: "/comprar", permanent: true },
      { source: "/product/:slug*", destination: "/comprar", permanent: true },
      { source: "/categoria-produto/:slug*", destination: "/comprar", permanent: true },

      /* Sem conta de cliente (D6) e sem AffiliateWP (D7). Temporários: a
         página do programa de afiliadas por cupom ainda vai existir. Lista
         tirada do sitemap público do WordPress em 24/09/2026. */
      ...[
        "/my-account/:path*",
        "/minha-conta/:path*",
        "/area-afiliado/:path*",
        "/affiliate-login/:path*",
        "/registro-de-afiliados/:path*",
        "/conteudos-para-divulgacao/:path*",
        "/obrigado-pelo-seu-registro/:path*",
      ].map((source) => ({ source, destination: "/contato", permanent: false })),
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
