import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

import Markdown from "vite-plugin-react-markdown";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Markdown({
      wrapperComponent: { Callout: "src/views/docs/components/Callout.jsx" },

      wrapperComponentPath: "src/views/docs/DocsWrapper",
    }),
    react({
      include: [/\.tsx$/, /\.md$/], // <-- add .md
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
