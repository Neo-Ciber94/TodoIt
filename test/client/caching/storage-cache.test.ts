import { LocalStorageCache } from "src/client/caching/storage-cache";

describe("LocalStorageCache test", () => {
  let cache: LocalStorageCache<string>;

  beforeEach(() => {
    cache = new LocalStorageCache("test1");
    cache.clear();
  });

  test("Should set and get value", () => {
    cache.set("key", "value");
    expect(cache.get("key")).toBe("value");
  });

  test("Should remove value", () => {
    cache.set("key", "123");
    expect(cache.get("key")).toBe("123");

    const removedValue = cache.remove("key");
    expect(removedValue).toBe("123");
    expect(cache.get("key")).toBeUndefined();
  });

  test("Should contains value", () => {
    cache.set("number", "123");
    expect(cache.contains("number")).toBeTruthy();
  });

  test("Should clear", () => {
    cache.set("one", "1");
    cache.set("two", "2");
    cache.set("three", "3");

    expect(cache.length).toBe(3);
    cache.clear();
    expect(cache.length).toBe(0);
  });
});

describe("LocalStorageCache with ttl", () => {
  let cache: LocalStorageCache<number> = new LocalStorageCache<number>("test2");

  beforeEach(() => {
    cache = new LocalStorageCache<number>("test2");
    cache.clear();
  });

  test("Should set and get value with ttl", async () => {
    cache.set("key", 123, { ttl: 1000 });
    expect(cache.get("key")).toBe(123);
    await delay(2000);
    expect(cache.get("key")).toBeUndefined();
  });

  test("Should refresh value with ttl", async () => {
    cache.set("one", 1, { ttl: 2000 });
    expect(cache.get("one")).toBe(1);

    await delay(1500);
    expect(cache.get("one")).toBe(1);
    cache.refresh("one");

    await delay(1500);
    expect(cache.get("one")).toBe(1);
  });

  test("Should refresh with new ttl", async () => {
    cache.set("even", 246, { ttl: 500 });
    expect(cache.get("even")).toBe(246);

    cache.refresh("even", { ttl: 1000 });
    await delay(500);

    expect(cache.get("even")).toBe(246);
  });

  test("Should not refresh expired", async () => {
    cache.set("odd", 357, { ttl: 100 });
    await delay(1000);
    
    cache.refresh("odd");
    expect(cache.get("odd")).toBeUndefined();
  });
});

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
