import type { CalculatorKey } from "./calculator-state-schemas";

export const persistSessionState = (
  key: CalculatorKey,
  getState: () => unknown,
  delayMs = 500,
): void => {
  let mounted = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  $effect(() => {
    const snapshot = JSON.stringify(getState());

    if (!mounted) {
      mounted = true;
      return;
    }

    clearTimeout(timer);

    timer = setTimeout(() => {
      void fetch(`/api/calculator-state/${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: snapshot,
        keepalive: true,
      });
    }, delayMs);

    return () => clearTimeout(timer);
  });
};
