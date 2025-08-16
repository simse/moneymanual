// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import Icons from 'unplugin-icons/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://moneymanual.co.uk',
  output: 'static',
  integrations: [
    svelte(),
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [
      tailwindcss(),
      Icons({
        compiler: 'astro',
      }),
    ],
  },
  adapter: cloudflare({
    imageService: 'compile'
  })
});
