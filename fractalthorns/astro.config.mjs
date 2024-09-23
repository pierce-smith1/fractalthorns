import { defineConfig } from 'astro/config';
import node from "@astrojs/node";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "middleware"
  }),
  integrations: [svelte()],
  markdown: {
    smartypants: false
  },
  vite: {
    ssr: {
        noExternal: ['path-to-regexp'],
    },
  },
});