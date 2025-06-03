import {defineConfig} from 'astro/config';
import node from "@astrojs/node";

import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
    output: "server",
    adapter: node({
        mode: "standalone"
    }),
    integrations: [svelte()],
    markdown: {
        smartypants: false
    },
    vite: {
        ssr: {
            noExternal: ['path-to-regexp'],
        },
        plugins: [
            obfuscatorPlugin({
                include: [/_content.+/],
                options: {
                    splitStrings: true,
                    stringArray: true,
                    deadCodeInjection: true,
                    stringArrayEncoding: ["base64"],
                    transformObjectKeys: true,
                    stringArrayThreshold: 1,
                },
            }),
        ],
    },
});