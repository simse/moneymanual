<script lang="ts">
import ArrowRightIcon from "virtual:icons/bx/right-arrow-alt";
import SearchIcon from "virtual:icons/bx/search";
import debounce from "lodash/debounce";
import type { AutocompleteResult, SearchResponse } from "../lib/search-results";

type Suggestion = {
	phrase: string;
	matchedTerms: Set<string>;
};

const { initialValue }: { initialValue?: string } = $props();

const autocompleteEndpoint = "/api/search-autocomplete";
const searchAction = "/search";

let suggestions = $state<Suggestion[]>([]);
let inputActive = $state(false);
let showSuggestions = $derived(inputActive || suggestions.length > 0);

const getSuggestions = async (query: string): Promise<Suggestion[]> => {
	if (!query || query.length < 3) {return [];}

	const resp = await fetch(
		`${autocompleteEndpoint}?${new URLSearchParams({ query })}`,
	);

	if (!resp.ok) {return [];}

	const respBody = (await resp.json()) as SearchResponse<AutocompleteResult>;

	return respBody.results.map((result) => ({
		phrase: result.phrase,
		matchedTerms: new Set(result.matchedTerms),
	}));
};

const handleInput = debounce(
	(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		},
	) => {
		if (!e.target) {return;}
		const { value } = e.target as HTMLInputElement;

		getSuggestions(value)
			.then((result) => {
				suggestions = result;
			})
			.catch(() => {
				suggestions = [];
			});
	},
	100,
);
</script>

<form
    class="w-fit"
    action={searchAction}
    method="get"
>
    <div class="flex mb-1">
        <input
            id="search_query"
            name="query"
            class="block text-xl bg-white text-black w-128 p-2 outline-yellow-500 ring-black border-transparent z-20"
            type="text"
            value={initialValue}
            oninput={handleInput}
            onfocus={() => inputActive = true}
            onblur={() => inputActive = false}
        />

        <button class="px-4 bg-teal-600 hover:bg-teal-700 hover:cursor-pointer z-10">
            <SearchIcon width={24} height={24} />
        </button>
    </div>

    <ul class={`w-128 bg-white text-black ${showSuggestions ? 'block' : 'hidden'}`}>
        {#each suggestions as suggestion}
        <li class="hover:bg-zinc-200">
            <a class="p-4 text-lg block hover:underline hover:cursor-pointer flex items-center" href={`${searchAction}?${new URLSearchParams({ query: suggestion.phrase })}`}>
                <span>
                {#each suggestion.phrase.split(' ') as word}
                {#if suggestion.matchedTerms.has(word.toLowerCase())}
                    <strong>{word}{' '}</strong>
                {:else}
                    {word}{' '}
                {/if}
                {/each}
                </span>
                <ArrowRightIcon width={24} height={24} class="ml-auto" />
            </a>
        </li>

        <hr class="mx-2 border-zinc-400 last:border-0" />
        {/each}
    </ul>
</form>
