import { type CollectionEntry, getCollection, getEntry } from "astro:content";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./i18n/locales";
import { localePath } from "./i18n/urls";

export type PageEntry = CollectionEntry<"pages">;
export type GlossaryTermEntry = CollectionEntry<"glossary">;

export type ParsedEntryId = {
	topic: string;
	locale: Locale;
	rest: string;
	isSection: boolean;
};

export const parseEntryId = (id: string): ParsedEntryId | null => {
	const parts = id.split("/");
	if (parts.length < 2) return null;
	const [topic, maybeLocale, ...restParts] = parts;
	if (!isLocale(maybeLocale)) return null;
	const rest = restParts.join("/");
	return {
		topic,
		locale: maybeLocale,
		rest,
		isSection: rest === "",
	};
};

export const entryIdFor = (locale: Locale, urlSlug?: string): string => {
	const cleaned = (urlSlug ?? "").replace(/^\/+/, "").replace(/\/+$/, "");
	if (!cleaned) return "";
	const [topic, ...rest] = cleaned.split("/");
	if (rest.length === 0) return `${topic}/${locale}`;
	return `${topic}/${locale}/${rest.join("/")}`;
};

export const getPageEntry = async (
	locale: Locale,
	urlSlug?: string,
): Promise<PageEntry | undefined> => {
	const id = entryIdFor(locale, urlSlug);
	if (!id) return undefined;
	return getEntry("pages", id);
};

export const urlPathForEntry = (entry: PageEntry): string => {
	const parsed = parseEntryId(entry.id);
	if (!parsed) return "/";
	const tail = parsed.isSection
		? parsed.topic
		: `${parsed.topic}/${parsed.rest}`;
	return localePath(parsed.locale, tail);
};

export const sectionEntriesForLocale = async (
	locale: Locale,
): Promise<PageEntry[]> => {
	const all = await getCollection("pages", (entry) => {
		const parsed = parseEntryId(entry.id);
		return (
			parsed !== null &&
			parsed.locale === locale &&
			entry.data.type === "section"
		);
	});
	all.sort((a, b) => (a.data.sortOrderHint ?? 0) - (b.data.sortOrderHint ?? 0));
	return all;
};

export const childEntriesForSection = async (
	topic: string,
	locale: Locale,
): Promise<PageEntry[]> => {
	const all = await getCollection("pages", (entry) => {
		const parsed = parseEntryId(entry.id);
		return (
			parsed !== null &&
			parsed.locale === locale &&
			parsed.topic === topic &&
			!parsed.isSection
		);
	});
	all.sort((a, b) => (a.data.sortOrderHint ?? 0) - (b.data.sortOrderHint ?? 0));
	return all;
};

export const entriesForLocale = async (
	locale: Locale,
): Promise<PageEntry[]> => {
	return getCollection("pages", (entry) => {
		const parsed = parseEntryId(entry.id);
		return parsed !== null && parsed.locale === locale;
	});
};

export const glossaryTermSlug = (entry: GlossaryTermEntry): string => {
	const [, ...rest] = entry.id.split("/");
	return rest.join("/");
};

export const glossaryTermsForLocale = async (
	locale: Locale,
): Promise<GlossaryTermEntry[]> => {
	const all = await getCollection("glossary", (entry) => {
		const [entryLocale] = entry.id.split("/");
		return isLocale(entryLocale) && entryLocale === locale;
	});
	all.sort((a, b) =>
		a.data.term.localeCompare(b.data.term, locale, { sensitivity: "base" }),
	);
	return all;
};

export const glossaryTermBySlug = async (
	locale: Locale,
	slug: string,
): Promise<GlossaryTermEntry | undefined> => {
	return getEntry("glossary", `${locale}/${slug}`);
};

export const relatedGlossaryTerms = (
	all: GlossaryTermEntry[],
	entry: GlossaryTermEntry,
	limit = 3,
): GlossaryTermEntry[] =>
	all
		.filter((t) => t.data.topic === entry.data.topic && t.id !== entry.id)
		.slice(0, limit);

export const sectionTopicFromSlug = (urlSlug?: string): string => {
	const cleaned = (urlSlug ?? "").replace(/^\/+/, "");
	return cleaned.split("/")[0] ?? "";
};

export { DEFAULT_LOCALE };
