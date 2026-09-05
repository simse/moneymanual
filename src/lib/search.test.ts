import type { APIContext } from "astro";
import MiniSearch from "minisearch";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { runtime, getIndex, getPageEntry } = vi.hoisted(() => ({
	runtime: {} as Record<string, string>,
	getIndex: vi.fn(),
	getPageEntry: vi.fn(),
}));
vi.mock("cloudflare:workers", () => ({ env: runtime }));
vi.mock("./minisearch", () => ({ getIndex }));
vi.mock("./content", async () => ({
	parseEntryId: (id: string) => {
		const [topic, locale, rest] = id.split("/");
		return { topic, locale, rest, isSection: !rest };
	},
	getPageEntry,
	urlPathForEntry: (entry: { url: string }) => entry.url,
}));

import { autocomplete, search } from "./search";
import { searchRoute } from "./search-route";

const request = new Request("https://example.com/api/search?query=inflation");
const fetchMock = vi.fn<typeof fetch>();
const article = (id = "one") => ({
	document: {
		id,
		locale: "en-gb",
		title: "Inflation",
		description: "Prices",
		url: `/economy/${id}`,
	},
});
const response = (hits: unknown[], found = hits.length) =>
	Response.json({ hits, found, search_time_ms: 3 });
const completion = (phrases: string[], id = "one") => ({
	document: { id, locale: "en-gb", searchPhrases: phrases },
	highlights: [
		{
			field: "searchPhrases",
			indices: phrases.map((_, i) => i),
			matched_tokens: phrases.map(() => ["Inflation"]),
		},
	],
});

beforeEach(() => {
	vi.stubGlobal("fetch", fetchMock);
	Object.assign(runtime, {
		TYPESENSE_API_URL: "https://search.example.com/base/",
		TYPESENSE_API_KEY: "secret",
		TYPESENSE_INDEX_NAME: "articles",
	});
	const index = new MiniSearch({ fields: ["title"], storeFields: ["title"] });
	index.add({ id: "economy/en-gb/inflation", title: "Inflation" });
	getIndex.mockResolvedValue(index);
	getPageEntry.mockResolvedValue({
		data: { title: "Local inflation", description: "Local prices" },
		url: "/economy/inflation",
	});
});
afterEach(() => {
	vi.resetAllMocks();
	vi.unstubAllGlobals();
	vi.useRealTimers();
});

it("maps Typesense results and encodes the query and locale filter", async () => {
	fetchMock.mockResolvedValue(response([article()]));
	expect((await search("inflation & tax+", "en-gb", request)).results).toEqual([
		{ title: "Inflation", description: "Prices", url: "/economy/one" },
	]);
	const [url, init] = fetchMock.mock.calls[0];
	const parsed = new URL(String(url));
	expect(parsed.pathname).toBe("/base/collections/articles/documents/search");
	expect(parsed.searchParams.get("q")).toBe("inflation & tax+");
	expect(parsed.searchParams.get("filter_by")).toBe("locale:=en-gb");
	expect(parsed.searchParams.get("query_by")).toBe(
		"title,searchPhrases,description,body",
	);
	expect(init?.redirect).toBe("manual");
	expect(init?.headers).toEqual({ "X-TYPESENSE-API-KEY": "secret" });
	expect(getIndex).not.toHaveBeenCalled();
});

it("retrieves every result page", async () => {
	const pages: string[] = [];
	fetchMock.mockImplementation(async (url) => {
		pages.push(new URL(String(url)).searchParams.get("page") ?? "");
		return response([article(String(pages.length))], 2);
	});
	const result = await search("inflation", "en-gb", request);
	expect(result.results).toHaveLength(2);
	expect(result.provider).toBe("typesense");
	expect(result.queryTimeMs).toBe(6);
	expect(pages).toEqual(["1", "2"]);
});

it.each([
	"search",
	"autocomplete",
] as const)("keeps valid empty %s results", async (kind) => {
	fetchMock.mockResolvedValue(response([]));
	expect(
		await (kind === "search" ? search : autocomplete)("none", "en-gb", request),
	).toEqual({ results: [], provider: "typesense", queryTimeMs: 3 });
	expect(getIndex).not.toHaveBeenCalled();
});

