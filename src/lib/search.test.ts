import type { APIContext } from "astro";
import MiniSearch from "minisearch";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

const { getIndex, getPageEntry } = vi.hoisted(() => ({
  getIndex: vi.fn(),
  getPageEntry: vi.fn(),
}));

vi.mock("./minisearch", () => ({ getIndex }));

vi.mock("./content", async () => ({
  parseEntryId: (id: string) => {
    const [topic, ...rest] = id.split("/");
    return { topic, rest: rest.join("/"), isSection: rest.length === 0 };
  },
  getPageEntry,
  urlPathForEntry: (entry: { url: string }) => entry.url,
}));

import { autocomplete, search } from "./search";
import { searchRoute } from "./search-route";

const request = new Request("https://example.com/api/search?query=inflation");

beforeEach(() => {
  const index = new MiniSearch({ fields: ["title"], storeFields: ["title"] });
  index.add({ id: "economy/inflation", title: "Inflation" });
  getIndex.mockResolvedValue(index);

  getPageEntry.mockResolvedValue({
    data: { title: "Local inflation", description: "Local prices" },
    url: "/economy/inflation",
  });
});

afterEach(() => {
  vi.resetAllMocks();
});

it("maps MiniSearch hits to page entries", async () => {
  expect(await search("inflation", request)).toEqual({
    results: [
      {
        title: "Local inflation",
        description: "Local prices",
        url: "/economy/inflation",
      },
    ],
  });

  expect(getIndex).toHaveBeenCalledWith("search", request);
  expect(getPageEntry).toHaveBeenCalledWith("economy/inflation");
});

it("skips hits without a page entry", async () => {
  getPageEntry.mockResolvedValue(undefined);
  expect(await search("inflation", request)).toEqual({ results: [] });
});

it("deduplicates and limits autocomplete suggestions", async () => {
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
  const { results } = await autocomplete("infla", request);
  expect(results).toHaveLength(6);

  expect(results[0]).toEqual({
    phrase: "inflation",
    matchedTerms: ["inflation"],
  });
});

it.each(["search", "autocomplete"] as const)(
  "returns generic 503 when %s fails",
  async (kind) => {
    getIndex.mockRejectedValue(new Error("private details"));

    const result = await searchRoute(kind)({
      url: new URL(request.url),
      request,
    } as APIContext);

    expect(result.status).toBe(503);

    expect(await result.json()).toEqual({
      error: "Search is temporarily unavailable",
    });
  },
);

it("rejects missing queries before searching", async () => {
  const result = await searchRoute("search")({
    url: new URL("https://example.com/api/search"),
    request,
  } as APIContext);

  expect(result.status).toBe(400);
  expect(await result.json()).toEqual({ error: "Missing query parameter" });
  expect(getIndex).not.toHaveBeenCalled();
});
