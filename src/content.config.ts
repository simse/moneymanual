import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.coerce.date(),
    lastChangedDate: z.coerce.date(),
    type: z.enum([
      'section',
      'page'
    ]).default('page'),
    sortOrderHint: z.number().default(0),
  })
});

export const collections = { pages };
