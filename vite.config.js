import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ jsxRuntime: "automatic" }), dts({ tsconfigPath: "./tsconfig.app.json", rollupTypes: true })],
  build: {
    copyPublicDir: false,
    lib: {
      entry: "src/index.tsx",
      name: "AnimatedText",
      formats: ["es"],
      fileName: (format) => `animated-cubes.${format}.js`,
    },
    rollupOptions: {
      // Externalize React to avoid bundling it
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
