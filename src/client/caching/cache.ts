/**
 * Cache options.
 */
export interface CacheOptions {
  /**
   * Time to live of the item in milliseconds.
   * The item will be removed after the given time.
   */
  ttl?: number;
}

/**
 * Represents a cache of items.
 */
export interface ICache<T> {
  /**
   * The number of items in the cache.
   */
  get length(): number;

  /**
   * Creates or replaces an item in the cache.
   * @param key The key of the item.
   * @param value The value of the item.
   * @param options The options used to cache the item.
   */
  set(key: string, value: T, options?: CacheOptions): void;

  /*
   * Gets the value of the item with the given key.
   * @param key The key of the item.
   */
  get(key: string): T | undefined;

  /**
   * Removes the item with the given key.
   * @param key The key of the item.
   */
  remove(key: string): T | undefined;

  /**
   * Refresh the TTL (Time to live) of an item.
   * @param key The key of the item.
   * @param options The options used to refresh the item.
   */
  refresh(key: string, options?: CacheOptions): void;

  /**
   * Checks whether if this cache contains an item with the given key.
   * @param key The key to check.
   */
  contains(key: string): boolean;

  /**
   * Clears the cache.
   */
  clear(): void;
}
