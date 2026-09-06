import ArticleIcon from "virtual:icons/bx/book-open";
import SchoolIcon from "virtual:icons/bx/bxs-graduation";
import ExternalIcon from "virtual:icons/bx/link-external";
import PoundIcon from "virtual:icons/bx/pound";
import CalculatorIcon from "virtual:icons/material-symbols/calculate";
import PercentIcon from "virtual:icons/material-symbols/percent";
import SavingsIcon from "virtual:icons/material-symbols/savings";

export const ICON_KEYS = [
  "savings",
  "calculator",
  "percent",
  "pound",
  "school",
  "article",
  "external",
] as const;

export type IconKey = (typeof ICON_KEYS)[number];

export type IconEntry = {
  // biome-ignore lint/suspicious/noExplicitAny: unplugin-icons virtual modules export component classes whose runtime shape varies by framework
  Icon: any;
  bg: string;
  fg: string;
};

export const ICONS: Record<IconKey, IconEntry> = {
  savings: { Icon: SavingsIcon, bg: "bg-emerald-200", fg: "text-emerald-900" },
  calculator: { Icon: CalculatorIcon, bg: "bg-sky-200", fg: "text-sky-900" },
  percent: { Icon: PercentIcon, bg: "bg-violet-200", fg: "text-violet-900" },
  pound: { Icon: PoundIcon, bg: "bg-pink-200", fg: "text-pink-900" },
  school: { Icon: SchoolIcon, bg: "bg-blue-200", fg: "text-blue-900" },
  article: { Icon: ArticleIcon, bg: "bg-zinc-200", fg: "text-zinc-900" },
  external: { Icon: ExternalIcon, bg: "bg-zinc-200", fg: "text-zinc-900" },
};

export const iconFor = (key: string | undefined): IconEntry =>
  key && key in ICONS ? ICONS[key as IconKey] : ICONS.article;
