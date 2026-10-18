import type { z } from "astro/zod";
import {
  type CalculatorKey,
  calculatorStateSchemas,
} from "./calculator-state-schemas";

type CalculatorState<K extends CalculatorKey> = z.infer<
  (typeof calculatorStateSchemas)[K]
>;

export type PersistedState = {
  readonly hasSaved: boolean;
  restore: () => void;
  dismiss: () => void;
};

const storageKey = (key: CalculatorKey): string => `calculator-state:${key}`;

const readSaved = (key: CalculatorKey): unknown => {
  try {
    const raw = localStorage.getItem(storageKey(key));
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
};

const writeSaved = (key: CalculatorKey, snapshot: string | null): void => {
  try {
    if (snapshot === null) {
      localStorage.removeItem(storageKey(key));
    } else {
      localStorage.setItem(storageKey(key), snapshot);
    }
  } catch {
    // Storage can be blocked or full; the calculator still works without it.
  }
};

/**
 * Saves calculator values to local storage as they change, and offers values
 * saved on a previous visit for the calculator to restore.
 *
 * Saved values are only offered until the user edits the calculator, since
 * the first edit replaces them.
 */
export const persistLocalState = <K extends CalculatorKey>(
  key: K,
  getState: () => CalculatorState<K>,
  applyState: (state: CalculatorState<K>) => void,
  delayMs = 300,
): PersistedState => {
  let saved = $state<CalculatorState<K> | null>(null);
  let mounted = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  $effect(() => {
    const snapshot = JSON.stringify(getState());

    if (!mounted) {
      mounted = true;
      const parsed = calculatorStateSchemas[key].safeParse(readSaved(key));

      if (parsed.success && JSON.stringify(parsed.data) !== snapshot) {
        saved = parsed.data as CalculatorState<K>;
      }

      return;
    }

    saved = null;
    clearTimeout(timer);
    timer = setTimeout(() => writeSaved(key, snapshot), delayMs);

    return () => clearTimeout(timer);
  });

  return {
    get hasSaved() {
      return saved !== null;
    },
    restore: () => {
      if (saved) {
        applyState(saved);
      }

      saved = null;
    },
    dismiss: () => {
      saved = null;
      writeSaved(key, null);
    },
  };
};
