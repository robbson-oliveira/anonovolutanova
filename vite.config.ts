import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), tailwindcss(), tanstackStart(), react()],
  // The published runtime cannot resolve npm packages dynamically. Keep the
  // React runtime inside the server bundle instead of emitting bare imports.
  ssr: {
    noExternal: ["react", "react-dom", "scheduler"],
  },
});