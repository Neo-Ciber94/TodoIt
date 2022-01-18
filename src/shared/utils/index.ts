export default function isPromise(obj: any): boolean {
  return obj != null && typeof obj.then === "function";
}

export function noop(...args: any[]): any {}

export function parseRecord(record: Record<string, string | string[]>): object {
  const result: Record<string, unknown> = {};

  for (let [key, value] of Object.entries(record)) {
    // If is representing an array
    if (key.endsWith("[]")) {
      key = key.slice(0, -2);
    }

    result[key] = Array.isArray(value)
      ? value.map(parseString)
      : parseString(value);
  }

  return result;
}

export function parseString(s: string): boolean | number | Date | string {
  if (s === "true" || s === "false") {
    return s === "true";
  }

  const n = Number(s);
  if (!isNaN(n)) {
    return n;
  }

  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    return d;
  }

  return s;
}
