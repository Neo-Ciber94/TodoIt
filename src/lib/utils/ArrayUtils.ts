export module ArrayUtils {
  export function getOrArray<T>(value: T | T[]): T[] {
    if (Array.isArray(value)) {
      return value;
    }

    return [value];
  }
}
