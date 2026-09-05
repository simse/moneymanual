import type { APIRoute } from "astro";
import type { Locale } from "./i18n/locales";
import { autocomplete, search } from "./search";

export function searchRoute(
	kind: "search" | "autocomplete",
	locale: Locale,
): APIRoute {
	return async ({ url, request }) => {
		const query = url.searchParams.get("query");
		if (!query)
			return Response.json(
				{ error: "Missing query parameter" },
				{ status: 400 },
			);
		try {
			const results = await (kind === "search" ? search : autocomplete)(
				query,
				locale,
				request,
			);
			return Response.json(results);
		} catch {
			return Response.json(
				{ error: "Search is temporarily unavailable" },
				{ status: 503 },
			);
		}
	};
}
