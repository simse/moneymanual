import type { Readable } from "svelte/store";

export interface ChartPoint {
  x: number;
  y: number;
}

export interface ChartSeries {
  label: string;
  points: ChartPoint[];
  color?: string;
  dashed?: boolean;
}

export type ChartFormatter = (value: number) => string;

export interface ChartScale {
  (value: number): number;
  ticks(count?: number): number[];
}

export interface ChartContext {
  xScale: Readable<ChartScale>;
  yScale: Readable<ChartScale>;
}
