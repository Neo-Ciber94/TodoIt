import { getMetadataStorage } from "../core/metadata";


export function Head(pattern?: string | RegExp) {
  return function (target: any, methodName: string) {
    getMetadataStorage().addAction({
      target: target.constructor,
      pattern: pattern,
      method: "HEAD",
      methodName,
    });
  };
}
