import { type CollectionEntry, getCollection, getEntry } from "astro:content";

export type PageEntry = CollectionEntry<"pages">;
export type GlossaryTermEntry = CollectionEntry<"glossary">;

export type ParsedEntryId = {
  topic: string;
  rest: string;
  isSection: boolean;
};

export const parseEntryId = (id: string): ParsedEntryId | null => {
  const [topic, ...restParts] = id.split("/");

  if (!topic) {
    return null;
  }

  const rest = restParts.join("/");
  return { topic, rest, isSection: rest === "" };
};

export const entryIdFor = (urlSlug?: string): string =>
  (urlSlug ?? "").replace(/^\/+/, "").replace(/\/+$/, "");

export const getPageEntry = async (
  urlSlug?: string,
): Promise<PageEntry | undefined> => {
  const id = entryIdFor(urlSlug);

  if (!id) {
    return undefined;
  }

  return getEntry("pages", id);
};

export const urlPathForEntry = (entry: PageEntry): string => `/${entry.id}`;

export const sectionEntries = async (): Promise<PageEntry[]> => {
  const all = await getCollection("pages", (entry) => {
    const parsed = parseEntryId(entry.id);
    return parsed !== null && entry.data.type === "section";
  });

  all.sort((a, b) => (a.data.sortOrderHint ?? 0) - (b.data.sortOrderHint ?? 0));
  return all;
};

export const childEntriesForSection = async (
  topic: string,
): Promise<PageEntry[]> => {
  const all = await getCollection("pages", (entry) => {
    const parsed = parseEntryId(entry.id);
    return parsed !== null && parsed.topic === topic && !parsed.isSection;
  });

  all.sort((a, b) => (a.data.sortOrderHint ?? 0) - (b.data.sortOrderHint ?? 0));
  return all;
};

export const pageEntries = async (): Promise<PageEntry[]> =>
  getCollection("pages", (entry) => parseEntryId(entry.id) !== null);

export const glossaryTermSlug = (entry: GlossaryTermEntry): string => entry.id;

export const glossaryTerms = async (): Promise<GlossaryTermEntry[]> => {
  const all = await getCollection("glossary");

  all.sort((a, b) =>
    a.data.term.localeCompare(b.data.term, "en-GB", { sensitivity: "base" }),
  );

  return all;
};

export const glossaryTermBySlug = async (
  slug: string,
): Promise<GlossaryTermEntry | undefined> => getEntry("glossary", slug);

export const relatedGlossaryTerms = (
  all: GlossaryTermEntry[],
  entry: GlossaryTermEntry,
  limit = 3,
): GlossaryTermEntry[] =>
  all
    .filter(
      (term) => term.data.topic === entry.data.topic && term.id !== entry.id,
    )
    .slice(0, limit);

export const sectionTopicFromSlug = (urlSlug?: string): string => {
  const cleaned = (urlSlug ?? "").replace(/^\/+/, "");
  return cleaned.split("/")[0] ?? "";
};
