import { getMetadataStorage, Middleware } from "..";

/**
 * Register a middleware for a given route or entire controller.
 * @param middleware The middleware to register.
 */
export function UseMiddleware<Req, Res>(middleware: Middleware<Req, Res>) {
  return function (target: any, methodName?: string) {
    // If the target is no a method but a class, methodName will be undefined
    if (methodName) {
      getMetadataStorage().addMiddleware({
        target: target.constructor,
        methodName,
        handler: middleware,
      });
    } else {
      getMetadataStorage().addMiddleware({
        target,
        handler: middleware,
      });
    }
  };
}