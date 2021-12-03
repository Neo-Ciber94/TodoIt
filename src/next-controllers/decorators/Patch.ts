import { getMetadataStorage } from "../core/metadata";


export function Patch(pattern?: string | RegExp) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "PATCH",
      methodName,
    });
  };
}
