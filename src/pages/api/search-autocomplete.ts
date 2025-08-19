import type { APIRoute } from "astro";
import { getIndex } from "../../lib/minisearch";

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
	const query = url.searchParams.get("query");

	if (!query) {
		return new Response(JSON.stringify({ error: "Missing query parameter" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const index = await getIndex(locals, "autocomplete");
	const results = index.search(query, { prefix: true });

	return new Response(JSON.stringify(results), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
