<script lang="ts">
  import { getContext } from "svelte";
  import type { ChartContext, ChartSeries } from "./types";

  let { series }: { series: ChartSeries[] } = $props();
  const { xScale, yScale } = getContext<ChartContext>("LayerCake");
</script>

<g aria-hidden="true">
  {#each series as line}
    <path
      d={line.points.map((point, index) => `${index === 0 ? "M" : "L"}${$xScale(point.x)},${$yScale(point.y)}`).join(" ")}
      stroke={line.color}
      stroke-dasharray={line.dashed ? "8 5" : undefined}
      fill="none"
      stroke-width="3"
      vector-effect="non-scaling-stroke"
      stroke-linejoin="round"
    />
  {/each}
</g>
