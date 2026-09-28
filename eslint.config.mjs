/*
 * Flat config nativo do eslint-config-next 16 (o `next lint` e o FlatCompat
 * saíram no Next 16; `npm run lint` chama o ESLint direto).
 */
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

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

  /* ---------------------------------------------------------------------
     DÉBITO CONHECIDO — cores literais escritas na fase Lovable (07/09),
     quando o lint não rodava. São 55 ocorrências nestes arquivos, várias
     com cores que ainda não existem como token (degradês do fechamento e da
     oferta, cinzas do rodapé). Tokenizá-las muda o tokens.css e precisa de
     conferência visual — é trabalho próprio, não efeito da volta ao Next.

     Aqui a regra cai para aviso SÓ nestes arquivos, para o débito continuar
     visível sem travar o lint. Qualquer arquivo novo (o checkout inclusive)
     segue com a regra como erro. Ao tokenizar um arquivo, tire-o da lista.
     --------------------------------------------------------------------- */
  {
    files: [
      "src/app/design-system/lacunas/page.tsx",
      "src/sections/About.tsx",
      "src/sections/Closing.tsx",
      "src/sections/Offer.tsx",
      "src/sections/Persona.tsx",
    ],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
          message: "Cor literal (débito da fase Lovable). Tokenizar em src/ds/styles/tokens.css.",
        },
        {
          selector: "Literal[value=/\\brgba?\\(/]",
          message: "Cor literal (débito da fase Lovable). Tokenizar em src/ds/styles/tokens.css.",
        },
        {
          selector: "Literal[value=/-\\[#/]",
          message: "Cor literal (débito da fase Lovable). Tokenizar em src/ds/styles/tokens.css.",
        },
      ],
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
