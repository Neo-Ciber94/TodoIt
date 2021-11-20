export default function isPromise(obj: any): boolean {
  return obj != null && typeof obj.then === "function";
}
