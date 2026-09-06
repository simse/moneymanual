import type { APIRoute } from "astro";
import { autocomplete, search } from "./search";

export const searchRoute = (kind: "search" | "autocomplete"): APIRoute => {
  return async ({ url, request }) => {
    const query = url.searchParams.get("query");

    if (!query) {
      return Response.json(
        { error: "Missing query parameter" },
        { status: 400 },
      );
    }

    try {
      const results = await (kind === "search" ? search : autocomplete)(
        query,
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
};
