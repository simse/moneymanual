<script lang="ts">
import ChevronRightIcon from "virtual:icons/material-symbols/chevron-right";
import type { Snippet } from "svelte";

interface Props {
	title: string;
	indicator?: string | null;
	open?: boolean;
	children: Snippet;
}

const { title, indicator = null, open = false, children }: Props = $props();
</script>

<details class="group border-b-2 border-black py-6 [&_summary::-webkit-details-marker]:hidden" {open}>
	<summary class="text-2xl font-bold cursor-pointer flex items-center gap-2">
		<ChevronRightIcon class="shrink-0 group-open:rotate-90" />
		<span>{title}</span>
		{#if indicator}
			<span class="ml-auto inline-flex items-center gap-2 text-base font-normal">
				<span class="text-zinc-700">{indicator}</span>
				<span class="size-2 rounded-full bg-teal-700" aria-hidden="true"></span>
			</span>
		{/if}
	</summary>
	<div class="mt-6">
		{@render children()}
	</div>
</details>
