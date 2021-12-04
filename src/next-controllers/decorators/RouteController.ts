import { getMetadataStorage, ObjectType } from "..";

export const DEFAULT_CONTROLLER_CONFIG: RouteControllerConfig = Object.freeze({
  statusCodeOnNull: 404,
  statusCodeOnUndefined: 404,
});

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
