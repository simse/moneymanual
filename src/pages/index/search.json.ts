import type { APIRoute } from "astro";
import { createIndex, type DataExtractor } from "../../lib/minisearch";

export const prerender = true;

const extractor: DataExtractor = (page) => {
	return [
		{
			id: page.id,
			title: page.data.title,
			description: page.data.description,
		},
	];
};

export const GET: APIRoute = async () => {
	const miniSearch = await createIndex(
		["title", "description"],
		["title", "description"],
		extractor,
	);

	return new Response(JSON.stringify(miniSearch), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
};
