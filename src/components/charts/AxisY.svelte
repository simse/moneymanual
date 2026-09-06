<script lang="ts">
  import { getContext } from "svelte";
  import type { ChartContext, ChartFormatter } from "./types";

  let { ticks, format = String }: { ticks?: number[]; format?: ChartFormatter } =
    $props();

  const { yScale } = getContext<ChartContext>("LayerCake");
  const values = $derived(ticks ?? $yScale.ticks(5));
</script>

<div class="axis" aria-hidden="true">
  {#each values as value (value)}
    <div class="gridline" style:top={`${$yScale(value)}%`}>
      <span>{format(value)}</span>
    </div>
  {/each}
</div>

<style>
  .axis {
    position: absolute;
    inset: 0;
  }
  .gridline {
    position: absolute;
    width: 100%;
    border-top: 1px solid var(--color-zinc-300);
  }
  span {
    position: absolute;
    right: calc(100% + 12px);
    transform: translateY(-50%);
    white-space: nowrap;
  }
</style>
