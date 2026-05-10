import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

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

export const collections = { pages };
