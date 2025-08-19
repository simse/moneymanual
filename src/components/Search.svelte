<script lang="ts">
import debounce from "lodash/debounce";

let suggestions = $state<
	{
		phrase: string;
		matchedWords: string[];
	}[]
>([]);
let showSuggestions = $state(true);
const { initialValue }: { initialValue?: string } = $props();
let inputValue = $state(initialValue);

const getSuggestions = async (query: string) => {
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
	300,
);
</script>

<form class="">
    <input
        class="block text-xl bg-white text-black w-128 p-2 border-4 border-transparent focus:border-black outline-yellow-500"
        type="text"
        bind:value={inputValue}
        oninput={handleInput}
        onfocus={() => showSuggestions = true}
        onblur={() => showSuggestions = true}
    />

    <ul class={`mt-1 w-128 bg-white text-black ${showSuggestions ? 'block' : 'hidden'}`}>
        {#each suggestions as suggestion}
        <li class="hover:bg-zinc-200">
            <a class="p-4 text-lg block hover:underline hover:cursor-pointer" href={`/search?query=${suggestion.phrase}`}>
                {#each suggestion.phrase.split(' ') as word}
                {#if suggestion.matchedWords.includes(word)}
                    <strong>{word}{' '}</strong>
                {:else}
                    {word}{' '}
                {/if}
                {/each}
            </a>
        </li>

        <hr class="mx-2 border-zinc-400 last:border-0" />
        {/each}
    </ul>
</form>