it("maps phrase indices and tokens, deduplicates and limits suggestions", async () => {
	fetchMock.mockResolvedValue(
		response([
			completion([
				"inflation",
				"Inflation",
				"inflation two",
				"inflation three",
				"inflation four",
				"inflation five",
				"inflation six",
				"inflation seven",
			]),
		]),
	);
	const { results } = await autocomplete("infla", "en-gb", request);
	expect(results).toHaveLength(6);
	expect(results[0]).toEqual({
		phrase: "inflation",
		matchedTerms: ["inflation"],
	});
	expect(results[5].phrase).toBe("inflation six");
});

it("uses only matching phrase indices", async () => {
	const hit = completion(["unrelated", "inflation"]);
	hit.highlights[0].indices = [1];
	hit.highlights[0].matched_tokens = [["infla"]];
	fetchMock.mockResolvedValue(response([hit]));
	expect((await autocomplete("infla", "en-gb", request)).results).toEqual([
		{ phrase: "inflation", matchedTerms: ["inflation"] },
	]);
});

describe("fallback", () => {
	it.each([
		[
			"missing configuration",
			() => {
				delete runtime.TYPESENSE_API_KEY;
			},
		],
		[
			"invalid configuration",
			() => {
				runtime.TYPESENSE_API_URL = "ftp://invalid";
			},
		],
		[
			"network error",
			() => {
				fetchMock.mockRejectedValue(new Error("network"));
			},
		],
		[
			"HTTP error",
			() => {
				fetchMock.mockResolvedValue(new Response("no", { status: 401 }));
			},
		],
		[
			"invalid JSON",
			() => {
				fetchMock.mockResolvedValue(new Response("{"));
			},
		],
		[
			"malformed response",
			() => {
				fetchMock.mockResolvedValue(Response.json({}));
			},
		],
		[
			"malformed document",
			() => {
				fetchMock.mockResolvedValue(response([{ document: { id: "one" } }]));
			},
		],
		[
			"unsafe URL",
			() => {
				fetchMock.mockResolvedValue(
					response([
						{ document: { ...article().document, url: "//elsewhere" } },
					]),
				);
			},
		],
		[
			"incomplete results",
			() => {
				fetchMock.mockResolvedValue(response([], 2));
			},
		],
		[
			"cutoff",
			() => {
				fetchMock.mockResolvedValue(
					Response.json({ hits: [], found: 0, search_cutoff: true }),
				);
			},
		],
		[
			"repeated page",
			() => {
				fetchMock.mockResolvedValue(response([article()], 2));
			},
		],
	] as const)("uses MiniSearch after %s", async (_, setup) => {
		setup();
		const result = await search("inflation", "en-gb", request);
		expect(result.provider).toBe("minisearch");
		expect(result).not.toHaveProperty("queryTimeMs");
		expect(result.results).toEqual([
			{
				title: "Local inflation",
				description: "Local prices",
				url: "/economy/inflation",
			},
		]);
	});

	it("enforces one deadline across pages", async () => {
		vi.useFakeTimers();
		fetchMock
			.mockImplementationOnce(async () => {
				await new Promise((resolve) => setTimeout(resolve, 1500));
				return response([article()], 2);
			})
			.mockImplementationOnce(() => new Promise(() => {}));
		const result = search("inflation", "en-gb", request);
		await vi.advanceTimersByTimeAsync(2000);
		expect((await result).results).toHaveLength(1);
		expect(fetchMock.mock.calls[1][1]?.signal?.aborted).toBe(true);
		expect(getIndex).toHaveBeenCalledOnce();
	});

	it("falls back when autocomplete highlights are malformed", async () => {
		fetchMock.mockResolvedValue(
			response([
				{
					document: {
						id: "one",
						locale: "en-gb",
						searchPhrases: ["inflation"],
					},
					highlights: [],
				},
			]),
		);
		const index = new MiniSearch({
			fields: ["phrase"],
			storeFields: ["phrase"],
		});
		index.addAll(
			Array.from({ length: 9 }, (_, id) => ({
				id,
				phrase: id < 2 ? "inflation" : `inflation ${id}`,
			})),
		);
		getIndex.mockResolvedValue(index);
		const { results } = await autocomplete("infla", "en-gb", request);
		expect(results).toHaveLength(6);
		expect(results[0]).toEqual({
			phrase: "inflation",
			matchedTerms: ["inflation"],
		});
	});

	it.each([
		"cy",
		"sco",
	] as const)("uses MiniSearch directly for %s", async (locale) => {
		getIndex.mockResolvedValue({
			search: () => [{ id: `economy/${locale}/inflation` }],
		});
		getPageEntry.mockResolvedValue({
			data: { title: "Local", description: "Prices" },
			url: `/${locale}/economy/inflation`,
		});
		expect((await search("inflation", locale, request)).results[0].url).toBe(
			`/${locale}/economy/inflation`,
		);
		expect(fetchMock).not.toHaveBeenCalled();
		expect(getIndex).toHaveBeenCalledWith("search", locale, request);
	});
});

