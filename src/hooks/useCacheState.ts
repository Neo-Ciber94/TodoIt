import { useEffect, useRef, useState } from "react";
import { StorageCache } from "src/client/caching/storage-cache";

const CACHE_VALUE_KEY = "__cache_value__";

/**
 * An initial value.
 */
export type InitialValue<T> = T | (() => T);

/**
 * Options for `useCacheState`.
 */
export interface CachingOptions {
  /**
   * The namespace used.
   */
  namespace?: string;

  /**
   * The key for the value to cache.
   */
  key?: string;

  /**
   * The max TTL (Time To Live) in milliseconds for the value in cache.
   */
  ttl?: number;

  /**
   * The storage to use, defaults to `window.localStorage`.
   */
  storage?: Storage;
}

/**
 * Creates a `useState` hook that will cache the value.
 * @param initialState The default value is not value is cached.
 * @param options The options used to cache the value.
 * @returns An array of [state, setState].
 */
// prettier-ignore
export function useCacheState<T>(initialState: InitialValue<T>, options: CachingOptions = {}) {
  const [state, setState] = useState<T>(initialState);
  const cacheRef = useRef(getStorage<T>(options.storage, options.namespace));

  const setCacheState = (newState: T) => {
    setState(newState);
    cacheRef.current.set(options.key || CACHE_VALUE_KEY, newState, {
      ttl: options.ttl,
    });
  };

  useEffect(() => {
    const key = options.key || CACHE_VALUE_KEY;
    const cache = cacheRef.current;
    const value = cache.get(key);

    if (value) {
        setState(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [state, setCacheState];
}

export function useCachedValue<T>(
  defaultValue: InitialValue<T>,
  options: CachingOptions = {},
  f: (value: T) => void
) {
  useEffect(() => {}, []);
}

function getStorage<T>(storage?: Storage, namespace?: string): StorageCache<T> {
  storage = storage || window.localStorage;
  return new StorageCache(storage, namespace);
}
