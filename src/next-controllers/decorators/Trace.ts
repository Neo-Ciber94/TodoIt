import { getMetadataStorage } from "../core/metadata";

/**
 * Register a handler for 'TRACE' requests.
 * @param pattern Pattern for matching the route.
 */
export function Trace(pattern?: string | RegExp) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "TRACE",
      methodName,
    });
  };
}
