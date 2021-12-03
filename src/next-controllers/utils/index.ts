export function getValue<T = any>(obj: any, key: string): T {
  return obj[key];
}
