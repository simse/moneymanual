import { type CollectionEntry, getCollection } from "astro:content";
import MiniSearch from "minisearch";

type IndexType = "search" | "autocomplete";

const indexMap: Record<
	IndexType,
	{ instance: MiniSearch | null; file: string; fields: string[] }
> = {
	search: {
		instance: null,
		file: "search.json",
		fields: ["title", "description"],
	},
	autocomplete: {
		instance: null,
		file: "autocomplete.json",
		fields: ["phrase"],
	},
};

export const getIndex = async (locals: App.Locals, type: IndexType) => {
	const indexInfo = indexMap[type];

	if (!indexInfo.instance) {
		const { ASSETS } = locals.runtime.env;
		const indexResp = await ASSETS.fetch(
			`https://assets.local/index/${indexInfo.file}`,
		);
		const index = await indexResp.text();
		indexInfo.instance = MiniSearch.loadJSON(index, {
			fields: indexInfo.fields,
		});
	}

	return indexInfo.instance;
};

export type DataExtractor = (
	page: CollectionEntry<"pages">,
) => { id: string; [key: string]: any }[];

export const createIndex = async (
	fields: string[],
	storeFields: string[],
	dataExtractor: DataExtractor,
) => {
	const pages = await getCollection("pages");

	const miniSearch = new MiniSearch({
		fields,
		storeFields,
	});

	const documents: { id: string; [key: string]: any }[] = [];

	for (const page of pages) {
		documents.push(...dataExtractor(page));
	}

	miniSearch.addAll(documents);

	return miniSearch;
};
