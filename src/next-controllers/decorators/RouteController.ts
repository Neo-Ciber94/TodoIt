import { getMetadataStorage, ObjectType } from "..";

export function RouteController() {
  return function (constructor: ObjectType<any>) {
    getMetadataStorage().addController({
      target: constructor,
    });
  };
}
