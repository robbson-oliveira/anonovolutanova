import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// The bundled CommonJS interop helper runs `createRequire(import.meta.url)` at
// module scope. In the serverless runtime `import.meta.url` is undefined, so
// every server-rendered page crashed before rendering. The helper is never
// actually used, so replace it with a lazy throwing stub.
const stripCreateRequire = {
  name: "strip-create-require",
  apply: "build" as const,
  enforce: "post" as const,
  renderChunk(code: string) {
    if (!code.includes("createRequire(import.meta.url)")) return null;
    return {
      code: code
        .replace(
          /import\s*\{\s*createRequire\s*\}\s*from\s*"node:module";?/g,
          "",
        )
        .replace(
          /createRequire\(import\.meta\.url\)/g,
          '((id) => { throw new Error("Dynamic require of " + id + " is not supported"); })',
        ),
      map: null,
    };
  },
};

export default defineConfig(({ command }) => ({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart(),
    react(),
    stripCreateRequire,
  ],
  resolve:
    command === "build"
      ? {
          // The serverless runtime has no Node streams renderer; use the edge
          // build of react-dom/server instead of the Node one.
          alias: [
            {
              find: /^react-dom\/server(\.node)?$/,
              replacement: "react-dom/server.edge",
            },
          ],
        }
      : undefined,
  // Production needs a self-contained server bundle. During development,
  // Vite must pre-bundle React's CommonJS entry instead of evaluating it as
  // raw ESM (which would leave the `module` global undefined).
  ssr: command === "build" ? { noExternal: true } : undefined,
}));