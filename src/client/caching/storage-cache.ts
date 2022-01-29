import { MemoryStorage } from "../storage/memory-storage";
import { CacheOptions, ICache } from "./cache";

const DEFAULT_NAMESPACE = "default-cache";

export interface CacheItem<T> {
  value: T;
  ttl?: number;
  expires?: string; // Date is stored as ISO format string
}

export class StorageCache<T> implements ICache<T> {
  private readonly timeouts = new Map<string, number>();

  constructor(
    protected readonly storage: Storage,
    protected readonly namespace: string = DEFAULT_NAMESPACE
  ) {
    this.load();
  }

  get length(): number {
    return this.storage.length;
  }

  set(key: string, value: T, options?: CacheOptions): void {
    const newKey = this.keyFor(this.namespace, key);

    // Remove existing, if any
    this.removeCacheItem(newKey);
    const ttl = options && options.ttl;
    const expires = ttl ? new Date(Date.now() + ttl).toISOString() : undefined;
    const item: CacheItem<T> = { value, expires, ttl };
    this.storage.setItem(newKey, JSON.stringify(item));

    if (expires) {
      this.scheduleDelete(newKey, ttl || 0);
    }
  }

  get(key: string): T | undefined {
    key = this.keyFor(this.namespace, key);
    const cacheItem = this.getCacheItem(key);
    return cacheItem?.value;
  }

  remove(key: string): T | undefined {
    key = this.keyFor(this.namespace, key);
    return this.removeCacheItem(key)?.value;
  }

  refresh(key: string, options?: CacheOptions): void {
    const newKey = this.keyFor(this.namespace, key);
    const cacheItem = this.getCacheItem(newKey);

    if (cacheItem == null) {
      return;
    }

    const ttl = options?.ttl || cacheItem.ttl;
    this.set(key, cacheItem.value, { ttl });
  }

  contains(key: string): boolean {
    return this.get(key) != null;
  }

  clear(): void {
    this.storage.clear();
    this.timeouts.forEach((timeout) => window.clearTimeout(timeout));
    this.timeouts.clear();
  }

  private keyFor(namespace: string, key: string): string {
    return `${namespace}:${key}`;
  }

  private removeCacheItem(key: string): CacheItem<T> | undefined {
    if (key && !key.includes(":")) {
      throw new Error(`Invalid key: ${key}`);
    }
    const cacheItem = this.getCacheItem(key);

    if (cacheItem == null) {
      return undefined;
    }

    this.storage.removeItem(key);
    const timeout = this.timeouts.get(key);

    if (timeout) {
      window.clearTimeout(timeout);
      this.timeouts.delete(key);
    }

    return cacheItem;
  }

  private getCacheItem(key: string): CacheItem<T> | undefined {
    if (key && !key.includes(":")) {
      throw new Error(`Invalid key: ${key}`);
    }
    const item = this.storage.getItem(key);

    if (!item) {
      return undefined;
    }

    try {
      return JSON.parse(item) as CacheItem<T>;
    } catch {
      return undefined;
    }
  }

  private scheduleDelete(key: string, ms: number) {
    if (key && !key.includes(":")) {
      throw new Error(`Invalid key: ${key}`);
    }
    if (ms <= 0) {
      this.removeCacheItem(key);
      return;
    }

    const timeout = window.setTimeout(() => {
      this.removeCacheItem(key);
      this.timeouts.delete(key);
    }, ms);
    this.timeouts.set(key, timeout);
  }

  private load() {
    const length = this.storage.length;

    for (let i = 0; i < length; i++) {
      const key = this.storage.key(i);

      if (key == null) {
        continue;
      }

      const cacheItem = parseString<CacheItem<T>>(this.storage.getItem(key));

      if (cacheItem == null) {
        continue;
      }

      // prettier-ignore
      const isExpired = cacheItem.expires && new Date(cacheItem.expires) < new Date();

      if (isExpired) {
        this.removeCacheItem(key);
      } else if (cacheItem.ttl) {
        this.scheduleDelete(key, cacheItem.ttl);
      }
    }
  }
}

function parseString<T>(s: string | null | undefined): T | null {
  if (s == null) {
    return null;
  }

  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

export class LocalStorageCache<T> extends StorageCache<T> {
  constructor(namespace: string = DEFAULT_NAMESPACE) {
    super(window.localStorage, namespace);
  }
}

export class SessionStorageCache<T> extends StorageCache<T> {
  constructor(namespace: string = DEFAULT_NAMESPACE) {
    super(window.sessionStorage, namespace);
  }
}

export class MemoryStorageCache<T> extends StorageCache<T> {
  constructor(namespace: string = DEFAULT_NAMESPACE) {
    super(new MemoryStorage(), namespace);
  }
}
