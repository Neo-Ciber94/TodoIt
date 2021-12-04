import { getMetadataStorage, ObjectType } from "..";

export const DEFAULT_CONTROLLER_CONFIG: RouteControllerConfig = {
  statusCodeOnNull: 404,
  statusCodeOnUndefined: 404,
  context: false,
};

/**
 * Configuration for an ``@RouteController`` decorator.
 */
export interface RouteControllerConfig {
  /**
   * Status code to return when `null` is returned from the controller method, default is `404`.
   */
  statusCodeOnNull: number;

  /**
   * Status code to return when `undefined` is returned from the controller method, default is `404`.
   */
  statusCodeOnUndefined: number;

  /**
   * If `true` will inject a `HttpContext` to this controller.
   */
  context: boolean | Record<string, any>;
}

/**
 * Register a route controller.
 */
export function RouteController(config?: Partial<RouteControllerConfig>) {
  return function (constructor: ObjectType<any>) {
    getMetadataStorage().addController({
      target: constructor,
      config: {
        ...DEFAULT_CONTROLLER_CONFIG,
        ...config,
      },
    });
  };
}