it.each([
	"search",
	"autocomplete",
] as const)("returns generic 503 when both providers fail for %s", async (kind) => {
	fetchMock.mockRejectedValue(new Error("private details"));
	getIndex.mockRejectedValue(new Error("private details"));
	const result = await searchRoute(
		kind,
		"en-gb",
	)({ url: new URL(request.url), request } as APIContext);
	expect(result.status).toBe(503);
	expect(await result.json()).toEqual({
		error: "Search is temporarily unavailable",
	});
});

it("rejects missing queries before contacting either provider", async () => {
	const result = await searchRoute(
		"search",
		"en-gb",
	)({ url: new URL("https://example.com/api/search"), request } as APIContext);
	expect(result.status).toBe(400);
	expect(await result.json()).toEqual({ error: "Missing query parameter" });
	expect(fetchMock).not.toHaveBeenCalled();
	expect(getIndex).not.toHaveBeenCalled();
});

it.each([
	0,
	7,
	undefined,
	-1,
	"3",
])("handles optional Typesense timing %s", async (timing) => {
	fetchMock.mockResolvedValue(
		Response.json({ hits: [], found: 0, search_time_ms: timing }),
	);
	const result = await search("none", "en-gb", request);
	expect(result.provider).toBe("typesense");
	if (typeof timing === "number" && timing >= 0)
		expect(result.queryTimeMs).toBe(timing);
	else expect(result).not.toHaveProperty("queryTimeMs");
});

it("omits timing when a later page has no timing", async () => {
	fetchMock
		.mockResolvedValueOnce(response([article("one")], 2))
		.mockResolvedValueOnce(Response.json({ hits: [article("two")], found: 2 }));
	const result = await search("inflation", "en-gb", request);
	expect(result.results).toHaveLength(2);
	expect(result).not.toHaveProperty("queryTimeMs");
});

it("includes provider and timing in autocomplete API responses", async () => {
	fetchMock.mockResolvedValue(response([completion(["inflation"])]));
	const result = await searchRoute(
		"autocomplete",
		"en-gb",
	)({ url: new URL(request.url), request } as APIContext);
	expect(await result.json()).toEqual({
		provider: "typesense",
		queryTimeMs: 3,
		results: [{ phrase: "inflation", matchedTerms: ["inflation"] }],
	});
});

it("shows query time including zero and omits it when absent", async () => {
	const { t } = await import("./i18n/strings");
	expect(t("en-gb", "resultsFound")(2, "inflation", 0)).toBe(
		'Found 2 results for "inflation" in 0 ms',
	);
	expect(t("en-gb", "resultsFound")(2, "inflation", 7)).toBe(
		'Found 2 results for "inflation" in 7 ms',
	);
	expect(t("en-gb", "resultsFound")(0, "inflation")).toBe(
		'Found 0 results for "inflation"',
	);
});
