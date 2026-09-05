<script lang="ts">
import type { TopicId } from "../../lib/glossary-topics";
import { topicById } from "../../lib/glossary-topics";

type TermSummary = {
	slug: string;
	term: string;
	short?: string;
	topic: TopicId;
	href: string;
};

const {
	terms,
	selectedSlug,
	filterPlaceholder,
}: {
	terms: TermSummary[];
	selectedSlug?: string;
	filterPlaceholder: string;
} = $props();

let query = $state("");

const normalized = $derived(query.trim().toLowerCase());
const filtered = $derived(
	normalized === ""
		? terms
		: terms.filter((t) => {
				const haystack = `${t.term} ${t.short ?? ""}`.toLowerCase();
				return haystack.includes(normalized);
			}),
);
</script>

<div>
	<input
		type="search"
		bind:value={query}
		placeholder={filterPlaceholder}
		aria-label={filterPlaceholder}
		class="w-full px-3 py-2 border-2 border-zinc-300 focus:border-teal-700 outline-none mb-3 font-medium bg-white"
	/>
	<ul class="border-t border-zinc-200 max-h-[70vh] overflow-y-auto">
		{#each filtered as t (t.slug)}
			{@const tone = topicById(t.topic).tone}
			{@const isSel = t.slug === selectedSlug}
			<li class="border-b border-zinc-200">
				<a
					href={t.href}
					aria-current={isSel ? "page" : undefined}
					class="flex items-center gap-2 py-2 px-2 {isSel
						? 'bg-teal-900 text-white'
						: 'hover:bg-zinc-100'}"
				>
					<span class="w-1.5 h-1.5 rounded-full shrink-0 {tone.dot}"></span>
					<span class="font-bold {isSel ? '' : 'text-zinc-900'}">{t.term}</span>
					{#if t.short}
						<span
							class="text-xs font-medium {isSel
								? 'text-white/70'
								: 'text-zinc-500'}"
						>
							{t.short}
						</span>
					{/if}
				</a>
			</li>
		{/each}
		{#if filtered.length === 0}
			<li class="py-4 px-2 text-sm text-zinc-500 font-medium">
				No matches.
			</li>
		{/if}
	</ul>
</div>
