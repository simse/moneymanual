export const TOPIC_IDS = [
  "investing",
  "savings",
  "tax",
  "borrowing",
  "economy",
] as const;

export type TopicId = (typeof TOPIC_IDS)[number];

export type TopicTone = {
  dot: string;
  soft: string;
  fg: string;
  border: string;
};

export type Topic = {
  id: TopicId;
  name: string;
  tone: TopicTone;
};

export const TOPICS: readonly Topic[] = [
  {
    id: "investing",
    name: "Investing",
    tone: {
      dot: "bg-emerald-500",
      soft: "bg-emerald-100",
      fg: "text-emerald-900",
      border: "border-emerald-300",
    },
  },
  {
    id: "savings",
    name: "Savings",
    tone: {
      dot: "bg-sky-500",
      soft: "bg-sky-100",
      fg: "text-sky-900",
      border: "border-sky-300",
    },
  },
  {
    id: "tax",
    name: "Tax",
    tone: {
      dot: "bg-pink-500",
      soft: "bg-pink-100",
      fg: "text-pink-900",
      border: "border-pink-300",
    },
  },
  {
    id: "borrowing",
    name: "Borrowing",
    tone: {
      dot: "bg-amber-500",
      soft: "bg-amber-100",
      fg: "text-amber-900",
      border: "border-amber-300",
    },
  },
  {
    id: "economy",
    name: "Economy",
    tone: {
      dot: "bg-violet-500",
      soft: "bg-violet-100",
      fg: "text-violet-900",
      border: "border-violet-300",
    },
  },
];

const TOPIC_BY_ID: Record<TopicId, Topic> = Object.fromEntries(
  TOPICS.map((t) => [t.id, t]),
) as Record<TopicId, Topic>;

export const topicById = (id: TopicId): Topic => TOPIC_BY_ID[id];
