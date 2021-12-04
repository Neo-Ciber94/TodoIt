import { getMetadataStorage } from "../core/metadata";

/**
 * Register a handler for 'PUT' requests.
 * @param pattern Pattern for matching the route.
 */
export default function Put(pattern?: string | RegExp) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "PUT",
      methodName,
    });
  };
}
