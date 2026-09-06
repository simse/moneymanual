<script lang="ts">
  import { getContext } from "svelte";
  import type { ChartContext, ChartFormatter } from "./types";

  let { ticks, format = String }: { ticks?: number[]; format?: ChartFormatter } =
    $props();

  const { xScale } = getContext<ChartContext>("LayerCake");
  const values = $derived(ticks ?? $xScale.ticks(5));
</script>

<div class="axis" aria-hidden="true">
  {#each values as value, index (value)}
    <span
      class="tick"
      class:first={index === 0}
      class:last={index === values.length - 1}
      class:compact-hidden={index !== 0 && index !== Math.floor(values.length / 2) && index !== values.length - 1}
      style:left={`${$xScale(value)}%`}
    >{format(value)}</span>
  {/each}
</div>

<style>
  .axis {
    position: absolute;
    inset: 0;
  }
  .tick {
    position: absolute;
    top: calc(100% + 12px);
    transform: translateX(-50%);
    white-space: nowrap;
  }
  .first {
    transform: none;
  }
  .last {
    transform: translateX(-100%);
  }
  @container (max-width: 440px) {
    .compact-hidden {
      display: none;
    }
  }
</style>
