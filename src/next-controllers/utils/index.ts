
/**
 * Gets the value for the given property.
 * @param obj The object.
 * @param key The key of the property to get.
 * @returns The value of the given property.
 */
export function getValue<T = any>(obj: any, key: string): T | undefined{
  return obj[key];
}
