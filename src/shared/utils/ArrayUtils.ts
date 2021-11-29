export module ArrayUtils {
  export function range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  }

  export function getOrArray<T>(value: T | T[]): T[] {
    if (Array.isArray(value)) {
      return value;
    }

    return [value];
  }
}
