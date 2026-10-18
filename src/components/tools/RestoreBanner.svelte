<script lang="ts">
import type { PersistedState } from "../../lib/local-state.svelte";
import { copy } from "../../lib/copy";

let { persisted }: { persisted: PersistedState } = $props();
</script>

{#if persisted.hasSaved}
  <div
    class="mb-8 border-l-4 border-teal-700 bg-zinc-100 p-4 flex flex-wrap items-center gap-x-4 gap-y-3"
    role="status"
  >
    <p class="text-zinc-800 font-medium grow">{copy.calcRestoreMessage}</p>
    <div class="flex gap-2">
      <button
        type="button"
        class="bg-teal-900 text-white font-semibold px-3 py-1 outline-yellow-400"
        onclick={persisted.restore}
      >
        {copy.calcRestoreButton}
      </button>
      <button
        type="button"
        class="border-2 border-black bg-white font-semibold px-3 py-0.5 outline-yellow-400"
        onclick={persisted.dismiss}
      >
        {copy.calcRestoreDismiss}
      </button>
    </div>
  </div>
{/if}
