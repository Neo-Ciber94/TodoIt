import { getMetadataStorage } from "../core/metadata";

/**
 * Register a handler for 'GET' requests.
 * @param pattern Pattern for matching the route.
 */
export function Get(pattern?: string | RegExp) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "GET",
      methodName,
    });
  };
}
