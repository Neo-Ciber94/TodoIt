import { getMetadataStorage } from "..";

export const DEFAULT_CONTEXT_CONFIG: ContextConfig = Object.freeze({
  state: {},
});

/**
 * Configuration for the context decorator.
 */
export interface ContextConfig<TState extends object = Record<string, any>> {
  /**
   * Initial state of the context.
   */
  state: TState;
}

export function Context(config?: Partial<ContextConfig>) {
  return function (target: any, propertyKey: string) {
    getMetadataStorage().addContext({
      target: target.constructor,
      propertyName: propertyKey,
      config: {
        ...DEFAULT_CONTEXT_CONFIG,
        ...config,
      },
    });
  };
}
