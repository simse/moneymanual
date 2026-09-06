// @ts-check
import { loadEnv } from "vite";
import { validateEnvVariable } from "astro/env/runtime";
import { envSchema } from "./env.schema.mjs";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import Icons from "unplugin-icons/vite";
import favicons from "astro-favicons";

const site = validateEnvVariable(
  loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "").SITE_URL,
  envSchema.SITE_URL,
);

if (!site.ok || typeof site.value !== "string") {
  throw new Error("Invalid SITE_URL: expected a URL");
}

// https://astro.build/config
export default defineConfig({
  site: site.value,
  env: { schema: envSchema },
  output: "server",
  integrations: [svelte(), mdx(), favicons()],
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
        exclude: ["astro-favicons", "@astrojs/svelte/server.js"],
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
