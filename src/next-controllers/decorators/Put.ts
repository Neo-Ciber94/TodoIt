import { getMetadataStorage } from "../core/metadata";


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
