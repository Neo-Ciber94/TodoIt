import { getMetadataStorage, ObjectType } from "..";

/**
 * Register a route controller.
 */
export function RouteController() {
  return function (constructor: ObjectType<any>) {
    getMetadataStorage().addController({
      target: constructor,
    });
  };
}
