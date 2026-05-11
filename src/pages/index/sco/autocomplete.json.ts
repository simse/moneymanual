import type { APIRoute } from "astro";
import { createIndex, type DataExtractor } from "../../../lib/minisearch";

export const prerender = true;

type AutocompleteDoc = {
	id: string;
	phrase: string;
};

const extractor: DataExtractor<AutocompleteDoc> = (page) => {
	if (!page.data.searchPhrases) {
		return [];
	}

	return page.data.searchPhrases.map((phrase, idx) => ({
		id: `${page.id}-${idx}`,
		phrase,
	}));
};

export const GET: APIRoute = async () => {
	const miniSearch = await createIndex(
		"sco",
		["phrase"],
		["phrase"],
		extractor,
	);

	return new Response(JSON.stringify(miniSearch), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
};
