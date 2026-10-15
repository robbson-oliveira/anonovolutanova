/*
 * Flat config nativo do eslint-config-next 16 (o `next lint` e o FlatCompat
 * saíram no Next 16; `npm run lint` chama o ESLint direto).
 */
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const PALETTE =
  "(white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)";
const UTILITIES =
  "(bg|text|border|fill|stroke|from|via|to|ring|outline|shadow|decoration|divide|accent|caret|placeholder)";

const COLOR_RULES = [
  {
    selector: String.raw`Literal[value=/#[0-9a-fA-F]{3,8}\b/]`,
    message:
      "Cor literal em componente. Use um token semântico de src/ds/styles/tokens.css (ex.: text-accent, bg-surface).",
  },
  {
    // Sem \b antes de "rgb": em classes como `shadow-[0_4px_8px_rgb(...)]`
    // o "_" conta como letra e a fronteira de palavra não existe.
    selector: String.raw`Literal[value=/rgba?\(/]`,
    message: "Cor literal em componente. Use um token semântico de src/ds/styles/tokens.css.",
  },
  {
    selector: String.raw`TemplateElement[value.raw=/#[0-9a-fA-F]{6}\b|rgba?\(/]`,
    message: "Cor literal em template string. Use um token semântico de src/ds/styles/tokens.css.",
  },
  {
    selector: String.raw`Literal[value=/-\[#/]`,
    message:
      "Valor arbitrário de cor no Tailwind. Use a escala de tokens (bg-surface, text-muted, border-border).",
  },
  {
    selector: String.raw`Literal[value=/(^|[\s:])${UTILITIES}-${PALETTE}(-\d{2,3})?\b/]`,
    message:
      "Cor da paleta padrão do Tailwind. Use um token semântico (text-text-on-inverse, bg-surface-inverse...).",
  },
];

const eslintConfig = [
  {
    ignores: [
      // Historico da prototipagem e o espelho do wireframe: ~120 MB que nao
      // sao codigo do app e so fariam o lint e o TS varrerem a toa.
      "old/**",
      "wireframe_site_2027/**",
      "public/**",
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },

  ...nextCoreWebVitals,
  ...nextTypescript,

  /* ---------------------------------------------------------------------
     A regra que transforma o requisito de troca de paleta em erro de build.
     Ficou decidido que nenhuma cor pode estar escrita dentro de componente:
     toda cor vem de token semântico. Sem isso, o requisito seria só
     recomendação — e um `bg-[#9d4f23]` esquecido quebraria a troca inteira.

     Pega hex e rgb() em strings e em template strings (classes montadas com
     crase), valores arbitrários `-[#...]` e as cores nomeadas da paleta
     padrão do Tailwind (`text-white`, `bg-slate-800`...), que também
     ficariam de fora de uma troca de paleta.
     --------------------------------------------------------------------- */
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": ["error", ...COLOR_RULES],
    },
  },

  /* O laboratório da animação do hero (/lab/hero-animation) é um painel de
     ajuste para quem desenvolve, com a própria interface escura de
     ferramenta; não faz parte do site nem da paleta da marca. */
  {
    files: ["src/app/lab/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },

  /* O eslint-plugin-react-hooks v6 (novo no Next 16) traz a análise estática
     do React Compiler como erro. `set-state-in-effect` acusa 5 pontos que já
     existiam (Reveal, laboratório, métricas do DS) e que funcionam — refatorar
     é trabalho à parte. Rebaixado a aviso, como no storefront. */
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
