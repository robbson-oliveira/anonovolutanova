import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), tailwindcss(), tanstackStart(), react()],
  // The published Worker cannot resolve npm packages dynamically. Bundle the
  // complete SSR dependency graph so React and its renderer remain one copy.
  ssr: {
    noExternal: true,
  },
});