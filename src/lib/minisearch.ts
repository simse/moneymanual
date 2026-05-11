import { env } from "cloudflare:workers";
import MiniSearch from "minisearch";
import { entriesForLocale, type PageEntry } from "./content";
import type { Locale } from "./i18n/locales";

type IndexType = "search" | "autocomplete";

type IndexKey = `${IndexType}-${Locale}`;

type IndexInfo = {
	instance: MiniSearch | null;
	file: string;
	fields: string[];
};

const indexMap: Record<IndexKey, IndexInfo> = {
	"search-en-gb": {
		instance: null,
		file: "en-gb/search.json",
		fields: ["title", "description", "searchPhrases"],
	},
	"search-cy": {
		instance: null,
		file: "cy/search.json",
		fields: ["title", "description", "searchPhrases"],
	},
	"autocomplete-en-gb": {
		instance: null,
		file: "en-gb/autocomplete.json",
		fields: ["phrase"],
	},
	"autocomplete-cy": {
		instance: null,
		file: "cy/autocomplete.json",
		fields: ["phrase"],
	},
	"search-sco": {
		instance: null,
		file: "sco/search.json",
		fields: ["title", "description", "searchPhrases"],
	},
	"autocomplete-sco": {
		instance: null,
		file: "sco/autocomplete.json",
		fields: ["phrase"],
	},
};

export const getIndex = async (
	type: IndexType,
	locale: Locale,
	request: Request,
) => {
	const key: IndexKey = `${type}-${locale}`;
	const indexInfo = indexMap[key];

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

export type DataExtractor<T extends IndexDocument> = (page: PageEntry) => T[];

export const createIndex = async <T extends IndexDocument>(
	locale: Locale,
	fields: string[],
	storeFields: string[],
	dataExtractor: DataExtractor<T>,
) => {
	const pages = await entriesForLocale(locale);

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
