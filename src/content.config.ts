import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { ICON_KEYS } from "./lib/glossary-icons";
import { TOPIC_IDS } from "./lib/glossary-topics";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.coerce.date(),
    lastChangedDate: z.coerce.date(),
    type: z.enum(["section", "page"]).default("page"),
    sortOrderHint: z.number().default(0),
    searchPhrases: z.array(z.string()).optional(),
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/glossary" }),
  schema: z.object({
    term: z.string(),
    name: z.string().optional(),
    short: z.string().optional(),
    topic: z.enum(TOPIC_IDS),
    prominentLinks: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          href: z.string(),
          icon: z.enum(ICON_KEYS).optional(),
        }),
      )
      .optional(),
    lastChangedDate: z.coerce.date(),
  }),
});

export const collections = { pages, glossary };
