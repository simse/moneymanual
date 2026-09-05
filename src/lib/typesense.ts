import type {
	AutocompleteResult,
	SearchResponse,
	SearchResult,
} from "./search-results";

type SearchKind = "search" | "autocomplete";

function record(value: unknown): Record<string, unknown> {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		throw new Error("Invalid Typesense response");
	}
	return value as Record<string, unknown>;
}

function string(value: unknown): string {
	if (typeof value !== "string") throw new Error("Invalid Typesense field");
	return value;
}

function strings(value: unknown): string[] {
	if (!Array.isArray(value)) throw new Error("Invalid Typesense array");
	return value.map(string);
}

function searchResult(document: Record<string, unknown>): SearchResult {
	const url = string(document.url);
	if (!url.startsWith("/") || url.startsWith("//") || url.includes("\\")) {
		throw new Error("Invalid article URL");
	}
	return {
		title: string(document.title),
		description: string(document.description),
		url,
	};
}

function suggestions(
	hit: Record<string, unknown>,
	document: Record<string, unknown>,
): AutocompleteResult[] {
	const phrases = strings(document.searchPhrases);
	if (!Array.isArray(hit.highlights))
		throw new Error("Missing phrase highlights");
	const highlight = hit.highlights
		.map(record)
		.find((item) => item.field === "searchPhrases");
	if (
		!highlight ||
		!Array.isArray(highlight.indices) ||
		!Array.isArray(highlight.matched_tokens) ||
		highlight.indices.length !== highlight.matched_tokens.length ||
		!highlight.indices.length
	) {
		throw new Error("Invalid phrase highlights");
	}
	const tokens = highlight.matched_tokens;
	return highlight.indices.map((index, position) => {
		if (!Number.isInteger(index) || index < 0 || index >= phrases.length) {
			throw new Error("Invalid phrase index");
		}
		const matchedTokens = strings(tokens[position]).map((term) =>
			term.toLowerCase(),
		);
		if (!matchedTokens.length) throw new Error("Missing matched tokens");
		// Typesense returns only the matched prefix; the UI highlights whole words.
		const matchedTerms = phrases[index]
			.toLowerCase()
			.split(" ")
			.filter((word) =>
				matchedTokens.some((token) =>
					word.replace(/^[^\p{L}\p{N}]+/gu, "").startsWith(token),
				),
			);
		return { phrase: phrases[index], matchedTerms };
	});
}

export async function searchTypesense(
	kind: "search",
	query: string,
	env: object,
): Promise<SearchResponse<SearchResult>>;
export async function searchTypesense(
	kind: "autocomplete",
	query: string,
	env: object,
): Promise<SearchResponse<AutocompleteResult>>;
export async function searchTypesense(
	kind: SearchKind,
	query: string,
	env: object,
): Promise<SearchResponse<SearchResult> | SearchResponse<AutocompleteResult>> {
	const required = (name: string) => {
		const value = string(Reflect.get(env, name)).trim();
		if (!value) throw new Error("Missing Typesense configuration");
		return value;
	};
	const base = new URL(required("TYPESENSE_API_URL"));
	if (
		!["http:", "https:"].includes(base.protocol) ||
		base.username ||
		base.password ||
		base.search ||
		base.hash
	) {
		throw new Error("Invalid Typesense URL");
	}
	base.pathname = `${base.pathname.replace(/\/$/, "")}/`;
	const url = new URL(
		`collections/${encodeURIComponent(required("TYPESENSE_INDEX_NAME"))}/documents/search`,
		base,
	);
	const key = required("TYPESENSE_API_KEY");
	url.search = new URLSearchParams({
		q: query,
		query_by:
			kind === "search"
				? "title,searchPhrases,description,body"
				: "searchPhrases",
		filter_by: "locale:=en-gb",
		prefix: "true",
		per_page: "100",
		include_fields:
			kind === "search"
				? "id,locale,title,description,url"
				: "id,locale,searchPhrases",
		highlight_fields: kind === "search" ? "none" : "searchPhrases",
		enable_highlight_v1: "true",
	}).toString();

	const controller = new AbortController();
	let timer: ReturnType<typeof setTimeout> | undefined;
	const deadline = new Promise<never>((_, reject) => {
		timer = setTimeout(() => {
			controller.abort();
			reject(new Error("Typesense deadline exceeded"));
		}, 2000);
	});
	async function collect() {
		const results: SearchResult[] = [];
		const completions = new Map<string, AutocompleteResult>();
		const ids = new Set<string>();
		let total: number | undefined;
		let queryTimeMs: number | undefined = 0;
		const complete = <T>(results: T[]): SearchResponse<T> => ({
			results,
			provider: "typesense",
			...(queryTimeMs === undefined ? {} : { queryTimeMs }),
		});
		for (let page = 1; ; page++) {
			controller.signal.throwIfAborted();
			url.searchParams.set("page", String(page));
			const response = await fetch(url, {
				headers: { "X-TYPESENSE-API-KEY": key },
				redirect: "manual",
				signal: controller.signal,
			});
			if (!response.ok) throw new Error("Typesense request failed");
			const data = record(await response.json());
			controller.signal.throwIfAborted();
			if (
				data.search_cutoff === true ||
				!Number.isInteger(data.found) ||
				Number(data.found) < 0 ||
				!Array.isArray(data.hits) ||
				(total !== undefined && total !== data.found)
			) {
				throw new Error("Incomplete Typesense search");
			}
			total = Number(data.found);
			const pageTime = data.search_time_ms;
			queryTimeMs =
				queryTimeMs !== undefined &&
				typeof pageTime === "number" &&
				Number.isFinite(pageTime) &&
				pageTime >= 0
					? queryTimeMs + pageTime
					: undefined;
			for (const value of data.hits) {
				const hit = record(value);
				const document = record(hit.document);
				const id = string(document.id);
				if (!id || ids.has(id) || document.locale !== "en-gb")
					throw new Error("Invalid Typesense document");
				ids.add(id);
				if (kind === "search") results.push(searchResult(document));
				else
					for (const result of suggestions(hit, document)) {
						const identity = result.phrase.toLowerCase();
						if (!completions.has(identity)) completions.set(identity, result);
					}
			}
			if (ids.size > total) throw new Error("Invalid Typesense count");
			if (kind === "autocomplete" && completions.size >= 6)
				return complete([...completions.values()].slice(0, 6));
			if (ids.size === total)
				return kind === "search"
					? complete(results)
					: complete([...completions.values()]);
			if (!data.hits.length) throw new Error("Incomplete Typesense search");
		}
	}
	try {
		return await Promise.race([collect(), deadline]);
	} finally {
		clearTimeout(timer);
	}
}
