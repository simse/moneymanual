import { env } from "cloudflare:workers";
import MiniSearch from "minisearch";
import { type PageEntry, pageEntries } from "./content";

type IndexType = "search" | "autocomplete";

const indexes: Record<
  IndexType,
  { instance: MiniSearch | null; file: string; fields: string[] }
> = {
  search: {
    instance: null,
    file: "search.json",
    fields: ["title", "description", "searchPhrases"],
  },
  autocomplete: {
    instance: null,
    file: "autocomplete.json",
    fields: ["phrase"],
  },
};

export const getIndex = async (type: IndexType, request: Request) => {
  const indexInfo = indexes[type];

  if (!indexInfo.instance) {
    const indexUrl = new URL(`/index/${indexInfo.file}`, request.url);

    const response = import.meta.env.DEV
      ? await fetch(indexUrl)
      : await env.ASSETS.fetch(indexUrl);

    indexInfo.instance = MiniSearch.loadJSON(await response.text(), {
      fields: indexInfo.fields,
    });
  }

  return indexInfo.instance;
};

export type IndexDocument = { id: string };
export type DataExtractor<T extends IndexDocument> = (page: PageEntry) => T[];

export const createIndex = async <T extends IndexDocument>(
  fields: string[],
  storeFields: string[],
  dataExtractor: DataExtractor<T>,
) => {
  const miniSearch = new MiniSearch<T>({ fields, storeFields });
  const documents: T[] = [];

  for (const page of await pageEntries()) {
    documents.push(...dataExtractor(page));
  }

  miniSearch.addAll(documents);
  return miniSearch;
};
