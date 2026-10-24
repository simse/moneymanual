<script lang="ts">
import type { PersistedState } from "../../lib/local-state.svelte";

let { persisted }: { persisted: PersistedState } = $props();
</script>

{#if persisted.hasSaved}
  <div
    class="mb-8 border-l-4 border-teal-700 bg-zinc-100 p-4 flex flex-wrap items-center gap-x-4 gap-y-3"
    role="status"
  >
    <p class="text-zinc-800 font-medium grow">You've used this calculator before on this device.</p>
    <div class="flex gap-2">
      <button
        type="button"
        class="bg-teal-900 text-white font-semibold px-3 py-1 outline-yellow-400 cursor-pointer hover:bg-teal-700 active:bg-yellow-400 active:text-black"
        onclick={persisted.restore}
      >
        Restore my values
      </button>
      <button
        type="button"
        class="border-2 border-black bg-white font-semibold px-3 py-0.5 outline-yellow-400 cursor-pointer hover:bg-zinc-200 active:bg-yellow-400"
        onclick={persisted.dismiss}
      >
        Dismiss
      </button>
    </div>
  </div>
{/if}
