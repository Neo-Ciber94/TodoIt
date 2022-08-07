import { useMemo, useState } from "react";

interface SetOperations<T> {
  add: (value: T) => void;
  remove: (value: T) => boolean;
  has: (value: T) => boolean;
  reset: () => void;
}

export interface UseSetResult<T> extends SetOperations<T> {
  items: Readonly<Set<T>>;
}

export function useSet<T>(initialValue: Set<T>): UseSetResult<T> {
  const [set, setSet] = useState(initialValue);

  const operations: SetOperations<T> = useMemo(
    () => ({
      add(value: T) {
        setSet((oldSet) => new Set([...Array.from(oldSet), value]));
      },
      remove(value: T) {
        const copy = new Set(set);
        const result = copy.delete(value);
        setSet((oldSet) => new Set([...Array.from(oldSet), value]));
        return result;
      },
      has(value: T) {
        return set.has(value);
      },
      reset() {
        setSet(new Set(initialValue));
      },
    }),

    // We don't include the initialValue because the value should be always unchanged
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [set, setSet]
  );

  return {
    items: set,
    ...operations,
  };
}
