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
  site: "https://moneymanual.org.uk",
  output: "server",
  i18n: {
    defaultLocale: "en-gb",
    locales: ["en-gb", "cy"],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
      fallbackType: "redirect",
    },
  },
  integrations: [
    svelte(),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: "en-gb",
        locales: { "en-gb": "en-GB", cy: "cy" },
      },
    }),
    favicons(),
  ],
  compressHTML: true,
  devToolbar: { enabled: false },
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
