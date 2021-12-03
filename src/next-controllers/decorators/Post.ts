import { getMetadataStorage } from "../core/metadata";


export function Post(pattern?: string | RegExp) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "POST",
      methodName,
    });
  };
}
