import { type CollectionEntry, getCollection } from "astro:content";
import { env } from "cloudflare:workers";
import MiniSearch from "minisearch";

type IndexType = "search" | "autocomplete";

const indexMap: Record<
	IndexType,
	{ instance: MiniSearch | null; file: string; fields: string[] }
> = {
	search: {
		instance: null,
		file: "search.json",
		fields: ["title", "description", "searchPhrases"],
	},
	autocomplete: {
		instance: null,
		file: "autocomplete.json",
		fields: ["phrase"],
	},
};

export const getIndex = async (type: IndexType, request: Request) => {
	const indexInfo = indexMap[type];

	if (!indexInfo.instance) {
		// In production the prebuilt indexes live in the Cloudflare ASSETS binding,
		// which only looks at the URL pathname. In dev the binding doesn't see Astro's
		// prerendered routes, so fall back to a plain fetch against the dev server.
		const indexUrl = new URL(`/index/${indexInfo.file}`, request.url);
		const indexResp = import.meta.env.DEV
			? await fetch(indexUrl)
			: await env.ASSETS.fetch(indexUrl);
		const index = await indexResp.text();
		indexInfo.instance = MiniSearch.loadJSON(index, {
			fields: indexInfo.fields,
		});
	}

	return indexInfo.instance;
};

export type IndexDocument = { id: string };

export type DataExtractor<T extends IndexDocument> = (
	page: CollectionEntry<"pages">,
) => T[];

export const createIndex = async <T extends IndexDocument>(
	fields: string[],
	storeFields: string[],
	dataExtractor: DataExtractor<T>,
) => {
	const pages = await getCollection("pages");

	const miniSearch = new MiniSearch<T>({
		fields,
		storeFields,
	});

	const documents: T[] = [];

	for (const page of pages) {
		documents.push(...dataExtractor(page));
	}

	miniSearch.addAll(documents);

	return miniSearch;
};
