export class MemoryStorage implements Storage {
  [name: string]: any;

  get length(): number {
    return Object.values(this).filter((x) => typeof x === "string").length;
  }

  setItem(key: string, value: string): void {
    this[key] = value;
  }

  getItem(key: string): string | null {
    return this[key] || null;
  }

  removeItem(key: string): void {
    delete this[key];
  }

  key(index: number): string | null {
    return Object.keys(this)[index] || null;
  }

  clear(): void {
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        delete this[key];
      }
    }
  }
}
