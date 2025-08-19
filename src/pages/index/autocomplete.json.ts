import type { APIRoute } from "astro";
import { createIndex, type DataExtractor } from "../../lib/minisearch";

export const prerender = true;

const extractor: DataExtractor = (page) => {
	if (!page.data.searchPhrases) {
		return [];
	}

	return page.data.searchPhrases.map((phrase, idx) => ({
		id: `${page.id}-${idx}`,
		phrase,
	}));
};

export const GET: APIRoute = async () => {
	const miniSearch = await createIndex(["phrase"], ["phrase"], extractor);

	return new Response(JSON.stringify(miniSearch), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
};
