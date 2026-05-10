// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import Icons from "unplugin-icons/vite";
import sitemap from "@astrojs/sitemap";
import favicons from "astro-favicons";

// https://astro.build/config
export default defineConfig({
  site: "https://moneymanual.co.uk",
  output: "static",
  integrations: [svelte(), mdx(), sitemap(), favicons()],
  compressHTML: true,
  vite: {
    plugins: [
      tailwindcss(),
      Icons({
        compiler: "svelte",
      }),
    ],
    optimizeDeps: {
      exclude: ["astro-favicons"],
    },
    ssr: {
      optimizeDeps: {
        exclude: ["astro-favicons"],
      },
    },
  },
  adapter: cloudflare({
    imageService: "cloudflare-binding",
  }),
  session: {
    ttl: 60 * 60 * 24 * 30,
  },
  experimental: {
    contentIntellisense: true,
  },
});
