import { getMetadataStorage, ObjectType } from "..";

export function OnError() {
  return function (target: ObjectType<any>, methodName: string) {
    getMetadataStorage().addErrorHandler({
      target: target,
      methodName,
    });
  };
}
