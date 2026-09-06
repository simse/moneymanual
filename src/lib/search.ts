import * as env from "astro:env/server";
import { getPageEntry, parseEntryId, urlPathForEntry } from "./content";
import { getIndex } from "./minisearch";
import type {
  AutocompleteResult,
  SearchResponse,
  SearchResult,
} from "./search-results";
import { searchTypesense } from "./typesense";

const withFallback = async <T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> => {
  try {
    return await primary();
  } catch {
    console.warn("Typesense search failed; using MiniSearch");
    return fallback();
  }
};

export const search = (
  query: string,
  request: Request,
): Promise<SearchResponse<SearchResult>> => {
  return withFallback(
    () => searchTypesense("search", query, env),
    async () => {
      const index = await getIndex("search", request);

      const results = await Promise.all(
        index.search(query).map(async (hit): Promise<SearchResult | null> => {
          const parsed = parseEntryId(String(hit.id));

          if (!parsed) {
            return null;
          }

          const entry = await getPageEntry(
            parsed.isSection ? parsed.topic : `${parsed.topic}/${parsed.rest}`,
          );

          if (!entry) {
            return null;
          }

          return {
            title: entry.data.title,
            description: entry.data.description,
            url: urlPathForEntry(entry),
          };
        }),
      );

      return {
        provider: "minisearch",
        results: results.filter(
          (result): result is SearchResult => result !== null,
        ),
      };
    },
  );
};

export const autocomplete = (
  query: string,
  request: Request,
): Promise<SearchResponse<AutocompleteResult>> => {
  return withFallback(
    () => searchTypesense("autocomplete", query, env),
    async () => {
      const index = await getIndex("autocomplete", request);
      const results = new Map<string, AutocompleteResult>();

      for (const hit of index.search(query, { prefix: true })) {
        if (typeof hit.phrase !== "string") {
          throw new Error("Invalid autocomplete index");
        }

        const identity = hit.phrase.toLowerCase();

        if (!results.has(identity)) {
          results.set(identity, {
            phrase: hit.phrase,
            matchedTerms: hit.terms.map((term) => term.toLowerCase()),
          });
        }

        if (results.size === 6) {
          break;
        }
      }

      return { provider: "minisearch", results: [...results.values()] };
    },
  );
};
