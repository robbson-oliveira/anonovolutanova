import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => ({
  plugins: [tsconfigPaths(), tailwindcss(), tanstackStart(), react()],
  // Production needs a self-contained server bundle. During development,
  // Vite must pre-bundle React's CommonJS entry instead of evaluating it as
  // raw ESM (which would leave the `module` global undefined).
  ssr: command === "build" ? { noExternal: true } : undefined,
}));