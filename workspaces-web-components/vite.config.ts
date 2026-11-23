import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tsconfigPaths from "vite-tsconfig-paths";
import { rmSync } from "fs";

rmSync("dist", { recursive: true, force: true });

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      external: [],
    },
  },
  plugins: [
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: "./node_modules/@interopio/workspaces-ui-web-components/dist/styles/*",
          dest: "styles"
        },
      ]
    })
  ]
});
