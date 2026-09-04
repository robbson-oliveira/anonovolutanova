import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Capas e logo são PNG com canal alfa; formatos modernos preservam alfa.
    formats: ["image/avif", "image/webp"],
  },
  // O export estático do Framer (wireframe_old.html, design-system.html) e a
  // pasta assets/ continuam na raiz apenas como referência visual. Não fazem
  // parte do build.
  outputFileTracingExcludes: {
    "*": ["./assets/**", "./backups/**", "./imagens 2027/**"],
  },
};

export default nextConfig;
