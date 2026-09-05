export type SearchResult = {
	title: string;
	description: string;
	url: string;
};

export type AutocompleteResult = {
	phrase: string;
	matchedTerms: string[];
};

export type SearchResponse<T> = { results: T[] } & (
	| { provider: "typesense"; queryTimeMs?: number }
	| { provider: "minisearch"; queryTimeMs?: never }
);
