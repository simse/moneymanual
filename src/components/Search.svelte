<script lang="ts">
import debounce from "lodash/debounce";
import SearchIcon from 'virtual:icons/bx/search';
import ArrowRightIcon from 'virtual:icons/bx/right-arrow-alt';

let suggestions = $state<
	{
		phrase: string;
		matchedWords: string[];
	}[]
>([]);
let inputActive = $state(false);
let showSuggestions = $derived(inputActive || suggestions.length > 0);
const { initialValue }: { initialValue?: string } = $props();
let inputValue = $state(initialValue);

const getSuggestions = async (query: string) => {
    if (!query || query.length < 3) return [];

	const resp = await fetch(`/api/search-autocomplete?query=${query}`);

	const respBody =
		await resp.json<
			{
				id: string;
				score: number;
				phrase: string;
				match: {
					[key: string]: string[];
				};
			}[]
		>();

	return respBody.map((result) => ({
		phrase: result.phrase,
		matchedWords: Object.keys(result.match),
	}));
};

const handleInput = debounce(
	(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		},
	) => {
		if (!e.target) return;
		const { value } = e.target as HTMLInputElement;

		getSuggestions(value).then((result) => (suggestions = result));
	},
	100,
);
</script>

<form
    class="w-fit"
>
    <div class="flex mb-1">
        <input
            id="search_query"
            class="block text-xl bg-white text-black w-128 p-2 outline-yellow-500 ring-black border-transparent z-20"
            type="text"
            bind:value={inputValue}
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
            <a class="p-4 text-lg block hover:underline hover:cursor-pointer flex items-center" href={`/search?query=${suggestion.phrase}`}>
                <span>
                {#each suggestion.phrase.split(' ') as word}
                {#if suggestion.matchedWords.includes(word)}
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