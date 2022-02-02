import { useState } from "react";

/**
 * Types that can be compare ordinally.
 */
export type Comparable =
  | string
  | bigint
  | number
  | boolean
  | Date
  | null
  | undefined;

/**
 * Initialize an array with a function.
 */
export interface ArrayFrom<T> {
  /**
   * Initial length of the array.
   */
  length: number;

  /**
   * Function to initialize the array.
   */
  fn: (index: number) => T;
}

/**
 * Initial value of an array.
 */
export type InitializeArray<T> = T[] | ArrayFrom<T>;

/**
 * Compares two items.
 */
export type Compare<T> = (a: T, b: T) => number;

/**
 * Sets an array item.
 */
export type SetArrayItem<T> = T | ((prev: T) => T);

/**
 * A condition over a item.
 */
export type Predicate<T> = (item: T) => boolean;

/**
 * Hook to manage an array.
 */
export interface UseArray<T> {
  /**
   * Adds an item at the end of the array.
   */
  push: (item: T) => void;

  /**
   * Removes and returns the last item of the array.
   */
  pop: () => T;

  /**
   * Sets or replaces the item at the specified index.
   */
  set: (index: number, item: SetArrayItem<T>) => void;

  /**
   * Gets the item at the specified index.
   */
  get: (index: number) => T;

  /**
   * Inserts an item at the specified index.
   */
  insert: (index: number, item: T) => void;

  /**
   * Removes the item at the specified index.
   */
  remove: (index: number) => T;

  /**
   * Removes all items that match the predicate.
   */
  removeAll: (f: Predicate<T>) => number;

  /**
   * Replaces all items that match the predicate.
   */
  replaceAll: (item: T, f: Predicate<T>) => number;

  /**
   * Reverses the array.
   */
  reverse: () => void;

  /**
   * Swaps the items at the specified indices.
   */
  swap: (indexA: number, indexB: number) => void;

  /**
   * Slices the array.
   */
  slice: (start: number, end?: number) => T[];

  /**
   * Sorts the array with the specified comparer.
   */
  sort: (f?: Compare<T>) => void;

  /**
   * Sorts the array using the given item keys.
   */
  sortBy: (keySelector: (item: T) => Comparable) => void;

  /**
   * Sorts the array descending using the given item keys.
   */
  sortByDescending: (keySelector: (item: T) => Comparable) => void;

  /**
   * Removes all the elements of the array.
   */
  clear: () => void;

  /**
   * Performs a foreach on the array.
   */
  forEach: (fn: (item: T, index: number) => void) => void;

  /**
   * Returns a readonly view of the array.
   */
  view: ReadonlyArray<T>;

  /**
   * Gets the number of items in the array.
   */
  length: number;
}

/**
 * Creates a hook that allows you to manage an array.
 * @param init Initialize array.
 * @returns A hook that returns an array.
 */
export function useArray<T>(init?: InitializeArray<T>): UseArray<T> {
  const [arrayState, setArrayState] = useState<T[]>(createArray(init));

  const push = (item: T) => {
    setArrayState((arr) => [...arr, item]);
  };

  const pop = () => {
    const last = arrayState[arrayState.length - 1];
    setArrayState((arr) => arr.slice(0, -1));
    return last;
  };

  const set = (index: number, item: SetArrayItem<T>) => {
    const newArray = [...arrayState];

    if (typeof item === "function") {
      newArray[index] = (item as (prev: T) => T)(newArray[index]);
    } else {
      newArray[index] = item;
    }
    setArrayState(newArray);
  };

  const get = (index: number) => arrayState[index];

  const insert = (index: number, item: T) => {
    const newArray = [...arrayState];
    newArray.splice(index, 0, item);
    setArrayState(newArray);
  };

  const remove = (index: number) => {
    const item = arrayState[index];
    setArrayState((arr) => arr.filter((_, i) => i !== index));
    return item;
  };

  const removeAll = (f: Predicate<T>) => {
    const removed = arrayState.filter(f);
    setArrayState((arr) => arr.filter((_, i) => !removed.includes(arr[i])));
    return arrayState.length - removed.length;
  };

  const replaceAll = (item: T, f: Predicate<T>) => {
    const newArray = [...arrayState];
    let count = 0;

    for (let i = 0; i < newArray.length; i++) {
      if (f(newArray[i])) {
        newArray[i] = item;
        count++;
      }
    }

    setArrayState(newArray);
    return count;
  };

  const reverse = () => {
    const newArray = [...arrayState];
    newArray.reverse();
    setArrayState(newArray);
  };

  const swap = (indexA: number, indexB: number) => {
    const newArray = [...arrayState];
    const temp = newArray[indexA];
    newArray[indexA] = newArray[indexB];
    newArray[indexB] = temp;
    setArrayState(newArray);
  };

  const slice = (start: number, end?: number) => {
    return arrayState.slice(start, end);
  };

  const sort = (f?: Compare<T>) => {
    const newArray = [...arrayState];
    newArray.sort(f);
    setArrayState(newArray);
  };

  const sortBy = (keySelector: (item: T) => Comparable) => {
    const newArray = [...arrayState];
    newArray.sort((a, b) => {
      const keyA = keySelector(a);
      const keyB = keySelector(b);

      if (keyA == null) {
        return -1;
      }

      if (keyB == null) {
        return 1;
      }

      if (keyA < keyB) {
        return -1;
      }
      if (keyA > keyB) {
        return 1;
      }
      return 0;
    });

    setArrayState(newArray);
  };

  const sortByDescending = (keySelector: (item: T) => Comparable) => {
    const newArray = [...arrayState];
    newArray.sort((a, b) => {
      const keyA = keySelector(a);
      const keyB = keySelector(b);

      if (keyA == null) {
        return 1;
      }

      if (keyB == null) {
        return -1;
      }

      if (keyA > keyB) {
        return -1;
      }

      if (keyA < keyB) {
        return 1;
      }

      return 0;
    });

    setArrayState(newArray);
  };

  const clear = () => setArrayState([]);

  const forEach = (fn: (item: T, index: number) => void) => {
    arrayState.forEach(fn);
  };

  return {
    push,
    pop,
    set,
    get,
    insert,
    remove,
    removeAll,
    replaceAll,
    reverse,
    swap,
    slice,
    sort,
    sortBy,
    sortByDescending,
    forEach,
    clear,
    view: arrayState,
    length: arrayState.length,
  };
}

function createArray<T>(init: InitializeArray<T> | undefined): T[] {
  if (Array.isArray(init)) {
    return init;
  }

  if (typeof init === "object") {
    const arr = new Array(init.length);
    for (let i = 0; i < init.length; i++) {
      arr[i] = init.fn(i);
    }
    return arr;
  }

  return [];
}
