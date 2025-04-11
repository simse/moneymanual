// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import Icons from 'unplugin-icons/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [svelte(), mdx()],
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
