import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    ignores: [
      // Historico da prototipagem e o espelho do wireframe: ~120 MB que nao
      // sao codigo do app e so fariam o lint e o TS varrerem a toa.
      "old/**",
      "wireframe_site_2027/**",
      ".next/**",
      "node_modules/**",
    ],
  },

  /* ---------------------------------------------------------------------
     A regra que transforma o requisito de troca de paleta em erro de build.
     Ficou decidido que nenhuma cor pode estar escrita dentro de componente:
     toda cor vem de token semântico. Sem isso, o requisito seria só
     recomendação — e um `bg-[#9d4f23]` esquecido quebraria a troca inteira.
     --------------------------------------------------------------------- */
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
          message:
            "Cor literal em componente. Use um token semântico de src/ds/styles/tokens.css (ex.: text-accent, bg-surface).",
        },
        {
          selector: "Literal[value=/\\brgba?\\(/]",
          message:
            "Cor literal em componente. Use um token semântico de src/ds/styles/tokens.css.",
        },
        {
          selector: "Literal[value=/-\\[#/]",
          message:
            "Valor arbitrário de cor no Tailwind. Use a escala de tokens (bg-surface, text-muted, border-border).",
        },
      ],
    },
  },
];

export default eslintConfig;
