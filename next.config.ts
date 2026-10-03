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
         o Google e os links antigos ainda apontam. A compra agora é a seção
         #oferta da home. `/carrinho` and `/cart` are not here: the proxy
         decides at request time, since ANLN_PRECHECKOUT turns /carrinho into
         a page. */
      ...["/shop", "/loja", "/finalizacao-de-compra", "/finalizar-compra", "/checkout-2"].map(
        (source) => ({ source, destination: "/#oferta", permanent: true }),
      ),
      // A antiga página de compra deste site. A query (?edicao=) vai junto.
      { source: "/comprar", destination: "/#oferta", permanent: true },
      { source: "/produto/:slug*", destination: "/#oferta", permanent: true },
      { source: "/product/:slug*", destination: "/#oferta", permanent: true },
      { source: "/categoria-produto/:slug*", destination: "/#oferta", permanent: true },

      /* Conta de cliente, área de afiliado e conteúdos de divulgação continuam
         no WordPress (admin.anonovolutanova.com.br) por enquanto. O bridge
         precisa excluí-los do redirect para o site Next.js. */
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
