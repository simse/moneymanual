<script lang="ts">
  import { LayerCake, ScaledSvg, Html } from "layercake";
  import AxisX from "../charts/AxisX.svelte";
  import AxisY from "../charts/AxisY.svelte";
  import Lines from "../charts/Lines.svelte";
  import type { ChartFormatter, ChartSeries } from "../charts/types";

  interface Props {
    title: string;
    subtitle: string;
    description: string;
    source: string;
    series: ChartSeries[];
    xLabel?: string;
    formatX?: ChartFormatter;
    formatY?: ChartFormatter;
    formatValue?: ChartFormatter;
    xDomain?: [number | null, number | null];
    yDomain?: [number | null, number | null];
    xTicks?: number[];
    yTicks?: number[];
  }

  let {
    title,
    subtitle,
    description,
    source,
    series,
    xLabel = "Year",
    formatX = String,
    formatY = String,
    formatValue = formatY,
    xDomain,
    yDomain,
    xTicks,
    yTicks,
  }: Props = $props();

  const id = $props.id();

  const lines = $derived(
    series.map((line, index) => ({
      ...line,
      points: [...line.points].sort((a, b) => a.x - b.x),
      color:
        line.color ??
        (index % 2 === 0 ? "var(--color-teal-700)" : "var(--color-zinc-800)"),
      dashed: line.dashed ?? index % 2 === 1,
    })),
  );

  const flatData = $derived(lines.flatMap((line) => line.points));

  const rows = $derived(
    [...new Set(flatData.map((point) => point.x))].sort((a, b) => a - b),
  );
</script>

<figure class="not-prose content-chart" aria-labelledby={`${id}-title`}>
  <figcaption>
    <p id={`${id}-title`} class="title">{title}</p>
    <p class="subtitle">{subtitle}</p>
  </figcaption>
  <p id={`${id}-description`} class="description">{description}</p>
  <ul class="key" aria-label="Chart lines">
    {#each lines as line}
      <li>
        <span
          class="swatch"
          class:dashed={line.dashed}
          style:border-color={line.color}
          aria-hidden="true"
        ></span>
        {line.label}
      </li>
    {/each}
  </ul>
  <div
    class="plot"
    role="img"
    aria-labelledby={`${id}-title`}
    aria-describedby={`${id}-description`}
  >
    <LayerCake
      ssr
      percentRange
      x="x"
      y="y"
      data={flatData}
      {xDomain}
      {yDomain}
      padding={{ top: 12, right: 8, bottom: 44, left: 80 }}
    >
      <Html>
        <AxisX ticks={xTicks} format={formatX} />
        <AxisY ticks={yTicks} format={formatY} />
      </Html>
      <ScaledSvg>
        <Lines series={lines} />
      </ScaledSvg>
    </LayerCake>
  </div>
  <p class="source">Source: {source}</p>
  <details>
    <summary>View chart data</summary>
    <div
      class="table-scroll"
      tabindex="0"
      role="region"
      aria-label={`${title}: data table`}
    >
      <table>
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">{xLabel}</th>
            {#each lines as line}
              <th scope="col">{line.label}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each rows as x (x)}
            <tr>
              <th scope="row">{formatX(x)}</th>
              {#each lines as line}
                {@const point = line.points.find((value) => value.x === x)}
                <td>{point ? formatValue(point.y) : "—"}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </details>
</figure>

<style>
  .content-chart {
    container-type: inline-size;
    margin: 2rem 0;
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--color-zinc-950);
    background: white;
    border-block: 1px solid var(--color-zinc-300);
    padding-block: 1.25rem;
  }
  p {
    margin: 0;
  }
  .title {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.4;
  }
  .subtitle,
  .description {
    margin-top: 0.5rem;
    color: var(--color-zinc-700);
  }
  .key {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    list-style: none;
    padding: 0;
    margin: 1rem 0;
  }
  .key li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .swatch {
    width: 2rem;
    border-top: 3px solid;
  }
  .swatch.dashed {
    border-top-style: dashed;
  }
  .plot {
    width: 100%;
    height: 340px;
  }
  .source {
    margin-top: 0.75rem;
    color: var(--color-zinc-700);
  }
  details {
    margin-top: 1rem;
  }
  summary {
    cursor: pointer;
    color: var(--color-teal-700);
    text-decoration: underline;
    text-underline-offset: 3px;
    width: fit-content;
  }
  summary:focus-visible,
  .table-scroll:focus-visible {
    outline: 3px solid var(--color-yellow-500);
    outline-offset: 3px;
  }
  .table-scroll {
    overflow-x: auto;
    margin-top: 1rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-variant-numeric: tabular-nums;
  }
  caption {
    text-align: left;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  th,
  td {
    padding: 0.5rem;
    text-align: right;
    border-bottom: 1px solid var(--color-zinc-300);
  }
  th:first-child {
    text-align: left;
    padding-left: 0;
  }
  td {
    white-space: nowrap;
  }
</style>
